import React, { useEffect, useMemo, useState } from "react"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || ""
)

const testPrice = "price_1SaxTJLZC3eASp0tJ5eoNT0U"
const livePrice = "price_1SawXxPpEYHfVWarxTKLKnDv"

const Checkout = () => {
  const [error, setError] = useState<string | null>(null)

  const promise = useMemo(async () => {
    const data = {
      PRICE_ID: process.env.NODE_ENV === 'development' ? testPrice : livePrice,
      SITE_URL: window.location.origin
    }
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      const data_1 = await res.json();
      return data_1.clientSecret;

    } catch (e) {
      setError('Failed to create checkout session.')
      return Promise.reject('Failed to create checkout session.')
    }
  }, []);


  return error ?
    <div >
      <p>Errors occurred:</p>
      <p>{error}</p>
    </div>
    :
    <CheckoutProvider stripe={stripePromise} options={{
      clientSecret: promise
    }}>
      <CheckoutForm />
    </CheckoutProvider >
}

export default Checkout