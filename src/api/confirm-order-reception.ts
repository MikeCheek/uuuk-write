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

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { orderId, livemode } = req.body || {}

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid orderId' })
    }

    const collection =
      livemode === false || livemode === 'false' ? 'orders-test' : 'orders'
    const orderRef = db.collection(collection).doc(orderId)
    const snapshot = await orderRef.get()

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const orderData = snapshot.data() || {}
    const alreadyConfirmed = orderData['order-status'] === 'consegnato'

    const nowIso = new Date().toISOString()

    await orderRef.set(
      {
        'order-status': 'consegnato',
        updatedAt: nowIso,
        deliveryConfirmation: {
          confirmedAt: nowIso,
          source: 'delivery_check_email',
          sentFrom: 'customer_portal'
        }
      },
      { merge: true }
    )

    return res.status(200).json({
      success: true,
      alreadyConfirmed,
      orderId,
      collection
    })
  } catch (error: any) {
    console.error('confirm-order-reception error:', error?.message || error)
    return res.status(500).json({ error: error?.message || 'Unknown error' })
  }
}
