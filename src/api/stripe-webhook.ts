import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import emailjs from '@emailjs/nodejs'
import Stripe from 'stripe'

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
  const topicId = process.env.TELEGRAM_TOPIC_ID

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
🎉 <b>Nuovo Ordine!</b>
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
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    const rawBody = await getRawBody(req)

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Signature Error:', err.message)
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
  }

  res.json({ received: true })
}
