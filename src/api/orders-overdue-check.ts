import {
  GatsbyFunctionConfig,
  GatsbyFunctionRequest,
  GatsbyFunctionResponse
} from 'gatsby'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const config: GatsbyFunctionConfig = {
  bodyParser: {
    json: {
      type: 'application/json'
    }
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
  })
}

const db = getFirestore()

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
const DEFAULT_TOPIC_ID = 9
const OVERDUE_STATUS_DONE = 'consegnato'
const OVERDUE_STATUS_ELIGIBLE = 'paid'

type OrderData = {
  orderId?: string
  sessionId?: string
  status?: string
  updatedAt?: string
  createdAt?: string
  isTest?: boolean
  customer_details?: {
    name?: string
    email?: string
  }
  telegramNotification?: {
    chatId?: string | number
    topicId?: number
  }
  overdueUpdateNotification?: {
    sent?: boolean
    lastSentAt?: string
    attemptedAt?: string
    reason?: string | null
    chatId?: string | number
    topicId?: number
  }
}

const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (!value) return ''
  return Array.isArray(value) ? value[0] || '' : value
}

const getDateFromIso = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value.trim()) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const sendTelegramMessage = async (params: {
  botToken: string
  chatId: string | number
  topicId: number
  text: string
}): Promise<{ sent: boolean; reason: string | null }> => {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${params.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: params.chatId,
          message_thread_id: params.topicId,
          text: params.text,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Telegram API error: ${errorText}`)
    }

    return { sent: true, reason: null }
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error'
    console.error('orders-overdue-check telegram error:', reason)
    return { sent: false, reason }
  }
}

const formatOrderMessage = (params: {
  orderDocId: string
  order: OrderData
  lastUpdate: Date
  now: Date
}): string => {
  const customerName = params.order.customer_details?.name || 'N/A'
  const customerEmail = params.order.customer_details?.email || 'N/A'
  const status = params.order.status || 'N/A'
  const orderPublicId = params.order.orderId || params.order.sessionId || 'N/A'
  const orderBackofficeUrl = `https://orders.uuuk.it/#/orders/${encodeURIComponent(
    orderPublicId
  )}`
  const ageDays = Math.floor(
    (params.now.getTime() - params.lastUpdate.getTime()) / (24 * 60 * 60 * 1000)
  )

  return [
    '⏰ <b>Ordine senza aggiornamenti da oltre 3 giorni</b>',
    '',
    `<b>Order Doc:</b> ${escapeHtml(params.orderDocId)}`,
    `<b>Order ID:</b> <a href="${escapeHtml(orderBackofficeUrl)}">${escapeHtml(
      orderPublicId
    )}</a>`,
    `<b>Stato:</b> ${escapeHtml(status)}`,
    `<b>Ultimo update:</b> ${escapeHtml(
      params.lastUpdate.toLocaleString('it-IT')
    )}`,
    `<b>Giorni senza update:</b> ${escapeHtml(String(ageDays))}`,
    `<b>Cliente:</b> ${escapeHtml(customerName)}`,
    `<b>Email:</b> ${escapeHtml(customerEmail)}`,
    '',
    `<b>Check eseguito:</b> ${escapeHtml(params.now.toLocaleString('it-IT'))}`
  ].join('\n')
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const cronSecret =
    process.env.ORDERS_OVERDUE_CRON_SECRET || process.env.CRON_SECRET
  if (cronSecret) {
    const providedSecret =
      normalizeHeaderValue(
        req.headers['x-orders-overdue-cron-secret'] as
          | string
          | string[]
          | undefined
      ) ||
      normalizeHeaderValue(
        req.headers.authorization as string | string[] | undefined
      ).replace(/^Bearer\s+/i, '')

    if (!providedSecret || providedSecret !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const fallbackChatId = process.env.TELEGRAM_CHAT_ID
  const fallbackTopicIdRaw = process.env.TELEGRAM_TOPIC_ID

  if (!botToken || !fallbackChatId) {
    return res.status(500).json({
      error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'
    })
  }

  const fallbackTopicId = Number.parseInt(
    fallbackTopicIdRaw || String(DEFAULT_TOPIC_ID),
    10
  )

  const now = new Date()
  const nowMs = now.getTime()
  const cutoffIso = new Date(nowMs - THREE_DAYS_MS).toISOString()

  const overdueSnapshot = await db
    .collection('orders')
    .where('updatedAt', '<=', cutoffIso)
    .get()

  let scanned = 0
  let eligible = 0
  let sent = 0
  let skippedDelivered = 0
  let skippedNotPaid = 0
  let skippedRecentNotification = 0
  let skippedInvalidDate = 0
  let failed = 0

  for (const doc of overdueSnapshot.docs) {
    scanned += 1
    const order = (doc.data() || {}) as OrderData

    if (order.isTest === true) {
      continue
    }

    const normalizedStatus = (order.status || '').trim().toLowerCase()
    if (normalizedStatus === OVERDUE_STATUS_DONE) {
      skippedDelivered += 1
      continue
    }

    if (normalizedStatus !== OVERDUE_STATUS_ELIGIBLE) {
      skippedNotPaid += 1
      continue
    }

    const lastUpdateDate =
      getDateFromIso(order.updatedAt) || getDateFromIso(order.createdAt)

    if (!lastUpdateDate) {
      skippedInvalidDate += 1
      continue
    }

    const lastSentDate = getDateFromIso(
      order.overdueUpdateNotification?.lastSentAt
    )

    if (lastSentDate && nowMs - lastSentDate.getTime() < THREE_DAYS_MS) {
      skippedRecentNotification += 1
      continue
    }

    eligible += 1

    const chatId =
      order.overdueUpdateNotification?.chatId ||
      order.telegramNotification?.chatId ||
      fallbackChatId

    const topicId =
      order.overdueUpdateNotification?.topicId ||
      order.telegramNotification?.topicId ||
      fallbackTopicId

    const message = formatOrderMessage({
      orderDocId: doc.id,
      order,
      lastUpdate: lastUpdateDate,
      now
    })

    const telegramResult = await sendTelegramMessage({
      botToken,
      chatId,
      topicId,
      text: message
    })

    if (telegramResult.sent) {
      sent += 1
    } else {
      failed += 1
    }

    await doc.ref.set(
      {
        overdueUpdateNotification: {
          sent: telegramResult.sent,
          reason: telegramResult.reason,
          chatId,
          topicId,
          attemptedAt: now.toISOString(),
          ...(telegramResult.sent ? { lastSentAt: now.toISOString() } : {})
        }
      },
      { merge: true }
    )
  }

  return res.status(200).json({
    ok: true,
    scanned,
    eligible,
    sent,
    failed,
    skipped: {
      delivered: skippedDelivered,
      notPaid: skippedNotPaid,
      recentNotification: skippedRecentNotification,
      invalidDate: skippedInvalidDate
    }
  })
}
