import React, { useEffect, useMemo, useState } from "react"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from "./CheckoutForm";
import { Metadata } from "../../utilities/arenaSettings";

const stripePromise = loadStripe(
  process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || ""
)

const Checkout = ({ metadata }: { metadata: Metadata }) => {
  const [error, setError] = useState<string | null>(null)

  // Get price id from url params
  const urlParams = new URLSearchParams(window.location.search);
  const priceId = urlParams.get('price_id')

  const promise = useMemo(async () => {
    const data = {
      PRICE_ID: priceId,
      SITE_URL: window.location.origin,
      metadata: metadata,
    }
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }
      const data_1 = await res.json();
      return data_1.clientSecret;

    } catch (e) {
      setError('Errore sconosciuto durante la creazione della sessione di checkout.')
      return Promise.reject('Errore sconosciuto durante la creazione della sessione di checkout.')
    }
  }, [metadata]);


  return error ?
    <div className="text-white" >
      <p>Errore:</p>
      <p>{error}</p>
    </div>
    :
    priceId === null || priceId.trim() === '' ?
      <div className="text-white" >
        <p>ID prezzo non valido.</p>
      </div>
      :
      <div className="!text-white" >
        <CheckoutProvider stripe={stripePromise} options={{
          clientSecret: promise,
          elementsOptions: {
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#4f46e5',
                colorBackground: '#1f2937',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'Arial, sans-serif',
                spacingUnit: '4px',
                borderRadius: '4px',
              },
            },
          },
        }}
        >
          <CheckoutForm />
        </CheckoutProvider >
      </div>
}

export default Checkout