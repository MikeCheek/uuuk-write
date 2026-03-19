import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import emailjs from '@emailjs/nodejs'
import Stripe from 'stripe'
import { pickRandomGreeting } from '../utilities/greetings'

export const config: GatsbyFunctionConfig = {
  bodyParser: {
    raw: {}
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
  })
}
const db = getFirestore()
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2026-01-28.clover'
})

type OrderLineItem = {
  name: string
  quantity: number
  unitAmount: number | null
  totalAmount: number | null
  currency: string | null
}

type InvoiceDetails = {
  invoiceId: string | null
  invoiceNumber: string | null
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  receiptUrl: string | null
}

const formatAmount = (
  amountInMinor: number | null | undefined,
  currency: string | null | undefined
): string => {
  if (amountInMinor === null || amountInMinor === undefined) return 'N/A'

  const currencyCode = (currency || 'EUR').toUpperCase()
  try {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currencyCode
    }).format(amountInMinor / 100)
  } catch {
    return `${(amountInMinor / 100).toFixed(2)} ${currencyCode}`
  }
}

const getOrderLineItems = async (
  sessionId: string
): Promise<OrderLineItem[]> => {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ['data.price.product']
  })

  return lineItems.data.map(item => {
    const product = item.price?.product
    const productName =
      item.description ||
      (typeof product === 'object' && product !== null && 'name' in product
        ? (product.name as string)
        : 'Prodotto')

    const quantity = item.quantity || 1
    const unitAmount = item.price?.unit_amount ?? null
    const totalAmount = item.amount_total ?? null

    return {
      name: productName,
      quantity,
      unitAmount,
      totalAmount,
      currency: item.currency || null
    }
  })
}

const getInvoiceDetails = async (
  session: Stripe.Checkout.Session
): Promise<InvoiceDetails> => {
  let hostedInvoiceUrl: string | null = null
  let invoicePdf: string | null = null
  let invoiceNumber: string | null = null
  let invoiceId: string | null = null
  let receiptUrl: string | null = null

  if (session.invoice) {
    const invoiceRef =
      typeof session.invoice === 'string' ? session.invoice : session.invoice.id

    const invoice = await stripe.invoices.retrieve(invoiceRef)
    invoiceId = invoice.id
    invoiceNumber = invoice.number ?? null
    hostedInvoiceUrl = invoice.hosted_invoice_url ?? null
    invoicePdf = invoice.invoice_pdf ?? null
  }

  if (!hostedInvoiceUrl && session.payment_intent) {
    const paymentIntentRef =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent.id

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentRef,
      {
        expand: ['latest_charge']
      }
    )

    if (
      paymentIntent.latest_charge &&
      typeof paymentIntent.latest_charge !== 'string'
    ) {
      receiptUrl = paymentIntent.latest_charge.receipt_url ?? null
    }
  }

  return {
    invoiceId,
    invoiceNumber,
    hostedInvoiceUrl,
    invoicePdf,
    receiptUrl
  }
}

const sendTelegramNotification = async (payload: {
  orderLineItems: OrderLineItem[]
  customerName: string
  customerEmail: string | null
  amount: number | null
  currency: string | null
  shippingAddress: Stripe.Address | null
  shippingName: string | null
  isTest: boolean
}): Promise<{ sent: boolean; reason: string | null }> => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const topicId = process.env.TELEGRAM_TOPIC_ID ?? '9'

  if (!botToken || !chatId) {
    return {
      sent: false,
      reason: 'Telegram configuration is missing'
    }
  }

  const orderItemsText = payload.orderLineItems
    .map(
      item =>
        `• ${item.name} x${item.quantity} (${formatAmount(
          item.totalAmount,
          item.currency
        )})`
    )
    .join('\n')

  const shippingAddressText = payload.shippingAddress
    ? [
        payload.shippingAddress.line1,
        payload.shippingAddress.line2,
        payload.shippingAddress.postal_code,
        payload.shippingAddress.city,
        payload.shippingAddress.state,
        payload.shippingAddress.country
      ]
        .filter(Boolean)
        .join(', ')
    : 'N/A'

  const message = `
${pickRandomGreeting() + ' '}🚀 <b>Nuovo ordine ricevuto!</b>
${payload.isTest ? '⚠️ <b>[TEST MODE]</b>' : '✅ <b>[LIVE]</b>'}

👤 <b>Cliente:</b> ${payload.customerName}
📧 <b>Email:</b> ${payload.customerEmail || 'N/A'}

📦 <b>Articoli:</b>
${orderItemsText}

💰 <b>Totale:</b> ${formatAmount(payload.amount, payload.currency)}

📍 <b>Indirizzo di spedizione:</b>
${shippingAddressText}

---
${new Date().toLocaleString('it-IT')}
  `.trim()

  try {
    const messageBody: any = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }

    // Add topic ID if configured (for Telegram channel topics/threads)
    if (topicId) {
      messageBody.message_thread_id = parseInt(topicId)
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageBody)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Telegram API error: ${error}`)
    }

    return { sent: true, reason: null }
  } catch (error: any) {
    console.error('Telegram send error:', error?.message || error)
    return { sent: false, reason: error?.message || 'Unknown Telegram error' }
  }
}

const sendTelegramCriticalAlert = async (payload: {
  title: string
  isTest: boolean
  details: Array<{ label: string; value: string | null | undefined }>
}): Promise<{ sent: boolean; reason: string | null }> => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const topicId = process.env.TELEGRAM_TOPIC_ID ?? '9'

  if (!botToken || !chatId) {
    return {
      sent: false,
      reason: 'Telegram configuration is missing'
    }
  }

  const detailsText = payload.details
    .map(detail => `• <b>${detail.label}:</b> ${detail.value || 'N/A'}`)
    .join('\n')

  const message = `
🚨 <b>${payload.title}</b>
${payload.isTest ? '⚠️ <b>[TEST MODE]</b>' : '🔴 <b>[LIVE]</b>'}

${detailsText}

---
${new Date().toLocaleString('it-IT')}
  `.trim()

  try {
    const messageBody: any = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }

    if (topicId) {
      messageBody.message_thread_id = parseInt(topicId)
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageBody)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Telegram API error: ${error}`)
    }

    return { sent: true, reason: null }
  } catch (error: any) {
    console.error('Telegram critical alert error:', error?.message || error)
    return { sent: false, reason: error?.message || 'Unknown Telegram error' }
  }
}

const findOrderRef = async (
  collectionName: string,
  lookup: { sessionId?: string; paymentIntentId?: string }
): Promise<{ ref: any; data: any } | null> => {
  if (lookup.sessionId) {
    const bySessionId = await db
      .collection(collectionName)
      .where('sessionId', '==', lookup.sessionId)
      .limit(1)
      .get()

    if (!bySessionId.empty) {
      return {
        ref: bySessionId.docs[0].ref,
        data: bySessionId.docs[0].data()
      }
    }

    // Backward-compatible fallback for previous records that used orderId.
    const byOrderId = await db
      .collection(collectionName)
      .where('orderId', '==', lookup.sessionId)
      .limit(1)
      .get()

    if (!byOrderId.empty) {
      return {
        ref: byOrderId.docs[0].ref,
        data: byOrderId.docs[0].data()
      }
    }
  }

  if (lookup.paymentIntentId) {
    const byPaymentIntentId = await db
      .collection(collectionName)
      .where('stripePaymentIntentId', '==', lookup.paymentIntentId)
      .limit(1)
      .get()

    if (!byPaymentIntentId.empty) {
      return {
        ref: byPaymentIntentId.docs[0].ref,
        data: byPaymentIntentId.docs[0].data()
      }
    }
  }

  return null
}

const formatAddressInline = (
  address: Stripe.Address | null | undefined
): string => {
  if (!address) return 'N/A'

  return [
    address.line1,
    address.line2,
    address.postal_code,
    address.city,
    address.state,
    address.country
  ]
    .filter(Boolean)
    .join(', ')
}

const sendEmailJsOrderConfirmation = async (payload: {
  toEmail: string | null
  toName: string
  orderId: string
  amount: number | null
  currency: string | null
  orderLineItems: OrderLineItem[]
  invoice: InvoiceDetails
  shippingAddress: Stripe.Address | null
  shippingName: string | null
}) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return {
      sent: false,
      reason: 'EmailJS configuration is missing'
    }
  }

  if (!payload.toEmail) {
    return {
      sent: false,
      reason: 'Customer email is missing on checkout session'
    }
  }

  const orderItemsText = payload.orderLineItems
    .map(
      item =>
        `- ${item.name} x${item.quantity} (${formatAmount(
          item.totalAmount,
          item.currency
        )})`
    )
    .join('\n')

  const shippingAddressText = payload.shippingAddress
    ? [
        payload.shippingAddress.line1,
        payload.shippingAddress.line2,
        payload.shippingAddress.postal_code,
        payload.shippingAddress.city,
        payload.shippingAddress.state,
        payload.shippingAddress.country
      ]
        .filter(Boolean)
        .join(', ')
    : 'N/A'

  const invoiceLinks = [
    payload.invoice.hostedInvoiceUrl,
    payload.invoice.invoicePdf,
    payload.invoice.receiptUrl
  ]
    .filter(Boolean)
    .join('\n')

  const templateParams = {
    email: payload.toEmail,
    to_name: payload.toName,
    order_id: payload.orderId,
    order_total: formatAmount(payload.amount, payload.currency),
    order_currency: payload.currency || 'eur',
    order_items: orderItemsText,
    shipping_name: payload.shippingName || payload.toName || 'N/A',
    shipping_address: shippingAddressText,
    invoice_number:
      payload.invoice.invoiceNumber || payload.invoice.invoiceId || 'N/A',
    invoice_url:
      payload.invoice.hostedInvoiceUrl || payload.invoice.receiptUrl || 'N/A',
    invoice_pdf: payload.invoice.invoicePdf || 'N/A',
    invoice_links: invoiceLinks || 'N/A'
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey
    })

    return { sent: true, reason: null }
  } catch (error: any) {
    console.error('EmailJS send error:', error?.message || error)
    return { sent: false, reason: error?.message || 'Unknown EmailJS error' }
  }
}

const getRawBody = async (req: any): Promise<Buffer> => {
  // Gatsby raw body parser may already provide the payload as Buffer/string.
  if (Buffer.isBuffer(req.body)) {
    return req.body
  }

  if (typeof req.body === 'string') {
    return Buffer.from(req.body)
  }

  if (Buffer.isBuffer(req.rawBody)) {
    return req.rawBody
  }

  if (typeof req.rawBody === 'string') {
    return Buffer.from(req.rawBody)
  }

  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const normalizeWebhookSecret = (secret: string | undefined): string => {
  if (!secret) return ''
  // Supports values accidentally wrapped in quotes in env files.
  return secret.trim().replace(/^['"]|['"]$/g, '')
}

const getStripeSignatureHeader = (
  value: string | string[] | undefined
): string => {
  if (!value) return ''
  return Array.isArray(value) ? value[0] || '' : value
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = getStripeSignatureHeader(
    req.headers['stripe-signature'] as string | string[] | undefined
  )
  const webhookSecret = normalizeWebhookSecret(
    process.env.STRIPE_WEBHOOK_SECRET
  )

  if (!sig) {
    return res
      .status(400)
      .send('Webhook Error: missing stripe-signature header')
  }

  if (!webhookSecret) {
    return res.status(500).send('Webhook Error: missing STRIPE_WEBHOOK_SECRET')
  }

  let event: Stripe.Event

  try {
    const rawBody = await getRawBody(req)

    if (!rawBody.length) {
      return res.status(400).send('Webhook Error: empty request body')
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error('Signature Error:', err?.message || err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const collectionName = session.livemode ? 'orders' : 'orders-test'

    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['customer', 'payment_intent']
    })

    const orderLineItems = await getOrderLineItems(session.id)
    const invoice = await getInvoiceDetails(fullSession)
    const customerObject =
      typeof fullSession.customer !== 'string' ? fullSession.customer : null
    const customerEmailFromObject =
      customerObject && !customerObject.deleted ? customerObject.email : null
    const customerNameFromObject =
      customerObject && !customerObject.deleted ? customerObject.name : null

    const customerEmail =
      fullSession.customer_details?.email || customerEmailFromObject

    const customerName =
      fullSession.customer_details?.name || customerNameFromObject || 'Cliente'

    const shippingAddress =
      fullSession.collected_information?.shipping_details?.address ||
      fullSession.customer_details?.address ||
      null

    const shippingName =
      fullSession.collected_information?.shipping_details?.name ||
      fullSession.customer_details?.name ||
      null

    // Query for existing order by orderId (sessionId) to maintain idempotency
    const existingOrderQuery = db
      .collection(collectionName)
      .where('orderId', '==', session.id)
      .limit(1)
    const existingOrderSnapshot = await existingOrderQuery.get()

    let orderRef: any
    let currentOrderData: any = null

    if (!existingOrderSnapshot.empty) {
      // Order exists, use existing document reference
      orderRef = existingOrderSnapshot.docs[0].ref
      currentOrderData = existingOrderSnapshot.docs[0].data()
    } else {
      // New order, create with auto-generated ID
      orderRef = db.collection(collectionName).doc()
    }

    const alreadySentEmail = currentOrderData?.emailNotification?.sent === true

    const emailResult = alreadySentEmail
      ? { sent: true, reason: 'Already sent previously' }
      : await sendEmailJsOrderConfirmation({
          toEmail: customerEmail,
          toName: customerName,
          orderId: orderRef.id,
          // sessionId: session.id,
          amount: fullSession.amount_total,
          currency: fullSession.currency,
          orderLineItems,
          invoice,
          shippingAddress,
          shippingName
        })

    // Send Telegram notification
    const telegramResult = await sendTelegramNotification({
      orderLineItems,
      customerName: customerName,
      customerEmail: customerEmail,
      amount: fullSession.amount_total,
      currency: fullSession.currency,
      shippingAddress,
      shippingName,
      isTest: !session.livemode
    })

    const nowIso = new Date().toISOString()

    const orderPayload: Record<string, unknown> = {
      orderId: orderRef.id,
      sessionId: session.id,
      documentId: orderRef.id, // Store the auto-generated doc ID
      stripePaymentIntentId:
        typeof fullSession.payment_intent === 'string'
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id || null,
      stripeCustomerId:
        typeof fullSession.customer === 'string'
          ? fullSession.customer
          : fullSession.customer?.id || null,
      amount: fullSession.amount_total,
      currency: fullSession.currency,
      customer_details: fullSession.customer_details,
      shipping_details:
        fullSession.collected_information?.shipping_details || null,
      orderLineItems,
      invoice,
      status: 'paid',
      isTest: !session.livemode,
      updatedAt: nowIso
    }

    if (!currentOrderData?.createdAt) {
      orderPayload.createdAt = nowIso
    }

    if (!alreadySentEmail) {
      orderPayload.emailNotification = {
        sent: emailResult.sent,
        reason: emailResult.reason,
        recipient: customerEmail,
        attemptedAt: nowIso
      }
    }

    // Add Telegram notification result
    orderPayload.telegramNotification = {
      sent: telegramResult.sent,
      reason: telegramResult.reason,
      attemptedAt: nowIso
    }

    await orderRef.set(orderPayload, { merge: true })
  } else if (event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    const nowIso = new Date().toISOString()
    const collectionName = session.livemode ? 'orders' : 'orders-test'

    try {
      const order = await findOrderRef(collectionName, {
        sessionId: session.id
      })

      if (order) {
        await order.ref.set(
          {
            status: 'paid',
            checkoutStatus: session.status || null,
            paymentStatus: session.payment_status || null,
            asyncPaymentStatus: 'succeeded',
            asyncPaymentEvent: {
              id: event.id,
              type: event.type,
              receivedAt: nowIso
            },
            updatedAt: nowIso
          },
          { merge: true }
        )
      }
    } catch (error: any) {
      console.error(
        'async_payment_succeeded handling error:',
        error?.message || error
      )
    }

    console.log(
      `Checkout async payment succeeded for session ${session.id} (livemode=${session.livemode})`
    )
  } else if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session
    const nowIso = new Date().toISOString()
    const collectionName = session.livemode ? 'orders' : 'orders-test'
    const customerName = session.customer_details?.name || 'N/A'
    const customerEmail = session.customer_details?.email || 'N/A'
    const customerPhone = session.customer_details?.phone || 'N/A'
    const customerAddress = formatAddressInline(
      session.customer_details?.address
    )

    try {
      const order = await findOrderRef(collectionName, {
        sessionId: session.id
      })

      const orderCustomerDetails = order?.data?.customer_details

      if (order) {
        await order.ref.set(
          {
            status: 'payment_failed',
            payment_status: 'error',
            paymentStatus: 'error',
            checkoutStatus: session.status || null,
            paymentGatewayStatus: session.payment_status || null,
            paymentErrorUserData: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              address: session.customer_details?.address || null,
              shippingAddress:
                session.collected_information?.shipping_details?.address || null
            },
            customer_details:
              orderCustomerDetails || session.customer_details || null,
            asyncPaymentStatus: 'failed',
            asyncPaymentEvent: {
              id: event.id,
              type: event.type,
              receivedAt: nowIso
            },
            updatedAt: nowIso
          },
          { merge: true }
        )
      }

      await sendTelegramCriticalAlert({
        title: 'Pagamento asincrono FALLITO',
        isTest: !session.livemode,
        details: [
          { label: 'Session ID', value: session.id },
          { label: 'Order Document', value: order?.ref?.id || 'Not found' },
          { label: 'Cliente', value: customerName },
          { label: 'Email', value: customerEmail },
          { label: 'Telefono', value: customerPhone },
          { label: 'Indirizzo', value: customerAddress },
          { label: 'Checkout Status', value: session.status || 'N/A' },
          { label: 'Payment Status', value: session.payment_status || 'N/A' },
          { label: 'Event ID', value: event.id }
        ]
      })
    } catch (error: any) {
      console.error(
        'async_payment_failed handling error:',
        error?.message || error
      )
    }

    console.warn(
      `Checkout async payment failed for session ${session.id} (livemode=${session.livemode})`
    )
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const nowIso = new Date().toISOString()
    const collectionName = session.livemode ? 'orders' : 'orders-test'

    try {
      const order = await findOrderRef(collectionName, {
        sessionId: session.id
      })

      if (order) {
        await order.ref.set(
          {
            status: 'expired',
            checkoutStatus: session.status || null,
            paymentStatus: session.payment_status || null,
            checkoutExpirationEvent: {
              id: event.id,
              type: event.type,
              receivedAt: nowIso
            },
            updatedAt: nowIso
          },
          { merge: true }
        )
      }
    } catch (error: any) {
      console.error(
        'checkout.session.expired handling error:',
        error?.message || error
      )
    }

    console.log(
      `Checkout session expired for session ${session.id} (livemode=${session.livemode})`
    )
  } else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const nowIso = new Date().toISOString()
    const collectionName = paymentIntent.livemode ? 'orders' : 'orders-test'

    try {
      const order = await findOrderRef(collectionName, {
        paymentIntentId: paymentIntent.id
      })

      if (order) {
        await order.ref.set(
          {
            paymentIntentStatus: 'succeeded',
            paymentIntentLastEvent: {
              id: event.id,
              type: event.type,
              receivedAt: nowIso
            },
            updatedAt: nowIso
          },
          { merge: true }
        )
      }
    } catch (error: any) {
      console.error(
        'payment_intent.succeeded handling error:',
        error?.message || error
      )
    }

    console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const nowIso = new Date().toISOString()
    const collectionName = paymentIntent.livemode ? 'orders' : 'orders-test'
    const lastErrorMessage =
      paymentIntent.last_payment_error?.message ||
      paymentIntent.last_payment_error?.code ||
      'Unknown reason'

    try {
      const order = await findOrderRef(collectionName, {
        paymentIntentId: paymentIntent.id
      })

      const orderCustomerDetails = order?.data?.customer_details || null
      const latestCharge =
        paymentIntent.latest_charge &&
        typeof paymentIntent.latest_charge !== 'string'
          ? paymentIntent.latest_charge
          : null
      const customerName =
        orderCustomerDetails?.name ||
        paymentIntent.shipping?.name ||
        latestCharge?.billing_details?.name ||
        null
      const customerEmail =
        orderCustomerDetails?.email ||
        paymentIntent.receipt_email ||
        latestCharge?.billing_details?.email ||
        null
      const customerPhone =
        orderCustomerDetails?.phone ||
        latestCharge?.billing_details?.phone ||
        null
      const customerAddressText = formatAddressInline(
        orderCustomerDetails?.address ||
          paymentIntent.shipping?.address ||
          latestCharge?.billing_details?.address ||
          null
      )

      if (order) {
        await order.ref.set(
          {
            status: 'payment_failed',
            payment_status: 'error',
            paymentStatus: 'error',
            paymentIntentStatus: 'failed',
            paymentErrorUserData: {
              name: customerName || null,
              email: customerEmail || null,
              phone: customerPhone || null,
              address:
                orderCustomerDetails?.address ||
                paymentIntent.shipping?.address ||
                null
            },
            customer_details: orderCustomerDetails || null,
            paymentIntentFailure: {
              code: paymentIntent.last_payment_error?.code || null,
              message: paymentIntent.last_payment_error?.message || null,
              type: paymentIntent.last_payment_error?.type || null,
              declinedCode:
                paymentIntent.last_payment_error?.decline_code || null,
              receivedAt: nowIso
            },
            paymentIntentLastEvent: {
              id: event.id,
              type: event.type,
              receivedAt: nowIso
            },
            updatedAt: nowIso
          },
          { merge: true }
        )
      }

      await sendTelegramCriticalAlert({
        title: 'PaymentIntent FALLITO',
        isTest: !paymentIntent.livemode,
        details: [
          { label: 'PaymentIntent ID', value: paymentIntent.id },
          { label: 'Order Document', value: order?.ref?.id || 'Not found' },
          { label: 'Cliente', value: customerName || 'N/A' },
          { label: 'Email', value: customerEmail || 'N/A' },
          { label: 'Telefono', value: customerPhone || 'N/A' },
          { label: 'Indirizzo', value: customerAddressText },
          {
            label: 'Amount',
            value: formatAmount(paymentIntent.amount, paymentIntent.currency)
          },
          { label: 'Failure', value: lastErrorMessage },
          { label: 'Event ID', value: event.id }
        ]
      })
    } catch (error: any) {
      console.error(
        'payment_intent.payment_failed handling error:',
        error?.message || error
      )
    }

    console.warn(`PaymentIntent failed: ${paymentIntent.id}`)
  } else {
    console.log(`Unhandled Stripe event type received: ${event.type}`)
  }

  res.json({ received: true })
}
