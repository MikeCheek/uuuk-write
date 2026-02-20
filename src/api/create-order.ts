import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Configure Gatsby to allow JSON body
export const config: GatsbyFunctionConfig = {
  bodyParser: {
    json: {
      type: 'application/json'
    }
  }
}

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
  })
}

const db = getFirestore()

// Helper function to create order document
async function createOrderDocument (
  sessionId: string,
  cartItems: any[],
  livemode = false
) {
  if (!sessionId) throw new Error('Missing sessionId')

  const collection = livemode ? 'orders' : 'orders-test'
  const docRef = db.collection(collection).doc(sessionId)

  await docRef.set(
    {
      orderId: sessionId,
      items: cartItems,
      status: 'pending',
      isTest: !livemode,
      createdAt: new Date().toISOString()
    },
    { merge: true } // merge ensures idempotency
  )
}

// Gatsby Function Handler
export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { sessionId, cartItems, livemode } = req.body

    if (!sessionId || !cartItems) {
      return res.status(400).json({ error: 'Missing sessionId or cartItems' })
    }

    await createOrderDocument(sessionId, cartItems, livemode)

    return res.json({ success: true })
  } catch (err: any) {
    console.error('Error creating order document:', err)
    return res.status(500).json({ error: err.message })
  }
}
