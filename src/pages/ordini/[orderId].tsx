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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown mx-auto mb-4"></div>
            <p className="text-brown">Caricamento ordine...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-brown mb-2">Ordine non trovato</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a href="/carrello" className="text-brown hover:underline">
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
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Status Header */}
          <div className={`bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border-l-4 ${currentStatus.color.replace('text-', 'border-')}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={currentStatus.color}>{currentStatus.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-brown">Ordine {order.orderId}</h1>
                <p className={`text-lg font-semibold ${currentStatus.color}`}>
                  {currentStatus.label}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-400 uppercase">Data ordine</p>
                <p className="font-semibold text-brown">
                  {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: it })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Totale</p>
                <p className="font-semibold text-brown">
                  €{totalAmount} {order.currency.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Modalità</p>
                <p className="font-semibold text-brown">
                  {order.isTest ? 'Test' : 'Live'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Ultimo aggiornamento</p>
                <p className="font-semibold text-brown">
                  {format(new Date(order.updatedAt), 'HH:mm', { locale: it })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status Stepper */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-brown mb-8">Stato della spedizione</h2>
            <div className="relative">
              <div className="flex justify-between items-start">
                {/* Step 1: In Preparazione */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 0
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                    }`}>
                    {currentStepIndex > 0 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Package size={28} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-brown text-center">In Preparazione</p>
                  <p className="text-xs text-gray-400 text-center mt-1">1-2 giorni</p>
                </div>

                {/* Connecting line 1 */}
                <div className={`flex-1 h-1 mt-6 mx-2 transition-all ${currentStepIndex >= 1
                  ? 'bg-green-500'
                  : 'bg-gray-600'
                  }`} />

                {/* Step 2: Spedito */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                    }`}>
                    {currentStepIndex > 1 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Truck size={28} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-brown text-center">Spedito</p>
                  <p className="text-xs text-gray-400 text-center mt-1">3-5 giorni</p>
                </div>

                {/* Connecting line 2 */}
                <div className={`flex-1 h-1 mt-6 mx-2 transition-all ${currentStepIndex >= 2
                  ? 'bg-green-500'
                  : 'bg-gray-600'
                  }`} />

                {/* Step 3: Consegnato */}
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg transition-all ${currentStepIndex >= 2
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                    }`}>
                    {currentStepIndex >= 2 ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Home size={28} />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-brown text-center">Consegnato</p>
                  <p className="text-xs text-gray-400 text-center mt-1">Completato</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-brown mb-6 flex items-center gap-2">
              <Package size={24} />
              Articoli ordinati
            </h2>
            <div className="space-y-4">
              {order.orderLineItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-semibold text-brown">{item.name}</p>
                    <p className="text-sm text-gray-400">Quantità: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brown">
                    €{(item.totalAmount / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          {order.shipping_details && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-brown mb-6">Indirizzo di spedizione</h2>
              <div className="border-white border-2 p-6 rounded-xl">
                <p className="font-semibold text-brown text-lg mb-2">
                  {order.shipping_details.name}
                </p>
                <p className="text-gray-400 whitespace-pre-line">
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
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-brown mb-6 flex items-center gap-2">
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
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-brown mb-6 flex items-center gap-2">
                <Download size={24} />
                Documenti
              </h2>
              <div className="space-y-3">
                {order.invoice.invoiceNumber && (
                  <p className="text-sm text-gray-600">
                    <strong>Numero fattura:</strong> {order.invoice.invoiceNumber}
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  {order.invoice.hostedInvoiceUrl && (
                    <a
                      href={order.invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brown text-white rounded-lg hover:bg-opacity-90 transition-all w-fit"
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-opacity-90 transition-all w-fit"
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-opacity-90 transition-all w-fit"
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
            <a href="/carrello" className="text-brown hover:underline font-semibold">
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
