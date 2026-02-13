import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)

const getProducts = async (limit?: number) => {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  const products = await stripe.products.list({
    limit: limit || 100, // adjust as needed
    expand: ['data.default_price'] // include prices
  })

  return { data: products.data, has_more: products.has_more }
}

export { stripePromise, getProducts }
