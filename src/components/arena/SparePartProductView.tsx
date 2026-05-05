import React, { useState } from 'react'
import { Link } from 'gatsby'
import { StripeProduct } from '../../utilities/stripeHelper'
import { ColorOption, colors } from '../../utilities/arenaSettings'
import { useCart } from '../../utilities/cartContext'
import { useSnackbar } from '../../utilities/snackbarContext'
import NoImagePlaceholder from '../atoms/NoImagePlaceholder'

export interface SparePartItem {
  id: string
  nome: string
  description: string
  personalization?: {
    color: ColorOption
    text: string
  }
}

interface SparePartProductViewProps {
  stripeData: StripeProduct
  sparePart?: SparePartItem
}

const SparePartProductView = ({ stripeData, sparePart }: SparePartProductViewProps) => {
  const { addToCart } = useCart()
  const { showSnackbar } = useSnackbar()
  const hasPersonalization = sparePart?.personalization

  const [selectedColor, setSelectedColor] = useState<ColorOption>(sparePart?.personalization?.color || colors[1])
  const [customText, setCustomText] = useState(sparePart?.personalization?.text || '')

  const handleAddToCart = () => {
    if (!stripeData) {
      showSnackbar('Spiacenti, non possiamo aggiungere questo prodotto al carrello al momento.', 'error')
      return
    }

    addToCart({
      id: sparePart?.id || Date.now(),
      name: sparePart?.nome || stripeData.name || 'Ricambio UUUK',
      price: stripeData.default_price?.unit_amount ? Number(stripeData.default_price.unit_amount) / 100 : 0,
      priceId: stripeData.default_price?.id,
      productId: stripeData.id,
      image: stripeData.images?.[0],
      productType: 'spare',
      sparePart: sparePart
        ? {
          id: sparePart.id,
          nome: sparePart.nome,
          description: sparePart.description,
          ...(hasPersonalization && {
            personalization: {
              color: selectedColor,
              text: customText || sparePart.personalization?.text || 'Testo'
            }
          })
        }
        : undefined,
      currentStep: 0,
      format: 'A5',
      modules: [],
      frontCover: {
        color: { name: 'Nero', color: '#000000' },
        collection: 'Custom',
        template: undefined,
        text: '',
        fontSize: 'Medio',
        position: 'Sopra',
        textColor: { name: 'Bianco', color: '#ffffff' }
      },
      backCover: {
        color: { name: 'Nero', color: '#000000' },
        text: '',
        fontSize: 'Medio',
        position: 'Sopra',
        textColor: { name: 'Bianco', color: '#ffffff' }
      }
    } as any)
  }

  return (
    <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top,_#132a52_0%,_#070d1e_60%)] p-4 md:p-12">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f1b3c]/90 shadow-[0_24px_70px_rgba(6,10,20,0.55)]">
        <div className="border-b border-white/10 p-6">
          <Link to="/galleria" title="Torna alla galleria" className="flex items-center gap-1 text-sm text-[#9ad0ff] hover:text-[#ffb170]">
            ← Torna alla galleria
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-12 p-8 md:grid-cols-2 lg:p-12">
          <div className="relative flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1531] p-8">
            {stripeData?.images?.[0] ? (
              <img
                src={stripeData.images[0]}
                alt={sparePart?.nome || 'Ricambio'}
                className="object-contain w-auto h-auto max-h-[60vh]"
              />
            ) : (
              <NoImagePlaceholder size="lg" />
            )}
          </div>
          <div className="flex flex-col justify-center gap-6">
            <div>
              <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-white">
                {sparePart?.nome || stripeData?.name || 'Ricambio UUUK'}
              </h1>
              <p className="text-lg text-[#b6c8f2]">{sparePart?.description || stripeData?.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-block rounded-full border border-[#37b87d]/40 bg-[#37b87d]/15 px-4 py-2 text-lg font-bold text-[#8fe7be]">
                {new Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: stripeData?.default_price?.currency?.toUpperCase() || 'EUR',
                }).format((stripeData?.default_price?.unit_amount || 0) / 100)}
              </span>
            </div>

            {hasPersonalization && (
              <div className="space-y-4 rounded-xl border border-white/10 bg-[#0b1531]/50 p-4">
                <h3 className="text-sm font-bold uppercase tracking-tight text-[#8ea2d0]">Personalizzazione Sidebar</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#9ad0ff]">Colore Sidebar</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`relative flex h-16 w-16 items-center justify-center rounded-lg border-2 text-xs font-bold text-white transition-all ${selectedColor.name === color.name
                          ? 'border-[#f97316] shadow-lg shadow-[#f97316]/50'
                          : 'border-white/20 hover:border-white/40'
                          }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      >
                        {selectedColor.name === color.name && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                            <div className="font-bold text-white">✓</div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="spare-text" className="text-xs font-bold uppercase tracking-wide text-[#9ad0ff]">
                    Testo Sidebar
                  </label>
                  <input
                    id="spare-text"
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.slice(0, 15))}
                    placeholder={sparePart?.personalization?.text || 'Inserisci testo'}
                    className="uuuk-input w-full rounded-lg bg-[#0a1022] px-3 py-2 text-sm placeholder-gray-500"
                  />
                  <p className="text-[10px] text-gray-400">{customText.length}/15</p>
                </div>

                <div className="mt-3 rounded-lg border border-white/10 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-gray-400">Anteprima Sidebar</p>
                  <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-20 rounded-l-lg bg-black md:w-24">
                      <div
                        className="absolute h-6 rounded-sm"
                        style={{ backgroundColor: selectedColor.color, width: '8px', left: '6px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>

                    <div
                      className={`rounded-lg px-3 py-2 text-center text-sm font-bold tracking-wide ${selectedColor.color.substring(1, 3) === 'ff' ? 'text-black' : 'text-white'}`}
                      style={{ backgroundColor: selectedColor.color }}
                    >
                      {customText || sparePart?.personalization?.text || 'Testo'}
                    </div>

                    <div className="absolute bottom-0 right-0 h-full w-20 rounded-r-lg bg-black md:w-24">
                      <div
                        className="absolute h-6 rounded-sm"
                        style={{ backgroundColor: selectedColor.color, width: '8px', right: '6px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                onClick={handleAddToCart}
                className="uuuk-btn-primary inline-flex items-center justify-center px-5 py-3 text-sm"
              >
                Aggiungi al carrello
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SparePartProductView
