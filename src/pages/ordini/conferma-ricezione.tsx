import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/organisms/Layout'
import Seo from '../../components/atoms/Seo'

type OrderData = {
  documentId?: string
  orderId?: string
  'order-status'?: string
  status?: string
  customer_details?: {
    name?: string
    email?: string
  }
  shipping_details?: {
    name?: string
  }
  deliveryConfirmation?: {
    confirmedAt?: string
    source?: string
  }
}

const ConfirmDeliveryPage = () => {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search)
  }, [])

  const orderId = searchParams?.get('orderId') || ''
  const livemode = searchParams?.get('livemode') !== 'false'

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      setError('Missing orderId')
      return
    }

    setLoading(true)
    fetch(
      `/api/get-order?orderId=${encodeURIComponent(orderId)}&livemode=${String(
        livemode
      )}`
    )
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.success) {
          setOrder(data.data)
        } else {
          setError(data.error || 'Ordine non trovato')
        }
      })
      .catch(err => {
        setError(err.message || 'Errore durante il caricamento')
      })
      .finally(() => setLoading(false))
  }, [livemode, orderId])

  const handleConfirm = async () => {
    if (!orderId) return
    setConfirming(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/confirm-order-reception', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, livemode })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Errore conferma ricezione')
      }

      setOrder(prev =>
        prev
          ? {
            ...prev,
            'order-status': 'consegnato',
            deliveryConfirmation: {
              confirmedAt: new Date().toISOString(),
              source: 'delivery_check_email'
            }
          }
          : prev
      )
      setMessage(
        data.alreadyConfirmed
          ? 'Ordine già segnato come consegnato.'
          : 'Grazie, abbiamo registrato la ricezione del pacco.'
      )
    } catch (err: any) {
      setError(err.message || 'Errore conferma ricezione')
    } finally {
      setConfirming(false)
    }
  }

  const customerName =
    order?.shipping_details?.name || order?.customer_details?.name || 'Cliente'
  const reviewUrl = useMemo(() => {
    if (!orderId) return '/feedback'
    return `/feedback?source=delivery-check&orderId=${encodeURIComponent(
      orderId
    )}&livemode=${String(livemode)}`
  }, [livemode, orderId])

  return (
    <Layout>
      <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4 py-12 text-[#d5e2ff]">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ea2d0]">Conferma consegna</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">Il tuo ordine è arrivato?</h1>
            <p className="mt-3 max-w-2xl text-[#b6c8f2]">
              Ciao {customerName}, usa questo pulsante per confermare che il pacco è arrivato.
              Dopo la conferma puoi lasciare una recensione facoltativa.
            </p>

            {loading ? (
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#b6c8f2]">
                Caricamento ordine in corso...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#101d3f] p-4 text-sm text-[#c4d4ff]">
                  <p>
                    <strong>Ordine:</strong> #{orderId}
                  </p>
                  <p>
                    <strong>Stato spedizione:</strong> {order?.['order-status'] || 'Non specificato'}
                  </p>
                </div>

                {message ? (
                  <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-100">
                    {message}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={confirming || order?.deliveryConfirmation?.confirmedAt !== undefined}
                    className="rounded-lg bg-[#f97316] px-5 py-3 font-bold text-[#1e293b] transition hover:bg-[#ff9d57] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {confirming
                      ? 'Conferma in corso...'
                      : order?.deliveryConfirmation?.confirmedAt
                        ? 'Ricezione già confermata'
                        : 'Confermo di aver ricevuto il pacco'}
                  </button>

                  <a
                    href={reviewUrl}
                    className="rounded-lg border border-white/15 bg-[#22325d] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#2a3f73]"
                  >
                    Lascia una recensione
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ConfirmDeliveryPage

export const Head = () => <Seo title="Conferma ricezione ordine" pathname="/ordini/conferma-ricezione/" noIndex />