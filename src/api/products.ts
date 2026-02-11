import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby'

export default async function handler (
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse<{ clientSecret: string } | { message: string }>
) {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  if (req.method === `GET`) {
    try {
      const products = await stripe.products.list({
        limit: 100, // adjust as needed
        expand: ['data.default_price'] // include prices
      })

      res.json(products.data)
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Internal Server Error' })
    }
  } else {
    res.status(405).send({ message: 'Method Not Allowed' })
  }
}
