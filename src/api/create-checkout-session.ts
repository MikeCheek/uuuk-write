import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse<{ clientSecret: string } | { message: string }>
) {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  // const YOUR_DOMAIN = 'https://localhost:8000' //siteUrl

  const sanitize = (text: any): string => {
    if (!text) return ''
    if (Array.isArray(text)) {
      return text.map(sanitize).join(',')
    }
    if (typeof text === 'object') {
      return JSON.stringify(text)
    }
    return String(text)
  }

  if (req.method === `POST`) {
    try {
      const { PRICE_ID, SITE_URL, metadata } = req.body

      // Optional: Sanitize metadata to ensure all values are strings
      // Stripe will throw an error if you pass a number like { id: 123 }
      const sanitizedMetadata = Object.entries(metadata || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = sanitize(value)
          return acc
        },
        {} as Record<string, string>
      )
      // console.log('Sanitized Metadata:', sanitizedMetadata)
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'custom',
        line_items: [
          {
            price: PRICE_ID,
            quantity: 1
          }
        ],
        mode: 'payment',
        return_url: `${SITE_URL}/grazie?session_id={CHECKOUT_SESSION_ID}`,

        // Pass the whole object here
        metadata: sanitizedMetadata,

        // Also pass it here so it's attached to the actual transaction/charge
        payment_intent_data: {
          metadata: sanitizedMetadata
        }
      })

      res.send({ clientSecret: session.client_secret })
    } catch (error) {
      console.log('Error', error)
      res.status(500).send({ message: 'Internal Server Error' })
    }
  } else {
    res.status(405).send({ message: 'Method Not Allowed' })
  }
}
