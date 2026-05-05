import React, { useState } from 'react'
import { PageProps, Link, HeadProps } from 'gatsby'
import { Metadata, ColorOption, colors } from '../utilities/arenaSettings'
import { getCoverTemplateImagePath } from '../utilities/arenaHelpers'
import { StripeProduct } from '../utilities/stripeHelper'
import Seo from '../components/atoms/Seo'
import Layout from '../components/organisms/Layout'
import ProductDetails from '../components/arena/ProductDetails'
import { useCart } from '../utilities/cartContext'
import NoImagePlaceholder from '../components/atoms/NoImagePlaceholder'

// The data passed from gatsby-node via "context"
interface PageContextType {
  name: string
  preset: Metadata
  slug: string
}

interface SparePartItem {
  id: string
  nome: string
  description: string
  personalization?: {
    color: ColorOption
    text: string
  }
}

interface PageContext {
  presetName: string | null
  preset: Metadata | null
  stripeData: StripeProduct
  spareParts?: SparePartItem[]
}

const ProductPage: React.FC<PageProps<null, PageContext>> = ({ pageContext }) => {
  const { preset, stripeData, spareParts } = pageContext
  const { addToCart } = useCart()
  const isSpare = !preset
  const sparePart = spareParts?.[0]
  const hasPersonalization = sparePart?.personalization

  // State for personalization
  const [selectedColor, setSelectedColor] = useState<ColorOption>(sparePart?.personalization?.color || colors[1]) // Default to white
  const [customText, setCustomText] = useState(sparePart?.personalization?.text || '')

  if (isSpare) {
    // Render simplified view for spare parts
    return (
      <Layout showCustomCursor={false} shoppingCart>
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

                {/* Personalization Section */}
                {hasPersonalization && (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-[#0b1531]/50 p-4">
                    <h3 className="text-sm font-bold uppercase tracking-tight text-[#8ea2d0]">Personalizzazione Sidebar</h3>

                    {/* Color Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#9ad0ff]">Colore Sidebar</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`relative h-16 w-16 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold text-white ${selectedColor.name === color.name
                              ? 'border-[#f97316] shadow-lg shadow-[#f97316]/50'
                              : 'border-white/20 hover:border-white/40'
                              }`}
                            style={{ backgroundColor: color.color }}
                            title={color.name}
                          >
                            {selectedColor.name === color.name && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                <div className="text-white font-bold">✓</div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Input */}
                    <div className="space-y-2">
                      <label htmlFor="spare-text" className="text-xs font-bold uppercase tracking-wide text-[#9ad0ff]">
                        Testo Sidebar
                      </label>
                      <input
                        id="spare-text"
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.slice(0, 15))} // Max 15 chars
                        placeholder={sparePart?.personalization?.text || 'Inserisci testo'}
                        className="uuuk-input w-full rounded-lg bg-[#0a1022] px-3 py-2 text-sm placeholder-gray-500"
                      />
                      <p className="text-[10px] text-gray-400">{customText.length}/15</p>
                    </div>

                    {/* Sidebar Preview */}
                    <div className="mt-3 p-3 rounded-lg border border-white/10">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Anteprima Sidebar</p>
                      <div className="relative">
                        <div className="absolute top-0 left-0 w-20 md:w-24 h-full rounded-l-lg bg-black">
                          <div className="absolute h-6 top-1/2 -translate-y-1/2 rounded-sm" style={{ backgroundColor: selectedColor.color, width: '8px', left: '6px' }} />
                        </div>

                        <div
                          className={`rounded-lg px-3 py-2 text-center text-sm font-bold tracking-wide ${selectedColor.color.substring(1, 3) === 'ff' ? 'text-black' : 'text-white'}`}
                          style={{ backgroundColor: selectedColor.color }}
                        >
                          {customText || sparePart?.personalization?.text || 'Testo'}
                        </div>

                        <div className="absolute bottom-0 right-0 w-20 md:w-24 h-full rounded-r-lg bg-black">
                          <div className="absolute h-6 top-1/2 -translate-y-1/2 rounded-sm" style={{ backgroundColor: selectedColor.color, width: '8px', right: '6px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => addToCart({
                      ...sparePart,
                      productId: stripeData?.id,
                      priceId: stripeData?.default_price?.id,
                      price: stripeData?.default_price?.unit_amount ? Number(stripeData.default_price.unit_amount) / 100 : 0,
                      image: stripeData?.images?.[0],
                      name: sparePart?.nome || stripeData?.name,
                      id: sparePart?.id || stripeData?.id,
                      productType: 'spare',
                      // ...(hasPersonalization && {
                      //   personalization: {
                      //     color: selectedColor,
                      //     text: customText || sparePart.personalization?.text || 'Testo'
                      //   }
                      // }),
                      sparePart
                    } as any)}
                    className="uuuk-btn-primary inline-flex items-center justify-center px-5 py-3 text-sm"
                  >
                    Aggiungi al carrello
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showCustomCursor={false} shoppingCart>
      <ProductDetails {...pageContext as any} />
    </Layout>
  )
}

export default ProductPage

type HeadPageContext = {
  presetName: string
  preset: Metadata | null
  stripeData: StripeProduct | null
  spareParts?: SparePartItem[]
}

export const Head = ({ location, pageContext }: HeadProps<null, HeadPageContext>) => {
  const { presetName, preset, stripeData, spareParts } = pageContext;
  const sparePart = spareParts?.[0]
  const isSpare = preset === null || preset === undefined

  // Construct a clean description
  const description = !isSpare && preset
    ? `Scopri l'agenda stampata 3D ${presetName} della collezione ${preset.frontCover.collection}. Formato ${preset.format}, personalizzabile e pronta all'acquisto online.`
    : sparePart
      ? `${sparePart.description || 'Accessorio UUUK'}`
      : `Scopri la nostra agenda stampata 3D personalizzata UUUK. Design unico e qualità premium.`;

  const seoImages = stripeData?.images?.length
    ? stripeData.images
    : !isSpare && preset
      ? [getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)]
      : [];



  return (
    <Seo
      lang="it"
      // Use presetName since 'name' isn't in your context
      title={isSpare ? (sparePart?.nome || 'Prodotto') : presetName}
      pathname={location.pathname}
      description={description}
      structuredData={true}
      // Pass the raw amount (SEO component handles the decimal)
      price={stripeData?.default_price?.unit_amount ? Number((stripeData.default_price.unit_amount / 100)) : undefined}
      currency={stripeData?.default_price?.currency?.toUpperCase() || 'EUR'}
      sku={stripeData?.id}
      images={seoImages}
      keywords={!isSpare && preset ? `agenda stampata 3d ${presetName}, agenda ${preset.format}, agenda personalizzabile ${preset.frontCover.collection}` : `${sparePart?.nome || 'accessori'} UUUK, agenda`}
      type='product'
    />
  )
}
