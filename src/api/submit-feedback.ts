import {
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
  GatsbyFunctionConfig
} from 'gatsby'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import emailjs from '@emailjs/nodejs'

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
  const data = req.body
  if (!data.email) {
    return res.status(400).json({ error: 'Email obbligatoria' })
  }
  try {
    await db.collection('feedback').add({
      ...data,
      createdAt: new Date().toISOString()
    })
    // Send discount code via email
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: data.email,
        discount_code: process.env.DISCOUNT_CODE || 'UUUUK10'
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    )
    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('Error saving feedback:', err)
    return res.status(500).json({ error: 'Errore server' })
  }
}
