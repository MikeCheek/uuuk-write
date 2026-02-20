import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import Stripe from 'stripe'

// 1. This is critical. It tells Gatsby to stop parsing JSON into an object.
export const config: GatsbyFunctionConfig = {
  bodyParser: {
    raw: {
      type: `application/json`
    }
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

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature'] as string

  // 2. LOG THIS to verify. It should look like <Buffer 7b 22 69 64...>
  // If it looks like a regular Javascript Object {}, the config isn't working yet.
  console.log('Request Body Type:', typeof req.body)

  let event: Stripe.Event

  try {
    // If Gatsby successfully passed the raw buffer, this will now work.
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Signature Error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Metadata items are strings in Stripe, parse them back to JSON
    const cartItems = session.metadata?.cartItems
      ? JSON.parse(session.metadata.cartItems)
      : []

    await db.collection('orders').doc(session.id).set({
      orderId: session.id,
      stripeCustomerId: session.customer,
      amount: session.amount_total,
      currency: session.currency,
      customer_details: session.customer_details,
      shipping_details: session.shipping_address_collection, // Fixed: use shipping_details from session
      items: cartItems,
      status: 'paid',
      createdAt: new Date().toISOString()
    })
  }

  res.json({ received: true })
}
