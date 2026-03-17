import React, { useMemo, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from "./CheckoutForm";
import { Metadata } from "../../utilities/arenaSettings";

const stripePromise = loadStripe(
  process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || ""
)

const Checkout = ({ items }: { items: Metadata[] }) => {
  const [error, setError] = useState<string | null>(null)

  // Get price id from url params
  // const urlParams = new URLSearchParams(window.location.search);
  // const priceId = urlParams.get('price_id')

  const promise = useMemo(async () => {
    const data = {
      // PRICE_ID: priceId,
      SITE_URL: window.location.origin,
      metadata: items,
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

      const resOrder = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: data_1.sessionId,
          cartItems: items,
          livemode: process.env.GATSBY_STRIPE_PUBLISHABLE_KEY?.includes("pk_live") || false
        }),
      })

      if (!resOrder.ok) {
        throw new Error(`Failed to create order document: ${resOrder.statusText}`)
      }

      return data_1.clientSecret;

    } catch (e) {
      setError('Errore sconosciuto durante la creazione della sessione di checkout.')
      return Promise.reject('Errore sconosciuto durante la creazione della sessione di checkout.')
    }
  }, [items]);


  return error ?
    <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100" >
      <p className="text-xs uppercase tracking-wide text-red-200">Errore</p>
      <p className="mt-1 text-sm">{error}</p>
    </div>
    :
    // priceId === null || priceId.trim() === '' ?
    //   <div className="text-white" >
    //     <p>ID prezzo non valido.</p>
    //   </div>
    //   :
    <div className="!text-white" >
      <CheckoutProvider stripe={stripePromise} options={{
        clientSecret: promise,
        elementsOptions: {
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#f97316',
              colorBackground: '#0f1a36',
              colorText: '#f8fbff',
              colorDanger: '#ef4444',
              colorTextSecondary: '#9db2de',
              colorSuccess: '#1aae67',
              fontFamily: 'Helvetica, sans-serif',
              spacingUnit: '6px',
              borderRadius: '10px',
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