import {
  GatsbyFunctionConfig,
  GatsbyFunctionRequest,
  GatsbyFunctionResponse
} from 'gatsby'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import emailjs from '@emailjs/nodejs'
import { buildDeliveryCheckEmailHtml } from '../utilities/buildDeliveryCheckEmailHtml'

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
const SITE_URL = (process.env.SITE_URL || 'https://uuuk.it').replace(/\/$/, '')

type OrderData = {
  orderId?: string
  sessionId?: string
  status?: string // "paid", "expired", "pending", "error", "failed"
  trackingCode?: string
  updatedAt?: string
  createdAt?: string
  isTest?: boolean
  'order-status'?: string // "in-preparazione", "spedito", "consegnato"
  customer_details?: {
    name?: string
    email?: string
  }
  shipping_details?: {
    name?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      postal_code?: string
      state?: string
      country?: string
    }
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
  deliveryCheckNotification?: {
    sent?: boolean
    lastSentAt?: string
    attemptedAt?: string
    reason?: string | null
    recipient?: string | null
    confirmUrl?: string | null
    reviewUrl?: string | null
  }
  emailNotification?: {
    confirmation?: {
      sentAt?: string | null
      recipient?: string | null
      subject?: string | null
      status?: 'pending' | 'sent' | 'failed'
      reason?: string | null
    }
    shipped?: {
      sentAt?: string | null
      recipient?: string | null
      subject?: string | null
      status?: 'pending' | 'sent' | 'failed'
      reason?: string | null
    }
    deliveryCheck?: {
      sentAt?: string | null
      recipient?: string | null
      subject?: string | null
      status?: 'pending' | 'sent' | 'failed'
      reason?: string | null
      confirmUrl?: string | null
      reviewUrl?: string | null
    }
    custom?: Array<Record<string, unknown>>
  }
}

/**
 * Normalize a status string to a canonical value, handling Italian/English, case, dashes, underscores, and spaces.
 * Returns: 'consegnato' | 'spedito' | 'in preparazione' | 'skip' | 'other'
 */
const normalizeShippingStatus = (
  raw: string
): 'consegnato' | 'spedito' | 'in preparazione' | 'other' => {
  const s = (raw || '')
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
  if (['consegnato', 'delivered', 'completed'].includes(s)) return 'consegnato'
  if (
    ['spedito', 'shipped', 'in transit', 'intransit', 'in transito'].includes(s)
  )
    return 'spedito'
  if (
    [
      'in preparazione',
      'inpreparazione',
      'preparazione',
      'preparing',
      'processing',
      'in process',
      'inprocess'
    ].includes(s)
  )
    return 'in preparazione'
  return 'other'
}

/**
 * Normalize a payment status string to a canonical value, handling Italian/English, case, dashes, underscores, and spaces.
 * Returns: 'paid' | 'pending' | 'expired' | 'failed' | 'other'
 */
const normalizePaymentStatus = (
  raw: string
): 'paid' | 'pending' | 'expired' | 'failed' | 'other' => {
  const s = (raw || '')
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
  if (
    [
      'paid',
      'pagato',
      'completato',
      'completed',
      'success',
      'successo'
    ].includes(s)
  )
    return 'paid'
  if (
    [
      'pending',
      'in attesa',
      'attesa',
      'awaiting',
      'in attesa pagamento',
      'awaiting payment'
    ].includes(s)
  )
    return 'pending'
  if (['expired', 'scaduto', 'scaduta'].includes(s)) return 'expired'
  if (
    [
      'failed',
      'errore',
      'error',
      'cancellato',
      'canceled',
      'cancelled'
    ].includes(s)
  )
    return 'failed'
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
  orderUrl?: string
  emailAddress?: string
}): Promise<{ sent: boolean; reason: string | null }> => {
  try {
    // Build inline keyboard if orderUrl or emailAddress is provided
    let replyMarkup: any = undefined
    if (params.orderUrl) {
      let orderButton = null
      if (params.orderUrl && /^https?:\/\//.test(params.orderUrl)) {
        orderButton = { text: 'Vedi ordine', url: params.orderUrl }
      }
      if (orderButton) {
        replyMarkup = {
          inline_keyboard: [[orderButton]]
        }
      }
    }
    const body: any = {
      chat_id: params.chatId,
      message_thread_id: params.topicId,
      text: params.text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }
    if (replyMarkup) {
      body.reply_markup = replyMarkup
    }
    const response = await fetch(
      `https://api.telegram.org/bot${params.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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

const sendDeliveryCheckEmail = async (params: {
  toEmail: string
  toName: string
  orderId: string
  shippingName: string
  shippingAddress: string
  confirmUrl: string
  reviewUrl: string
}) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_DELIVERY_CHECK_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return {
      sent: false,
      reason: 'EmailJS configuration is missing'
    }
  }

  if (!params.toEmail.trim()) {
    return {
      sent: false,
      reason: 'Customer email is missing'
    }
  }

  const html = buildDeliveryCheckEmailHtml({
    toName: params.toName,
    orderId: params.orderId,
    shippingName: params.shippingName,
    shippingAddress: params.shippingAddress,
    ctaUrl: params.confirmUrl,
    reviewUrl: params.reviewUrl,
    recipientEmail: params.toEmail,
    actionText: '✓ Sì, ho ricevuto il mio ordine',
    footerNote:
      'Dopo la conferma puoi lasciare una recensione dalla pagina feedback.'
  })

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        email: params.toEmail,
        to_email: params.toEmail,
        to_name: params.toName,
        order_id: params.orderId,
        shipping_name: params.shippingName,
        shipping_address: params.shippingAddress,
        confirm_url: params.confirmUrl,
        review_url: params.reviewUrl,
        html,
        html_body: html,
        object: {
          orderId: params.orderId,
          confirmUrl: params.confirmUrl,
          reviewUrl: params.reviewUrl
        },
        payload: JSON.stringify({
          orderId: params.orderId,
          confirmUrl: params.confirmUrl,
          reviewUrl: params.reviewUrl
        })
      },
      {
        publicKey,
        privateKey
      }
    )

    try {
      await db.collection('emailjs_events').add({
        createdAt: new Date().toISOString(),
        success: true,
        source: 'delivery_check',
        toEmail: params.toEmail,
        orderId: params.orderId,
        confirmUrl: params.confirmUrl,
        reviewUrl: params.reviewUrl
      })
    } catch (err) {
      console.error('Failed to record emailjs event:', err)
    }

    return { sent: true, reason: null }
  } catch (error: any) {
    console.error('Delivery check email error:', error?.message || error)
    return { sent: false, reason: error?.message || 'Unknown EmailJS error' }
  }
}

const formatOrderMessage = (params: {
  order: OrderData
  lastUpdate: Date
  now: Date
  cooldownDays: number
}): string => {
  const orderPublicId = params.order.orderId || params.order.sessionId || 'N/A'
  const orderBackofficeUrl = `https://orders.uuuk.it/#/orders/${encodeURIComponent(
    orderPublicId
  )}`
  const customerName = params.order.customer_details?.name || 'N/A'
  const customerEmail = params.order.customer_details?.email || 'N/A'
  // Use shipping status for display, robust to language/case/format
  const shippingStatusNorm = normalizeShippingStatus(
    params.order['order-status'] || ''
  )
  let status: string
  switch (shippingStatusNorm) {
    case 'consegnato':
      status = 'consegnato'
      break
    case 'spedito':
      status = 'spedito'
      break
    case 'in preparazione':
      status = 'in preparazione'
      break
    default:
      status = params.order['order-status'] || 'Non specificato'
      break
  }
  // Get order issued date (createdAt) and last update date (updatedAt), formatted as dd/mm/yyyy
  const createdAtDate = getDateFromIso(params.order.createdAt)
  const updatedAtDate = getDateFromIso(params.order.updatedAt)
  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : 'N/A'
  const issuedDate = formatDate(createdAtDate)
  const lastUpdateDate = formatDate(updatedAtDate)
  // Amount paid (try order.amount or order.total or order.amountPaid)
  let amount: string = 'N/A'
  if ((params.order as any).amount) {
    amount = String((params.order as any).amount)
  } else if ((params.order as any).total) {
    amount = String((params.order as any).total)
  } else if ((params.order as any).amountPaid) {
    amount = String((params.order as any).amountPaid)
  }
  // Add euro symbol if looks like a number
  if (/^\d+(\.|,)?\d*$/.test(amount)) {
    amount = (parseFloat(amount) / 100).toFixed(2) + ' €'
  }
  // Calculate days since last update
  let daysSinceUpdate = 'N/A'
  if (updatedAtDate) {
    const ms = params.now.getTime() - updatedAtDate.getTime()
    daysSinceUpdate = String(Math.floor(ms / (24 * 60 * 60 * 1000)))
  }
  const lines = [
    `⚠️⚠️ Sono passati <b>${escapeHtml(
      daysSinceUpdate
    )}</b> giorni dall'ultimo aggiornamento! ⚠️⚠️\n\n`,
    `🆔 <a href="${escapeHtml(orderBackofficeUrl)}">${escapeHtml(
      orderPublicId
    )}</a>`,
    `👤 ${escapeHtml(customerName)}`,
    `✉️ ${escapeHtml(customerEmail)} \n`,
    `📅 ${escapeHtml(issuedDate)}`,
    `🔄 ${escapeHtml(lastUpdateDate)}\n`,
    `🚚 ${escapeHtml(status)}`,
    `💶 ${escapeHtml(amount)}`
  ]
  return lines.join('\n')
}

const getDeliveryCheckShippingName = (order: OrderData): string => {
  return order.shipping_details?.name || order.customer_details?.name || 'N/A'
}

const getDeliveryCheckShippingAddress = (order: OrderData): string => {
  const address = order.shipping_details?.address
  if (!address) return 'N/A'

  return [
    address.line1,
    address.line2,
    address.city,
    address.postal_code,
    address.state,
    address.country
  ]
    .filter(Boolean)
    .join(', ')
}

const buildDeliveryCheckUrls = (params: { orderId: string }) => {
  const confirmUrl = `${SITE_URL}/ordini/conferma-ricezione?orderId=${encodeURIComponent(
    params.orderId
  )}&livemode=true`
  const reviewUrl = `${SITE_URL}/feedback?source=delivery-check&orderId=${encodeURIComponent(
    params.orderId
  )}&livemode=true`

  return { confirmUrl, reviewUrl }
}

const buildDeliveryCheckEmailNotification = (params: {
  order: OrderData
  recipient: string | null
  sentAt: string | null
  status: 'pending' | 'sent' | 'failed'
  reason?: string | null
  confirmUrl: string
  reviewUrl: string
}) => {
  return {
    ...(params.order.emailNotification ?? {}),
    deliveryCheck: {
      sentAt: params.sentAt,
      recipient: params.recipient,
      subject: 'Il tuo ordine è arrivato?',
      status: params.status,
      reason: params.reason ?? null,
      confirmUrl: params.confirmUrl,
      reviewUrl: params.reviewUrl
    }
  }
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
  let deliveryChecksSent = 0
  let skippedDelivered = 0
  let skippedNotEligible = 0
  let skippedRecentNotification = 0
  let skippedInvalidDate = 0
  let skippedDeliveryCheckAlreadySent = 0
  let failed = 0
  let failedDeliveryChecks = 0

  for (const doc of overdueSnapshot.docs) {
    scanned += 1
    const order = (doc.data() || {}) as OrderData

    if (order.isTest === true) {
      continue
    }

    // Only send notification if payment status is 'paid' and shipping status is not 'consegnato', robust to language/case/format
    const paymentStatusNorm = normalizePaymentStatus(order.status || '')
    const shippingStatusNorm = normalizeShippingStatus(
      order['order-status'] || ''
    )
    if (paymentStatusNorm !== 'paid') {
      skippedNotEligible += 1
      continue
    }
    if (shippingStatusNorm === 'consegnato') {
      skippedDelivered += 1
      continue
    }

    const shippingCheckLastUpdate =
      getDateFromIso(order.updatedAt) || getDateFromIso(order.createdAt)

    if (!shippingCheckLastUpdate) {
      skippedInvalidDate += 1
      continue
    }

    const deliveryCheckCooldownMs = SEVEN_DAYS_MS
    const deliveryCheckSent = order.deliveryCheckNotification?.sent === true
    const deliveryCheckLastSentDate = getDateFromIso(
      order.deliveryCheckNotification?.lastSentAt ||
        order.deliveryCheckNotification?.attemptedAt
    )

    const shouldSendDeliveryCheck =
      shippingStatusNorm === 'spedito' &&
      nowMs - shippingCheckLastUpdate.getTime() >= deliveryCheckCooldownMs &&
      !deliveryCheckSent &&
      (!deliveryCheckLastSentDate ||
        nowMs - deliveryCheckLastSentDate.getTime() >= deliveryCheckCooldownMs)

    if (!shouldSendDeliveryCheck) {
      if (deliveryCheckSent) {
        skippedDeliveryCheckAlreadySent += 1
      }
    } else {
      const customerEmail = order.customer_details?.email || ''
      const customerName = order.customer_details?.name || 'Cliente'
      const shippingName = getDeliveryCheckShippingName(order)
      const shippingAddress = getDeliveryCheckShippingAddress(order)
      const urls = buildDeliveryCheckUrls({
        orderId: doc.id
      })

      if (!customerEmail) {
        failedDeliveryChecks += 1
        await doc.ref.set(
          {
            emailNotification: buildDeliveryCheckEmailNotification({
              order,
              recipient: null,
              sentAt: null,
              status: 'failed',
              reason: 'Missing customer email',
              confirmUrl: urls.confirmUrl,
              reviewUrl: urls.reviewUrl
            }),
            deliveryCheckNotification: {
              sent: false,
              reason: 'Missing customer email',
              recipient: null,
              confirmUrl: urls.confirmUrl,
              reviewUrl: urls.reviewUrl,
              attemptedAt: now.toISOString()
            }
          },
          { merge: true }
        )
      } else {
        const deliveryCheckResult = await sendDeliveryCheckEmail({
          toEmail: customerEmail,
          toName: customerName,
          orderId: doc.id,
          shippingName,
          shippingAddress,
          confirmUrl: urls.confirmUrl,
          reviewUrl: urls.reviewUrl
        })

        if (deliveryCheckResult.sent) {
          deliveryChecksSent += 1
        } else {
          failedDeliveryChecks += 1
        }

        await doc.ref.set(
          {
            emailNotification: buildDeliveryCheckEmailNotification({
              order,
              recipient: customerEmail,
              sentAt: deliveryCheckResult.sent ? now.toISOString() : null,
              status: deliveryCheckResult.sent ? 'sent' : 'failed',
              reason: deliveryCheckResult.reason,
              confirmUrl: urls.confirmUrl,
              reviewUrl: urls.reviewUrl
            }),
            deliveryCheckNotification: {
              sent: deliveryCheckResult.sent,
              reason: deliveryCheckResult.reason,
              recipient: customerEmail,
              confirmUrl: urls.confirmUrl,
              reviewUrl: urls.reviewUrl,
              attemptedAt: now.toISOString(),
              ...(deliveryCheckResult.sent
                ? { lastSentAt: now.toISOString() }
                : {})
            }
          },
          { merge: true }
        )
      }
    }

    const lastUpdateDate = shippingCheckLastUpdate

    if (!lastUpdateDate) {
      skippedInvalidDate += 1
      continue
    }

    // Use shipping status for cooldown logic
    const cooldownMs = getCooldownMs(
      shippingStatusNorm === 'spedito' ? 'spedito' : 'other'
    )
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

    // Prepare button links
    const orderUrl = `https://orders.uuuk.it/#/orders/${encodeURIComponent(
      order.orderId || order.sessionId || ''
    )}`
    const emailAddress = order.customer_details?.email || ''
    const telegramResult = await sendTelegramMessage({
      botToken,
      chatId,
      topicId,
      text: message,
      orderUrl,
      emailAddress
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
    deliveryChecksSent,
    failed,
    failedDeliveryChecks,
    skipped: {
      delivered: skippedDelivered,
      notEligible: skippedNotEligible,
      recentNotification: skippedRecentNotification,
      invalidDate: skippedInvalidDate,
      deliveryCheckAlreadySent: skippedDeliveryCheckAlreadySent
    }
  })
}
