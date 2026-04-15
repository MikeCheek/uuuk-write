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

type TelegramInlineKeyboardButton = {
  text: string
  callback_data: string
}

type TelegramInlineKeyboardMarkup = {
  inline_keyboard: TelegramInlineKeyboardButton[][]
}

type TelegramCallbackQuery = {
  id: string
  from: {
    id: number
    is_bot?: boolean
    first_name?: string
    last_name?: string
    username?: string
    language_code?: string
  }
  message?: TelegramMessage
  inline_message_id?: string
  chat_instance: string
  data?: string
}

type TelegramUpdate = {
  update_id?: number
  message?: TelegramMessage
  edited_message?: TelegramMessage
  channel_post?: TelegramMessage
  edited_channel_post?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

type OrderResult = {
  collection: typeof ORDER_COLLECTIONS[number]
  id: string
  data: Record<string, unknown>
}

type OrdersFilter = 'paid' | 'all'

type OrdersListState = {
  collection: typeof ORDER_COLLECTIONS[number]
  filter: OrdersFilter
  page: number
}

const ORDER_LIST_PAGE_SIZE = 5
const ORDER_LIST_CALLBACK_PREFIX = 'orders:list'

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
  replyMarkup?: TelegramInlineKeyboardMarkup
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
        ...(params.replyMarkup ? { reply_markup: params.replyMarkup } : {}),
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

const editTelegramMessage = async (params: {
  botToken: string
  chatId: string | number
  messageId: number
  text: string
  parseMode?: 'HTML'
  replyMarkup?: TelegramInlineKeyboardMarkup
}) => {
  const response = await fetch(
    `https://api.telegram.org/bot${params.botToken}/editMessageText`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: params.chatId,
        message_id: params.messageId,
        text: params.text,
        parse_mode: params.parseMode,
        disable_web_page_preview: true,
        ...(params.replyMarkup ? { reply_markup: params.replyMarkup } : {})
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram API error: ${errorText}`)
  }
}

const answerTelegramCallback = async (
  botToken: string,
  callbackQueryId: string
) => {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId
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

const parseOrdersListState = (
  args: string[]
): { collection: OrdersListState['collection']; filter: OrdersFilter } => {
  const normalizedArgs = args.map(arg => arg.trim().toLowerCase())

  return {
    collection: normalizedArgs.includes('test') ? 'orders-test' : 'orders',
    filter: normalizedArgs.includes('all') ? 'all' : 'paid'
  }
}

const parseOrdersCallbackData = (
  data: string | undefined
): OrdersListState | null => {
  if (!data || !data.startsWith(`${ORDER_LIST_CALLBACK_PREFIX}:`)) return null

  const [, , collectionRaw, filterRaw, pageRaw] = data.split(':')
  const collection = collectionRaw === 'orders-test' ? 'orders-test' : 'orders'
  const filter: OrdersFilter = filterRaw === 'all' ? 'all' : 'paid'
  const page = Number.parseInt(pageRaw || '1', 10)

  return {
    collection,
    filter,
    page: Number.isFinite(page) && page > 0 ? page : 1
  }
}

const getOrderStatusValue = (order: OrderResult): string => {
  return toStringSafe(
    order.data.status ||
      order.data.paymentStatus ||
      order.data.payment_status ||
      order.data.asyncPaymentStatus ||
      order.data.orderStatus ||
      order.data.order_status,
    ''
  )
    .trim()
    .toLowerCase()
}

const isPaidOrder = (order: OrderResult): boolean => {
  const status = getOrderStatusValue(order)
  return new Set(['paid', 'succeeded', 'succeed', 'success', 'completed']).has(
    status
  )
}

const getOrdersScopeLabel = (
  collection: OrdersListState['collection']
): string => (collection === 'orders-test' ? 'test' : 'live')

const getOrdersFilterLabel = (filter: OrdersFilter): string =>
  filter === 'all' ? 'tutti' : 'pagati'

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
  collectionFilter?: typeof ORDER_COLLECTIONS[number]
): Promise<OrderResult[]> => {
  const result: OrderResult[] = []

  const collections = collectionFilter ? [collectionFilter] : ORDER_COLLECTIONS

  for (const collection of collections) {
    const snap = await db
      .collection(collection)
      .orderBy('createdAt', 'desc')
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

  return result
}

const buildHelpMessage = (isAdminChat: boolean): string => {
  const wave = pickOne(['👋', '🙌', '✨'])
  const lines = [
    `${wave} Ciao! Sono UUUKBot.`,
    '',
    '<b>Comandi disponibili</b>',
    '• /start o /help - messaggio di benvenuto e guida',
    '• /order &lt;id&gt; - stato compatto di uno specifico ordine',
    '• /status - check rapido del bot',
    '• /ping - pong'
  ]

  if (isAdminChat) {
    lines.push('• /orders - ultimi ordini pagati live, paginati a 5')
    lines.push('• /orders all - tutti gli ordini live, paginati a 5')
    lines.push('• /orders test - ultimi ordini pagati test, paginati a 5')
    lines.push('• /orders test all - tutti gli ordini test, paginati a 5')
    lines.push(
      '• /order &lt;id&gt; &lt;chatId&gt; - invia update ordine a un altro chatId'
    )
  }

  lines.push('', 'Esempi:', '• /order xxxxxxxxxxxxxx')

  if (isAdminChat) {
    lines.push(
      '• /orders',
      '• /orders all',
      '• /orders test',
      '• /orders test all'
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

const getOrderStatusDisplay = (order: OrderResult): string => {
  const raw = toStringSafe(
    order.data.orderStatus || order.data.order_status || order.data.status,
    ''
  )

  const normalized = raw.trim().toLowerCase()

  if (
    normalized === 'in preparazione' ||
    normalized === 'preparazione' ||
    normalized === 'processing' ||
    normalized === 'in_preparazione'
  ) {
    return 'In preparazione'
  }

  if (
    normalized === 'spedito' ||
    normalized === 'shipped' ||
    normalized === 'in_transit' ||
    normalized === 'in transit'
  ) {
    return 'Spedito'
  }

  if (
    normalized === 'consegnato' ||
    normalized === 'delivered' ||
    normalized === 'completed'
  ) {
    return 'Consegnato'
  }

  return 'In preparazione'
}

const getShippingAddressDisplay = (order: OrderResult): string => {
  const shippingDetails = order.data.shipping_details as
    | Record<string, unknown>
    | undefined
  const nestedAddress = shippingDetails?.address as Record<string, unknown>

  const directAddress = toStringSafe(
    order.data.shippingAddress || order.data.shipping_address,
    ''
  ).trim()

  if (directAddress) return directAddress

  const line1 = toStringSafe(
    nestedAddress?.line1 || nestedAddress?.address1 || shippingDetails?.line1,
    ''
  ).trim()
  const line2 = toStringSafe(
    nestedAddress?.line2 || nestedAddress?.address2 || shippingDetails?.line2,
    ''
  ).trim()
  const city = toStringSafe(
    nestedAddress?.city || shippingDetails?.city,
    ''
  ).trim()
  const postalCode = toStringSafe(
    nestedAddress?.postal_code ||
      nestedAddress?.zip ||
      shippingDetails?.postal_code ||
      shippingDetails?.zip,
    ''
  ).trim()
  const state = toStringSafe(
    nestedAddress?.state || nestedAddress?.province || shippingDetails?.state,
    ''
  ).trim()
  const country = toStringSafe(
    nestedAddress?.country || shippingDetails?.country,
    ''
  ).trim()

  const compact = [line1, line2, city, postalCode, state, country]
    .filter(Boolean)
    .join(', ')

  return compact || 'N/A'
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
  const orderStatus = getOrderStatusDisplay(order)
  const paymentStatus = toStringSafe(
    //@ts-ignore
    order.data.shipping_details?.status ||
      order.data.paymentStatus ||
      order.data.payment_status,
    'N/A'
  )
  const shippingAddress = getShippingAddressDisplay(order)
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
    `<b>Order status:</b> ${statusEmoji} ${escapeHtml(orderStatus)}`,
    `<b>Payment status:</b> ${paymentEmoji} ${escapeHtml(paymentStatus)}`,
    `<b>Shipping address:</b> 📍 ${escapeHtml(shippingAddress)}`,
    `<b>Articoli:</b> 📚 ${lineItems}`,
    `<b>Totale:</b> 💰 ${escapeHtml(amount)}`,
    `<b>Creato:</b> 🕒 ${escapeHtml(createdAt)}`,
    `<b>Tracking:</b> <a href="${escapeHtml(trackingLink)}">Vedi ordine</a>`
  ].join('\n')
}

const buildOrdersSummaryMessage = (params: {
  orders: OrderResult[]
  state: OrdersListState
}): { text: string; replyMarkup?: TelegramInlineKeyboardMarkup } => {
  const totalOrders = params.orders.length

  if (!totalOrders) {
    return {
      text:
        params.state.filter === 'paid'
          ? 'Nessun ordine pagato trovato.'
          : 'Nessun ordine trovato.'
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalOrders / ORDER_LIST_PAGE_SIZE))
  const currentPage = Math.min(Math.max(params.state.page, 1), totalPages)
  const startIndex = (currentPage - 1) * ORDER_LIST_PAGE_SIZE
  const pageOrders = params.orders.slice(
    startIndex,
    startIndex + ORDER_LIST_PAGE_SIZE
  )

  const visiblePageStart = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - 4)
  )
  const visiblePageEnd = Math.min(totalPages, visiblePageStart + 4)
  const visiblePages = Array.from(
    { length: visiblePageEnd - visiblePageStart + 1 },
    (_, index) => visiblePageStart + index
  )

  const rows = pageOrders.map((order, index) => {
    const absoluteIndex = startIndex + index + 1
    const status = toStringSafe(order.data.status, 'unknown')
    const createdAt = formatDateTime(
      order.data.createdAt || order.data.updatedAt
    )
    const amount = formatAmount(order.data.amount, order.data.currency)
    const link = buildBackofficeOrderLink(order)
    const statusEmoji = getStatusEmoji(status)
    const paymentStatus = toStringSafe(
      //@ts-ignore
      order.data.shipping_details?.status ||
        order.data.paymentStatus ||
        order.data.payment_status,
      'N/A'
    )
    const paymentEmoji = getPaymentEmoji(paymentStatus)

    return `${absoluteIndex}. <a href="${escapeHtml(
      link
    )}">Ordine</a> | ${statusEmoji} ${escapeHtml(
      status
    )} | ${paymentEmoji} ${escapeHtml(paymentStatus)} | ${escapeHtml(
      amount
    )} | ${escapeHtml(createdAt)}`
  })

  const keyboardRows: TelegramInlineKeyboardButton[][] = []
  if (totalPages > 1) {
    const navigationRow: TelegramInlineKeyboardButton[] = []
    if (currentPage > 1) {
      navigationRow.push({
        text: '◀️ Prev',
        callback_data: `${ORDER_LIST_CALLBACK_PREFIX}:${
          params.state.collection
        }:${params.state.filter}:${currentPage - 1}`
      })
    }

    navigationRow.push({
      text: `${currentPage}/${totalPages}`,
      callback_data: `${ORDER_LIST_CALLBACK_PREFIX}:${params.state.collection}:${params.state.filter}:${currentPage}`
    })

    if (currentPage < totalPages) {
      navigationRow.push({
        text: 'Next ▶️',
        callback_data: `${ORDER_LIST_CALLBACK_PREFIX}:${
          params.state.collection
        }:${params.state.filter}:${currentPage + 1}`
      })
    }

    keyboardRows.push(navigationRow)

    if (visiblePages.length > 1) {
      keyboardRows.push(
        visiblePages.map(page => ({
          text: page === currentPage ? `• ${page} •` : String(page),
          callback_data: `${ORDER_LIST_CALLBACK_PREFIX}:${params.state.collection}:${params.state.filter}:${page}`
        }))
      )
    }
  }

  return {
    text: [
      `${pickOne(['🚀', '📊', '📦'])} <b>Ordini ${getOrdersScopeLabel(
        params.state.collection
      )}</b>`,
      `<b>Filtro:</b> ${escapeHtml(getOrdersFilterLabel(params.state.filter))}`,
      `<b>Totale:</b> ${totalOrders} | <b>Pagina:</b> ${currentPage}/${totalPages}`,
      '',
      ...rows
    ].join('\n'),
    ...(keyboardRows.length
      ? {
          replyMarkup: {
            inline_keyboard: keyboardRows
          }
        }
      : {})
  }
}

const sendOrdersSummary = async (params: {
  botToken: string
  chatId: string | number
  messageThreadId?: number
  state: OrdersListState
  editMessageId?: number
}) => {
  const orders = await getRecentOrders(params.state.collection)
  const filteredOrders =
    params.state.filter === 'paid' ? orders.filter(isPaidOrder) : orders
  const summary = buildOrdersSummaryMessage({
    orders: filteredOrders,
    state: params.state
  })

  if (typeof params.editMessageId === 'number') {
    await editTelegramMessage({
      botToken: params.botToken,
      chatId: params.chatId,
      messageId: params.editMessageId,
      text: summary.text,
      parseMode: 'HTML',
      replyMarkup: summary.replyMarkup
    })

    return { count: filteredOrders.length, summary }
  }

  await sendTelegramMessage({
    botToken: params.botToken,
    chatId: params.chatId,
    text: summary.text,
    parseMode: 'HTML',
    messageThreadId: params.messageThreadId,
    replyMarkup: summary.replyMarkup
  })

  return { count: filteredOrders.length, summary }
}

const handleOrdersListCommand = async (params: {
  botToken: string
  chatId: string | number
  messageThreadId?: number
  isAdminChat: boolean
  args: string[]
}) => {
  if (!params.isAdminChat) {
    await sendTelegramMessage({
      botToken: params.botToken,
      chatId: params.chatId,
      text: 'Comando non autorizzato in questa chat.',
      messageThreadId: params.messageThreadId
    })

    return { ok: true, blocked: true }
  }

  const state = {
    ...parseOrdersListState(params.args),
    page: 1
  }

  const result = await sendOrdersSummary({
    botToken: params.botToken,
    chatId: params.chatId,
    messageThreadId: params.messageThreadId,
    state
  })

  return { ok: true, count: result.count }
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

    if (update.callback_query) {
      const callbackQuery = update.callback_query
      const callbackState = parseOrdersCallbackData(callbackQuery.data)

      if (callbackState && callbackQuery.message) {
        const allowedChatId = process.env.TELEGRAM_CHAT_ID
        const isAdminChat = isAllowedOrdersChat(
          callbackQuery.message.chat.id,
          allowedChatId
        )

        if (isAdminChat) {
          await answerTelegramCallback(botToken, callbackQuery.id)

          await sendOrdersSummary({
            botToken,
            chatId: callbackQuery.message.chat.id,
            messageThreadId: callbackQuery.message.message_thread_id,
            state: callbackState,
            editMessageId: callbackQuery.message.message_id
          })

          return res.status(200).json({ ok: true, updated: true })
        }

        await answerTelegramCallback(botToken, callbackQuery.id)
        return res.status(200).json({ ok: true, ignored: 'unauthorized_chat' })
      }
    }

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

      const result = await handleOrdersListCommand({
        botToken,
        chatId: message.chat.id,
        messageThreadId: threadId,
        isAdminChat,
        args: parsed.args
      })

      return res
        .status(200)
        .json({ ok: true, command: '/orders', count: result.count ?? 0 })
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
