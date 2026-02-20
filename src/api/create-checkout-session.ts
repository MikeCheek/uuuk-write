import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'
import { CartItem } from '../utilities/arenaSettings'

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse<{ clientSecret: string } | { message: string }>
) {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  const sanitize = (text: any): string => {
    if (!text) return ''
    if (Array.isArray(text)) return text.map(sanitize).join(',')
    if (typeof text === 'object') return JSON.stringify(text)
    return String(text)
  }

  if (req.method === `POST`) {
    try {
      // const { PRICE_ID, SITE_URL, metadata } = req.body
      const { SITE_URL, metadata } = req.body

      // 2. Define your threshold (e.g., €50.00)
      const THRESHOLD = process.env.SHIPPING_THRESHOLD
        ? parseInt(process.env.SHIPPING_THRESHOLD)
        : 3000 // Default to 3000 cents (€30) if not set
      const SHIPPING_STANDARD = process.env.SHIPPING_STANDARD || ''
      const SHIPPING_FREE = process.env.SHIPPING_FREE || ''

      // 1. Build line items from metadata array
      let totalAmount = 0
      const line_items = metadata.map((item: CartItem) => {
        totalAmount += item.price || 0
        return {
          price: item.priceId,
          quantity: item.quantity || 1
        }
      })

      const selectedShipping =
        totalAmount * 100 >= THRESHOLD ? SHIPPING_FREE : SHIPPING_STANDARD

      const sanitizedMetadata = Object.entries(metadata || {}).reduce(
        (acc, [key, value]) => {
          acc[key] = sanitize(value)
          return acc
        },
        {} as Record<string, string>
      )

      const session = await stripe.checkout.sessions.create({
        ui_mode: 'custom',
        line_items,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['IT']
        },
        shipping_options: [
          {
            shipping_rate: selectedShipping
          }
        ],
        return_url: `${SITE_URL}/grazie?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          // Stringify complex objects because Stripe metadata only accepts strings
          cartItems: JSON.stringify(sanitizedMetadata).substring(0, 500) // Truncate to 500 chars if needed
        },
        allow_promotion_codes: true
        // payment_intent_data: {
        //   metadata: sanitizedMetadata
        // }
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
