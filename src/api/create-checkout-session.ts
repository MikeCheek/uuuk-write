import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'
import { siteUrl } from '../utilities/useSiteMetadata'

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse<{ clientSecret: string } | { message: string }>
) {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  const YOUR_DOMAIN = 'https://localhost:8000' //siteUrl

  if (req.method === `POST`) {
    console.log('######## PRICE ID:', req.body.PRICE_ID)
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'custom',
        customer_email: 'customer@example.com',
        line_items: [
          {
            price: req.body.PRICE_ID,
            quantity: 1
          }
        ],
        mode: 'payment',
        return_url: `${YOUR_DOMAIN}/complete?session_id={CHECKOUT_SESSION_ID}`
      })

      res.send({ clientSecret: session.client_secret })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Internal Server Error' })
    }
  } else {
    res.status(405).send({ message: 'Method Not Allowed' })
  }
}
