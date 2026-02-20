import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
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

    await db.collection(collectionName).doc(session.id).set(
      {
        orderId: session.id,
        stripeCustomerId: session.customer,
        amount: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
        shipping_details: session.collected_information?.shipping_details,
        // items: session.metadata?.cartItems,
        status: 'paid',
        isTest: !session.livemode,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    )
  }

  res.json({ received: true })
}
