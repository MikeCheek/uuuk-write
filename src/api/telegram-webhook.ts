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
const ORDER_COLLECTIONS = ['orders', 'orders-test'] as const
const ORDERS_PORTAL_BASE = 'https://orders.uuuk.it/#'

type TelegramChat = {
  id: number
  type?: string
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

type TelegramMessage = {
  message_id: number
  date?: number
  text?: string
  caption?: string
  chat: TelegramChat
  message_thread_id?: number
  from?: {
    id?: number
    is_bot?: boolean
    username?: string
    first_name?: string
    last_name?: string
  }
}

type TelegramUpdate = {
  update_id?: number
  message?: TelegramMessage
  edited_message?: TelegramMessage
  channel_post?: TelegramMessage
  edited_channel_post?: TelegramMessage
}

type OrderResult = {
  collection: typeof ORDER_COLLECTIONS[number]
  id: string
  data: Record<string, unknown>
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const toStringSafe = (value: unknown, fallback = 'N/A'): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return fallback
}

const formatAmount = (
  amountInMinor: unknown,
  currency: unknown,
  locale = 'it-IT'
): string => {
  if (typeof amountInMinor !== 'number') return 'N/A'

  const currencyCode =
    typeof currency === 'string' && currency.trim()
      ? currency.toUpperCase()
      : 'EUR'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amountInMinor / 100)
  } catch {
    return `${(amountInMinor / 100).toFixed(2)} ${currencyCode}`
  }
}

const formatDateTime = (value: unknown): string => {
  if (typeof value !== 'string' || !value.trim()) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('it-IT')
}

const normalizeHeaderValue = (value: string | string[] | undefined): string => {
  if (!value) return ''
  return Array.isArray(value) ? value[0] || '' : value
}

const pickOne = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)]
}

const sendTelegramMessage = async (params: {
  botToken: string
  chatId: string | number
  text: string
  parseMode?: 'HTML'
  messageThreadId?: number
}) => {
  const response = await fetch(
    `https://api.telegram.org/bot${params.botToken}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: params.chatId,
        text: params.text,
        parse_mode: params.parseMode,
        disable_web_page_preview: true,
        ...(typeof params.messageThreadId === 'number'
          ? { message_thread_id: params.messageThreadId }
          : {})
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram API error: ${errorText}`)
  }
}

const pickIncomingMessage = (
  update: TelegramUpdate
): TelegramMessage | null => {
  return (
    update.message ||
    update.edited_message ||
    update.channel_post ||
    update.edited_channel_post ||
    null
  )
}

const isAllowedOrdersChat = (
  chatId: number,
  allowedChatId: string | undefined
) => {
  if (!allowedChatId) return false
  return String(chatId) === String(allowedChatId)
}

const parseCommand = (
  raw: string
): { command: string; args: string[] } | null => {
  const text = raw.trim()
  if (!text.startsWith('/')) return null

  const tokens = text.split(/\s+/).filter(Boolean)
  if (!tokens.length) return null

  const command = tokens[0].split('@')[0].toLowerCase()
  const args = tokens.slice(1)

  return { command, args }
}

const findOrderByLookup = async (
  lookup: string
): Promise<OrderResult | null> => {
  const trimmed = lookup.trim()
  if (!trimmed) return null

  for (const collection of ORDER_COLLECTIONS) {
    const byDocId = await db.collection(collection).doc(trimmed).get()
    if (byDocId.exists) {
      return {
        collection,
        id: byDocId.id,
        data: (byDocId.data() || {}) as Record<string, unknown>
      }
    }

    const byOrderId = await db
      .collection(collection)
      .where('orderId', '==', trimmed)
      .limit(1)
      .get()

    if (!byOrderId.empty) {
      return {
        collection,
        id: byOrderId.docs[0].id,
        data: (byOrderId.docs[0].data() || {}) as Record<string, unknown>
      }
    }

    const bySessionId = await db
      .collection(collection)
      .where('sessionId', '==', trimmed)
      .limit(1)
      .get()

    if (!bySessionId.empty) {
      return {
        collection,
        id: bySessionId.docs[0].id,
        data: (bySessionId.docs[0].data() || {}) as Record<string, unknown>
      }
    }
  }

  return null
}

const getRecentOrders = async (
  limitCount: number,
  collectionFilter?: typeof ORDER_COLLECTIONS[number]
): Promise<OrderResult[]> => {
  const result: OrderResult[] = []

  const collections = collectionFilter ? [collectionFilter] : ORDER_COLLECTIONS

  for (const collection of collections) {
    const snap = await db
      .collection(collection)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get()

    for (const doc of snap.docs) {
      result.push({
        collection,
        id: doc.id,
        data: (doc.data() || {}) as Record<string, unknown>
      })
    }
  }

  result.sort((a, b) => {
    const aDateRaw = toStringSafe(a.data.createdAt || a.data.updatedAt, '')
    const bDateRaw = toStringSafe(b.data.createdAt || b.data.updatedAt, '')
    const aDate = aDateRaw ? new Date(aDateRaw).getTime() : 0
    const bDate = bDateRaw ? new Date(bDateRaw).getTime() : 0
    return bDate - aDate
  })

  return result.slice(0, limitCount)
}

const buildHelpMessage = (isAdminChat: boolean): string => {
  const wave = pickOne(['👋', '🙌', '✨'])
  const lines = [
    `${wave} Ciao! Sono il bot ordini UUUK.`,
    '',
    '<b>Comandi disponibili</b>',
    '• /start o /help - messaggio di benvenuto e guida',
    '• /order &lt;id&gt; - stato compatto di uno specifico ordine',
    '• /status - check rapido del bot',
    '• /ping - pong'
  ]

  if (isAdminChat) {
    lines.push('• /orders [n] - riepilogo compatto ultimi ordini live')
    lines.push('• /orders test [n] - riepilogo compatto ultimi ordini test')
    lines.push(
      '• /order &lt;id&gt; &lt;chatId&gt; - invia update ordine a un altro chatId'
    )
  }

  lines.push('', 'Esempi:', '• /order 9QfQjAt3Aq5naSgWnPL7')

  if (isAdminChat) {
    lines.push(
      '• /orders',
      '• /orders 12',
      '• /orders test',
      '• /orders test 12'
    )
  }

  return lines.join('\n')
}

const getCustomerName = (order: OrderResult): string => {
  const customerDetails = order.data.customer_details as
    | Record<string, unknown>
    | undefined
  const shippingDetails = order.data.shipping_details as
    | Record<string, unknown>
    | undefined

  const customerName = toStringSafe(customerDetails?.name, '')
  if (customerName) return customerName

  const shippingName = toStringSafe(shippingDetails?.name, '')
  if (shippingName) return shippingName

  return 'N/A'
}

const getStatusEmoji = (statusRaw: string): string => {
  const status = statusRaw.toLowerCase()
  if (status.includes('paid')) return '✅'
  if (status.includes('pending')) return '⏳'
  if (status.includes('fail')) return '❌'
  if (status.includes('cancel')) return '🚫'
  return '📦'
}

const getPaymentEmoji = (paymentStatusRaw: string): string => {
  const payment = paymentStatusRaw.toLowerCase()
  if (payment.includes('paid') || payment.includes('succeed')) return '💸'
  if (payment.includes('pending')) return '⌛'
  if (payment.includes('fail') || payment.includes('error')) return '⚠️'
  return '💳'
}

const buildBackofficeOrderLink = (order: OrderResult): string => {
  const suffix = order.collection === 'orders' ? 'orders' : 'orders-test'
  return `${ORDERS_PORTAL_BASE}/${suffix}/${order.id}`
}

const buildTrackingOrderLink = (order: OrderResult): string => {
  const base =
    order.collection === 'orders' ? 'https://uuuk.it' : 'https://dev.uuuk.it'
  return `${base}/ordini/${order.id}/`
}

const buildOrderMessage = (order: OrderResult): string => {
  const name = getCustomerName(order)
  const status = toStringSafe(order.data.status, 'unknown')
  const paymentStatus = toStringSafe(
    order.data.paymentStatus || order.data.payment_status,
    'N/A'
  )
  const checkoutStatus = toStringSafe(order.data.checkoutStatus, 'N/A')
  const createdAt = formatDateTime(order.data.createdAt)
  const amount = formatAmount(order.data.amount, order.data.currency)
  const statusEmoji = getStatusEmoji(status)
  const paymentEmoji = getPaymentEmoji(paymentStatus)
  const trackingLink = buildTrackingOrderLink(order)

  const lineItems = Array.isArray(order.data.orderLineItems)
    ? (order.data.orderLineItems as Array<Record<string, unknown>>).length
    : Array.isArray(order.data.items)
    ? (order.data.items as unknown[]).length
    : 0

  return [
    `${pickOne(['🧾', '📬', '📦'])} <b>Dettaglio ordine</b>`,
    `<b>Nome:</b> ${escapeHtml(name)}`,
    `<b>Stato:</b> ${statusEmoji} ${escapeHtml(status)}`,
    `<b>Pagamento:</b> ${paymentEmoji} ${escapeHtml(paymentStatus)}`,
    `<b>Checkout:</b> 🛒 ${escapeHtml(checkoutStatus)}`,
    `<b>Articoli:</b> 📚 ${lineItems}`,
    `<b>Totale:</b> 💰 ${escapeHtml(amount)}`,
    `<b>Creato:</b> 🕒 ${escapeHtml(createdAt)}`,
    `<b>Tracking:</b> <a href="${escapeHtml(
      trackingLink
    )}">Apri portale ordine</a>`
  ].join('\n')
}

const buildOrdersSummaryMessage = (orders: OrderResult[]): string => {
  if (!orders.length) {
    return 'Nessun ordine trovato.'
  }

  const statusCount = new Map<string, number>()

  const lines = orders.map(order => {
    const status = toStringSafe(order.data.status, 'unknown')
    const createdAt = formatDateTime(
      order.data.createdAt || order.data.updatedAt
    )
    const amount = formatAmount(order.data.amount, order.data.currency)
    const link = buildBackofficeOrderLink(order)
    const statusEmoji = getStatusEmoji(status)

    statusCount.set(status, (statusCount.get(status) || 0) + 1)

    return `• <a href="${escapeHtml(
      link
    )}">Apri ordine</a> | ${statusEmoji} ${escapeHtml(status)} | ${escapeHtml(
      amount
    )} | ${escapeHtml(createdAt)}`
  })

  const compactStatus = Array.from(statusCount.entries())
    .map(([status, count]) => `${status}:${count}`)
    .join('  ')

  return [
    `${pickOne(['🚀', '📊', '📦'])} <b>Ultimi ordini (${orders.length})</b>`,
    compactStatus ? `<b>Status:</b> ${escapeHtml(compactStatus)}` : '',
    '',
    ...lines
  ]
    .filter(Boolean)
    .join('\n')
}

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (webhookSecret) {
    const providedSecret = normalizeHeaderValue(
      req.headers['x-telegram-bot-api-secret-token'] as
        | string
        | string[]
        | undefined
    )

    if (!providedSecret || providedSecret !== webhookSecret) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return res.status(500).json({ error: 'Missing TELEGRAM_BOT_TOKEN' })
  }

  try {
    const update = (req.body || {}) as TelegramUpdate
    const message = pickIncomingMessage(update)

    // Telegram expects a fast 200 for updates that don't carry text messages.
    if (!message) {
      return res.status(200).json({ ok: true, ignored: 'no_message' })
    }

    const rawText = (message.text || message.caption || '').trim()
    const parsed = parseCommand(rawText)

    if (!parsed) {
      return res.status(200).json({ ok: true, ignored: 'not_a_command' })
    }

    const allowedChatId = process.env.TELEGRAM_CHAT_ID
    const isAdminChat = isAllowedOrdersChat(message.chat.id, allowedChatId)
    const threadId = message.message_thread_id

    if (parsed.command === '/start' || parsed.command === '/help') {
      await sendTelegramMessage({
        botToken,
        chatId: message.chat.id,
        text: buildHelpMessage(isAdminChat),
        parseMode: 'HTML',
        messageThreadId: threadId
      })

      return res.status(200).json({ ok: true })
    }

    if (parsed.command === '/ping') {
      await sendTelegramMessage({
        botToken,
        chatId: message.chat.id,
        text: 'pong',
        messageThreadId: threadId
      })

      return res.status(200).json({ ok: true })
    }

    if (parsed.command === '/status') {
      const modeLabel = isAdminChat ? 'admin chat' : 'public chat'
      await sendTelegramMessage({
        botToken,
        chatId: message.chat.id,
        text: `Bot online. Mode: ${modeLabel}. Time: ${new Date().toLocaleString(
          'it-IT'
        )}`,
        messageThreadId: threadId
      })

      return res.status(200).json({ ok: true })
    }

    if (parsed.command === '/orders' || parsed.command === '/recent') {
      if (!allowedChatId) {
        await sendTelegramMessage({
          botToken,
          chatId: message.chat.id,
          text: 'Comando non disponibile: TELEGRAM_CHAT_ID non configurato.',
          messageThreadId: threadId
        })
        return res.status(200).json({ ok: true })
      }

      if (!isAdminChat) {
        await sendTelegramMessage({
          botToken,
          chatId: message.chat.id,
          text: 'Comando non autorizzato in questa chat.',
          messageThreadId: threadId
        })
        return res.status(200).json({ ok: true })
      }

      const isTest = parsed.args[0]?.toLowerCase() === 'test'
      const limitArg = isTest ? parsed.args[1] : parsed.args[0]
      const requested = Number.parseInt(limitArg || '10', 10)
      const limit = Number.isFinite(requested)
        ? Math.min(Math.max(requested, 1), 30)
        : 10
      const targetCollection = isTest ? 'orders-test' : 'orders'

      const orders = await getRecentOrders(limit, targetCollection)
      const summary = buildOrdersSummaryMessage(orders)

      await sendTelegramMessage({
        botToken,
        chatId: message.chat.id,
        text: summary,
        parseMode: 'HTML',
        messageThreadId: threadId
      })

      return res
        .status(200)
        .json({ ok: true, command: '/orders', count: orders.length })
    }

    if (parsed.command === '/order') {
      const orderLookup = parsed.args[0]
      const targetChatId = parsed.args[1]

      if (!orderLookup) {
        await sendTelegramMessage({
          botToken,
          chatId: message.chat.id,
          text: 'Uso: /order <orderId|sessionId|documentId> [chatId]',
          messageThreadId: threadId
        })

        return res.status(200).json({ ok: true })
      }

      const order = await findOrderByLookup(orderLookup)

      if (!order) {
        await sendTelegramMessage({
          botToken,
          chatId: message.chat.id,
          text: `Ordine non trovato: ${orderLookup}`,
          messageThreadId: threadId
        })

        return res.status(200).json({ ok: true })
      }

      const orderMessage = buildOrderMessage(order)

      if (targetChatId) {
        if (!isAdminChat) {
          await sendTelegramMessage({
            botToken,
            chatId: message.chat.id,
            text: 'Solo la chat amministrativa puo inviare update a chatId esterni.',
            messageThreadId: threadId
          })

          return res.status(200).json({ ok: true })
        }

        await sendTelegramMessage({
          botToken,
          chatId: targetChatId,
          text: `Aggiornamento ordine richiesto dal supporto:\n\n${orderMessage}`,
          parseMode: 'HTML'
        })

        await sendTelegramMessage({
          botToken,
          chatId: message.chat.id,
          text: `Update inviato a chatId ${targetChatId}.`,
          messageThreadId: threadId
        })

        return res.status(200).json({ ok: true, forwardedTo: targetChatId })
      }

      await sendTelegramMessage({
        botToken,
        chatId: message.chat.id,
        text: orderMessage,
        parseMode: 'HTML',
        messageThreadId: threadId
      })

      return res.status(200).json({ ok: true, command: '/order' })
    }

    await sendTelegramMessage({
      botToken,
      chatId: message.chat.id,
      text: `Comando non riconosciuto: ${parsed.command}\n\n${buildHelpMessage(
        isAdminChat
      )}`,
      parseMode: 'HTML',
      messageThreadId: threadId
    })

    return res.status(200).json({ ok: true, command: 'unknown' })
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error'
    console.error('telegram-webhook error:', reason)
    return res.status(500).json({ error: reason })
  }
}
