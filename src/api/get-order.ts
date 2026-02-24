import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
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
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { orderId, livemode } = req.query || req.body

    if (!orderId || typeof orderId !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or invalid orderId parameter' })
    }

    const snapshot = await db
      .collection(livemode === 'true' ? 'orders' : 'orders-test')
      .doc(orderId)
      .get()

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const orderData = snapshot.data()

    return res.json({
      success: true,
      data: {
        ...orderData,
        documentId: snapshot.id
      }
    })
  } catch (err: any) {
    console.error('Error fetching order:', err)
    return res.status(500).json({ error: err.message })
  }
}
