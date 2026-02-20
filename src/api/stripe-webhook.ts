import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import Stripe from 'stripe'

// Initialize Firebase Admin (use Environment Variables!)
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
  let event: Stripe.Event

  try {
    // Verify the event came from Stripe
    const body =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Save to Firestore
    await db
      .collection('orders')
      .doc(session.id)
      .set({
        orderId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
        shipping_details: session.shipping_address_collection,
        items: JSON.parse(session.metadata?.cartItems || '[]'),
        status: 'paid',
        createdAt: new Date().toISOString()
      })
  }

  res.json({ received: true })
}
