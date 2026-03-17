import React, { useEffect, useState } from 'react'
import { HeadProps } from 'gatsby'
import Layout from '../../components/organisms/Layout'
import Seo from '../../components/atoms/Seo'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { CheckCircle, Clock, AlertCircle, Package, Mail, Download, ExternalLink, Truck, Home } from 'lucide-react'

type OrderData = {
  orderId: string
  status: 'paid' | 'pending' | 'failed' | string
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
  isTest: boolean
  items: any[]
  'order-status': string
  shipping_details: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      postal_code: string
      state: string
      country: string
    }
  } | null
  emailNotification?: {
    sent: boolean
    recipient: string
    attemptedAt: string
    reason: string | null
  }
  invoice?: {
    hostedInvoiceUrl: string | null
    invoicePdf: string | null
    receiptUrl: string | null
    invoiceNumber: string | null
  }
  orderLineItems?: Array<{
    name: string
    quantity: number
    totalAmount: number
    currency: string
  }>
}

const OrderPage = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('ID dell\'ordine mancante')
      setLoading(false)
      return
    }

    // Fetch order details
    fetch(`/api/get-order?orderId=${encodeURIComponent(orderId)}&livemode=${process.env.GATSBY_STRIPE_PUBLISHABLE_KEY?.includes("pk_live") || false}`)
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
        console.error('Error fetching order:', err)
        setError(err.message || 'Errore sconosciuto durante il recupero dell\'ordine')
      })
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4 py-12 text-[#d5e2ff]">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-[#f97316]"></div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8ea2d0]">Recupero dati ordine</p>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white">Caricamento in corso</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 md:grid-cols-4">
                <div className="h-12 animate-pulse rounded-lg bg-white/10" />
                <div className="h-12 animate-pulse rounded-lg bg-white/10" />
                <div className="h-12 animate-pulse rounded-lg bg-white/10" />
                <div className="h-12 animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <div className="mb-6 h-7 w-56 animate-pulse rounded bg-white/10" />
              <div className="space-y-4">
                <div className="h-20 animate-pulse rounded-xl bg-white/10" />
                <div className="h-20 animate-pulse rounded-xl bg-white/10" />
                <div className="h-20 animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#070d1e] px-4 text-white">
          <div className="text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-[#f97316]" />
            <h1 className="mb-2 text-2xl font-bold">Ordine non trovato</h1>
            <p className="mb-6 text-[#a4b8e8]">{error}</p>
            <a href="/carrello" className="text-[#ffb170] hover:underline">
              Torna al carrello
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    paid: {
      icon: <CheckCircle size={32} />,
      color: 'text-green-600',
      label: 'Pagato'
    },
    pending: {
      icon: <Clock size={32} />,
      color: 'text-yellow-600',
      label: 'In sospeso'
    },
    failed: {
      icon: <AlertCircle size={32} />,
      color: 'text-red-600',
      label: 'Fallito'
    }
  }

  const currentStatus = statusConfig[order.status] || statusConfig.pending
  const totalAmount = (order.amount / 100).toFixed(2)

  const orderSteps = ['In Preparazione', 'Spedito', 'Consegnato']
  const stepIndex = orderSteps.findIndex(step =>
    step.toLowerCase().trim().replace(" ", "-") === order['order-status']?.toLowerCase().trim()
  )
  const currentStepIndex = stepIndex !== -1 ? stepIndex : 0

  console.log('Order data:', currentStepIndex, order['order-status'], order)

  return (
    <Layout>
      <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          {/* Status Header */}
          <div className={`mb-8 rounded-2xl border border-white/10 border-l-4 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)] ${currentStatus.color.replace('text-', 'border-')}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={currentStatus.color}>{currentStatus.icon}</div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Ordine {order.orderId}</h1>
                <p className={`text-lg font-semibold ${currentStatus.color}`}>
                  {currentStatus.label}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-[#8ea2d0]">Data ordine</p>
                <p className="font-semibold text-white">
                  {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: it })}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#8ea2d0]">Totale</p>
                <p className="font-semibold text-white">
                  €{totalAmount} {order.currency.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#8ea2d0]">Modalità</p>
                <p className="font-semibold text-white">
                  {order.isTest ? 'Test' : 'Live'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#8ea2d0]">Ultimo aggiornamento</p>
                <p className="font-semibold text-white">
                  {format(new Date(order.updatedAt), 'HH:mm', { locale: it })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status Stepper */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
            <h2 className="mb-8 text-2xl font-black uppercase tracking-tight text-white">Stato della spedizione</h2>
            <div className="relative">
              <div className="flex justify-between items-start">
                {/* Step 1: In Preparazione */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 0
                    ? 'bg-green-500 text-white'
                    : 'bg-[#2a375a] text-[#9fb1dc]'
                    }`}>
                    {currentStepIndex > 0 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Package size={28} />
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold text-white">In Preparazione</p>
                  <p className="mt-1 text-center text-xs text-[#8ea2d0]">1-2 giorni</p>
                </div>

                {/* Connecting line 1 */}
                <div className={`flex-1 h-1 mt-6 mx-2 transition-all ${currentStepIndex >= 1
                  ? 'bg-green-500'
                  : 'bg-[#2a375a]'
                  }`} />

                {/* Step 2: Spedito */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 1
                    ? 'bg-green-500 text-white'
                    : 'bg-[#2a375a] text-[#9fb1dc]'
                    }`}>
                    {currentStepIndex > 1 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Truck size={28} />
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold text-white">Spedito</p>
                  <p className="mt-1 text-center text-xs text-[#8ea2d0]">3-5 giorni</p>
                </div>

                {/* Connecting line 2 */}
                <div className={`flex-1 h-1 mt-6 mx-2 transition-all ${currentStepIndex >= 2
                  ? 'bg-green-500'
                  : 'bg-[#2a375a]'
                  }`} />

                {/* Step 3: Consegnato */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 2
                    ? 'bg-green-500 text-white'
                    : 'bg-[#2a375a] text-[#9fb1dc]'
                    }`}>
                    {currentStepIndex >= 2 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Home size={28} />
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold text-white">Consegnato</p>
                  <p className="mt-1 text-center text-xs text-[#8ea2d0]">Completato</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-white">
              <Package size={24} />
              Articoli ordinati
            </h2>
            <div className="space-y-4">
              {order.orderLineItems?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-[#8ea2d0]">Quantità: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#ffb170]">
                    €{(item.totalAmount / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          {order.shipping_details && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-white">Indirizzo di spedizione</h2>
              <div className="rounded-xl border border-white/20 bg-[#101d3f] p-6">
                <p className="mb-2 text-lg font-semibold text-white">
                  {order.shipping_details.name}
                </p>
                <p className="whitespace-pre-line text-[#afc1ea]">
                  {order.shipping_details.address.line1}
                  {order.shipping_details.address.line2 && `\n${order.shipping_details.address.line2}`}
                  {`\n${order.shipping_details.address.postal_code} ${order.shipping_details.address.city}`}
                  {`\n${order.shipping_details.address.state}, ${order.shipping_details.address.country}`}
                </p>
              </div>
            </div>
          )}

          {/* Email Notification Status */}
          {order.emailNotification && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-white">
                <Mail size={24} />
                Conferma email
              </h2>
              <div className={`p-4 rounded-xl ${order.emailNotification.sent ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`font-semibold ${order.emailNotification.sent ? 'text-green-700' : 'text-yellow-700'}`}>
                  {order.emailNotification.sent
                    ? '✓ Email di conferma inviata'
                    : 'Email di conferma in sospeso'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Destinatario: {order.emailNotification.recipient}
                </p>
                {order.emailNotification.reason && (
                  <p className="text-sm text-red-600 mt-2">
                    Errore: {order.emailNotification.reason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Invoice & Receipt */}
          {order.invoice && (order.invoice.hostedInvoiceUrl || order.invoice.invoicePdf || order.invoice.receiptUrl) && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-white">
                <Download size={24} />
                Documenti
              </h2>
              <div className="space-y-3">
                {order.invoice.invoiceNumber && (
                  <p className="text-sm text-[#b8c9f1]">
                    <strong>Numero fattura:</strong> {order.invoice.invoiceNumber}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {order.invoice.hostedInvoiceUrl && (
                    <a
                      href={order.invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#f97316]/30 bg-[#f97316] px-4 py-2 font-semibold text-[#17213a] transition-all hover:bg-[#fb8a35]"
                    >
                      <ExternalLink size={16} />
                      Visualizza Fattura
                    </a>
                  )}
                  {order.invoice.invoicePdf && (
                    <a
                      href={order.invoice.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-[#22325d] px-4 py-2 text-white transition-all hover:bg-[#2a3f73]"
                    >
                      <Download size={16} />
                      Scarica PDF
                    </a>
                  )}
                  {order.invoice.receiptUrl && (
                    <a
                      href={order.invoice.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-[#2a3f73] px-4 py-2 text-white transition-all hover:bg-[#31508f]"
                    >
                      <ExternalLink size={16} />
                      Ricevuta Pagamento
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center">
            <a href="/carrello" className="font-semibold text-[#ffb170] hover:underline">
              ← Torna al carrello
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderPage

export const Head = ({ params }: HeadProps<any>) => {
  const orderId = params?.orderId || 'Ordine'
  return <Seo title={`Dettagli Ordine ${orderId}`} pathname="/ordini/" noIndex />
}
