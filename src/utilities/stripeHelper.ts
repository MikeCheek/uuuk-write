import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)

const getProducts = async (limit?: number) => {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2025-11-17.clover'
  })

  const products = await stripe.products.list({
    limit: limit || 100, // adjust as needed
    expand: ['data.default_price'], // include prices
    active: true
  })

  return { data: products.data as StripeProduct[], has_more: products.has_more }
}
type StripePrice = {
  id: string
  object: 'price'
  active: boolean
  billing_scheme: 'per_unit' | 'tiered'
  created: number
  currency: string
  custom_unit_amount: {
    maximum: number
    minimum: number
    preset: number
  } | null
  livemode: boolean
  lookup_key: string | null
  metadata: Record<string, string>
  nickname: string | null
  product: string
  recurring: {
    aggregate_usage: 'sum' | 'last_during_period' | 'last_ever' | 'max' | null
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
    trial_period_days: number | null
    usage_type: 'licensed' | 'metered'
  } | null
  tax_behavior: 'exclusive' | 'inclusive' | 'unspecified'
  tiers_mode: 'graduated' | 'volume' | null
  transform_quantity: {
    divide_by: number
    round: 'up' | 'down'
  } | null
  type: 'one_time' | 'recurring'
  unit_amount: number | null
  unit_amount_decimal: string | null
}

type StripeProduct = {
  id: string
  object: 'product'
  active: boolean
  attributes: string[]
  created: number
  default_price: StripePrice
  description: string | null
  images: string[]
  livemode: boolean
  marketing_features: string[]
  metadata: Record<string, string>
  name: string
  package_dimensions: {
    height: number
    length: number
    weight: number
    width: number
  } | null
  shippable: boolean | null
  statement_descriptor: string | null
  tax_code: string | null
  type: 'good' | 'service'
  unit_label: string | null
  updated: number
  url: string | null
}

export { stripePromise, getProducts, StripeProduct, StripePrice }
