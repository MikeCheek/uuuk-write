import React, { useEffect, useState } from 'react'
import { HeadProps, PageProps } from 'gatsby'
import Layout from '../../components/organisms/Layout'
import Seo from '../../components/atoms/Seo'
import Modal from '../../components/atoms/Modal'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { CheckCircle, Clock, AlertCircle, Package, Mail, Download, ExternalLink, Truck, Home } from 'lucide-react'
import { useSnackbar } from '../../utilities/snackbarContext'

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

type OrderPageParams = {
  orderId?: string
}

const OrderPage = ({ params }: PageProps<Record<string, never>, OrderPageParams>) => {
  const orderId = params?.orderId
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    if (!orderId) {
      // Keep the loading UI until Gatsby route params are available.
      return
    }

    setLoading(true)
    setError(null)

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
            <h1 className="mb-2 text-xl md:text-2xl font-bold">Ordine non trovato</h1>
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
  const detailedItems = Array.isArray(order.items) ? order.items : []
  const customerName =
    order.shipping_details?.name ||
    ((order as any)?.customer_details?.name as string | undefined) ||
    'Cliente'

  const helpMailTo = `mailto:uuuk.thefuture@gmail.com?subject=${encodeURIComponent(
    `Supporto ordine ${order.orderId}`
  )}&body=${encodeURIComponent(
    `Ciao team UUUK,%0D%0Aho bisogno di supporto per il mio ordine ${order.orderId}.%0D%0A` +
    `Motivo: info/modifiche/problema.%0D%0A%0D%0AGrazie!`
  )}`

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSnackbar(successMessage, 'success')
    } catch {
      showSnackbar('Impossibile copiare automaticamente. Copia manualmente.', 'error')
    }
  }

  const resolveItemImageSrc = (image: any): string => {
    if (typeof image === 'string' && image.trim()) {
      return image
    }

    if (image && typeof image === 'object') {
      const fallbackSrc = image?.images?.fallback?.src
      if (typeof fallbackSrc === 'string' && fallbackSrc.trim()) {
        return fallbackSrc
      }
    }

    return '/placeholder-agenda.png'
  }

  const orderSteps = ['In Preparazione', 'Spedito', 'Consegnato']
  const stepIndex = orderSteps.findIndex(step =>
    step.toLowerCase().trim().replace(" ", "-") === order['order-status']?.toLowerCase().trim()
  )
  const currentStepIndex = stepIndex !== -1 ? stepIndex : 0

  return (
    <Layout>
      <Modal show={helpModalOpen} onClose={() => setHelpModalOpen(false)} showCursor>
        <div className="flex max-w-md flex-col gap-4 p-2 text-[#f3f7ff]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8ea2d0]">Supporto ordine</p>
          <h3 className="text-2xl font-black uppercase leading-tight">Come vuoi contattarci?</h3>
          <p className="text-sm text-[#c4d4ff]">
            Scegli un&apos;azione rapida per ricevere assistenza su ordine, modifiche o informazioni.
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <a
              href={helpMailTo}
              className="inline-flex items-center justify-center rounded-lg border border-[#f97316]/35 bg-[#f97316] px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-[#1e293b] transition-all hover:bg-[#fb8a35]"
            >
              Apri email precompilata
            </a>

            <button
              type="button"
              onClick={() => copyToClipboard('uuuk.thefuture@gmail.com', 'Email copiata')}
              className="rounded-lg border border-white/20 bg-[#22325d] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a3f73]"
            >
              Copia indirizzo email
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(order.orderId, 'ID ordine copiato')}
              className="rounded-lg border border-white/20 bg-[#22325d] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a3f73]"
            >
              Copia ID ordine
            </button>
          </div>
        </div>
      </Modal>

      <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-5 shadow-[0_12px_36px_rgba(6,10,20,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8ea2d0]">Benvenuto</p>
            <h2 className="mt-1 text-xl md:text-2xl font-black tracking-tight text-[#f6f8ff]">Ciao {customerName}!</h2>
            <p className="mt-2 text-sm text-[#b6c8f2]">Qui trovi stato, dettagli e documenti del tuo ordine.</p>
          </div>

          {/* Status Header */}
          <div className={`mb-8 rounded-2xl border border-white/10 border-l-4 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)] ${currentStatus.color.replace('text-', 'border-')}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={currentStatus.color}>{currentStatus.icon}</div>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Ordine {order.orderId}</h1>
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
              {
                order.isTest ? <></> :
                  <div>
                    <p className="text-xs uppercase text-[#8ea2d0]">Modalità</p>
                    <p className="font-semibold text-white">
                      Live
                    </p>
                  </div>
              }
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
            <h2 className="mb-8 text-xl md:text-2xl font-black uppercase tracking-tight text-white">Stato della spedizione</h2>
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
            <h2 className="mb-6 flex items-center gap-2 text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              <Package size={24} />
              Articoli ordinati
            </h2>
            <div className="space-y-4">
              {(detailedItems.length > 0 ? detailedItems : order.orderLineItems || []).map((item: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-[#101d3f]/70 p-4">
                  <div className="mb-3 flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0b1531]">
                        <img
                          src={resolveItemImageSrc(item.image)}
                          alt={item.name || 'Agenda personalizzata'}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-white">{item.name || 'Agenda personalizzata'}</p>
                        <p className="text-sm text-[#8ea2d0]">Quantità: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-bold text-[#ffb170]">
                      {typeof item.totalAmount === 'number'
                        ? `€${(item.totalAmount / 100).toFixed(2)}`
                        : `€${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`}
                    </p>
                  </div>

                  {item.frontCover && item.backCover ? (
                    <div className="space-y-2 text-xs text-[#d8e5ff]">
                      <div className="rounded-lg border border-white/10 bg-[#0b1531]/70 p-2">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8ea2d0]">Copertina anteriore</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">{item.frontCover.collection}</span>
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">{item.frontCover.template ?? 'Custom'}</span>
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">Colore: {item.frontCover.color?.name}</span>
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">Testo: {item.frontCover.text?.trim() ? item.frontCover.text + '( ' + item.frontCover.fontSize + ', ' + item.frontCover.position + ' )' : 'Nessuno'}</span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-[#0b1531]/70 p-2">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8ea2d0]">Sidebars ({item.modules?.length || 0})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.modules || []).map((mod: any, modIndex: number) => (
                            <span key={`order-mod-${idx}-${mod.id || modIndex}`} className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">
                              {mod.sidebarText} · {mod.sidebarColor?.name}{mod.isDouble ? ' · Doppio' : ''}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-[#0b1531]/70 p-2">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8ea2d0]">Copertina posteriore</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">Colore: {item.backCover.color?.name}</span>
                          <span className="rounded border border-white/15 bg-[#101d3f] px-2 py-0.5">Testo: {item.backCover.text?.trim() ? item.backCover.text + '( ' + item.backCover.fontSize + ', ' + item.backCover.position + ' )' : 'Nessuno'}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          {order.shipping_details && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_15px_45px_rgba(6,10,20,0.5)]">
              <h2 className="mb-6 text-xl md:text-2xl font-black uppercase tracking-tight text-white">Indirizzo di spedizione</h2>
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
              <h2 className="mb-6 flex items-center gap-2 text-xl md:text-2xl font-black uppercase tracking-tight text-white">
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
              <h2 className="mb-6 flex items-center gap-2 text-xl md:text-2xl font-black uppercase tracking-tight text-white">
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
            <a href="/galleria" className="font-semibold text-[#ffb170] hover:underline">
              ← Acquista ancora
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHelpModalOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[#f97316]/45 bg-[#f97316] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#1e293b] shadow-[0_14px_30px_rgba(249,115,22,0.35)] transition-all hover:bg-[#fb8a35]"
        >
          Aiuto
        </button>
      </div>
    </Layout>
  )
}

export default OrderPage

export const Head = ({ params }: HeadProps<any>) => {
  const orderId = params?.orderId || 'Ordine'
  return <Seo title={`Dettagli Ordine ${orderId}`} pathname="/ordini/" noIndex />
}
