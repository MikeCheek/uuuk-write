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
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
const DEFAULT_TOPIC_ID = 9

type OrderData = {
  orderId?: string
  sessionId?: string
  status?: string
  trackingCode?: string
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

/** Returns 'consegnato' | 'spedito' | 'skip' | 'other' */
const normalizeOrderStatus = (
  raw: string
): 'consegnato' | 'spedito' | 'skip' | 'other' => {
  const s = raw.trim().toLowerCase()
  if (s === 'consegnato' || s === 'delivered' || s === 'completed')
    return 'consegnato'
  if (
    s === 'spedito' ||
    s === 'shipped' ||
    s === 'in_transit' ||
    s === 'in transit'
  )
    return 'spedito'
  if (s === 'failed' || s === 'pending' || s === 'expired') return 'skip'
  return 'other'
}

// Only called after 'consegnato' and 'skip' statuses have been filtered out.
const getCooldownMs = (normalizedStatus: 'spedito' | 'other'): number =>
  normalizedStatus === 'spedito' ? SEVEN_DAYS_MS : THREE_DAYS_MS

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
  order: OrderData
  lastUpdate: Date
  now: Date
  cooldownDays: number
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

  const lines = [
    `⏰ <b>Ordine senza aggiornamenti da oltre ${escapeHtml(
      String(params.cooldownDays)
    )} giorni</b>`,
    `🔴 <b>⚠️ GIORNI SENZA UPDATE: ${escapeHtml(String(ageDays))} ⚠️</b>`,
    '',
    `<b>Order ID:</b> <a href="${escapeHtml(orderBackofficeUrl)}">${escapeHtml(
      orderPublicId
    )}</a>`,
    `<b>Stato:</b> ${escapeHtml(status)}`,
    `<b>Ultimo update:</b> ${escapeHtml(
      params.lastUpdate.toLocaleString('it-IT')
    )}`,
    `<b>Cliente:</b> ${escapeHtml(customerName)}`,
    `<b>Email:</b> ${escapeHtml(customerEmail)}`
  ]

  const normalizedStatus = normalizeOrderStatus(params.order.status || '')
  if (normalizedStatus === 'spedito' && !params.order.trackingCode) {
    lines.push('')
    lines.push(
      `⚠️ <b>Codice di tracciamento mancante!</b> Aggiungi il tracking code nell'ordine (vedi link sopra).`
    )
  }

  lines.push('')
  lines.push(
    `<b>Check eseguito:</b> ${escapeHtml(params.now.toLocaleString('it-IT'))}`
  )

  return lines.join('\n')
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
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
  // Query with the minimum cooldown (3 days) so both 3-day and 7-day candidates
  // are fetched. Per-status cooldown is enforced in the loop below.
  const cutoffIso = new Date(nowMs - THREE_DAYS_MS).toISOString()

  const overdueSnapshot = await db
    .collection('orders')
    .where('updatedAt', '<=', cutoffIso)
    .get()

  let scanned = 0
  let eligible = 0
  let sent = 0
  let skippedDelivered = 0
  let skippedNotEligible = 0
  let skippedRecentNotification = 0
  let skippedInvalidDate = 0
  let failed = 0

  for (const doc of overdueSnapshot.docs) {
    scanned += 1
    const order = (doc.data() || {}) as OrderData

    if (order.isTest === true) {
      continue
    }

    const statusCategory = normalizeOrderStatus(order.status || '')

    if (statusCategory === 'consegnato') {
      skippedDelivered += 1
      continue
    }

    if (statusCategory === 'skip') {
      skippedNotEligible += 1
      continue
    }

    const lastUpdateDate =
      getDateFromIso(order.updatedAt) || getDateFromIso(order.createdAt)

    if (!lastUpdateDate) {
      skippedInvalidDate += 1
      continue
    }

    const cooldownMs = getCooldownMs(statusCategory)
    const cooldownDays = Math.round(cooldownMs / (24 * 60 * 60 * 1000))

    const lastSentDate = getDateFromIso(
      order.overdueUpdateNotification?.lastSentAt
    )

    if (lastSentDate) {
      // Repeat notification: respect per-status cooldown from last sent
      if (nowMs - lastSentDate.getTime() < cooldownMs) {
        skippedRecentNotification += 1
        continue
      }
    } else {
      // Initial notification: wait at least cooldownMs since last update
      if (nowMs - lastUpdateDate.getTime() < cooldownMs) {
        skippedRecentNotification += 1
        continue
      }
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
      order,
      lastUpdate: lastUpdateDate,
      now,
      cooldownDays
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
      notEligible: skippedNotEligible,
      recentNotification: skippedRecentNotification,
      invalidDate: skippedInvalidDate
    }
  })
}
