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
  const docRef = db.collection(collection).doc() // Firestore auto-generates ID

  await docRef.set(
    {
      orderId: sessionId, // Keep sessionId as a field for reference
      documentId: docRef.id, // Store the auto-generated doc ID
      items: cartItems,
      status: 'pending',
      isTest: !livemode,
      createdAt: new Date().toISOString()
    },
    { merge: true }
  )

  return docRef.id // Return the generated ID
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

    const documentId = await createOrderDocument(sessionId, cartItems, livemode)

    return res.json({ success: true, documentId, sessionId })
  } catch (err: any) {
    console.error('Error creating order document:', err)
    return res.status(500).json({ error: err.message })
  }
}
