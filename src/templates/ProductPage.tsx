import React from 'react'
import { PageProps, Link, HeadProps } from 'gatsby'
import { Metadata } from '../utilities/arenaSettings'
import { getCoverTemplateImagePath } from '../utilities/arenaHelpers'
import { StripeProduct } from '../utilities/stripeHelper'
import Seo from '../components/atoms/Seo'
import Layout from '../components/organisms/Layout'
import ProductDetails from '../components/arena/ProductDetails'

// The data passed from gatsby-node via "context"
interface PageContextType {
  name: string
  preset: Metadata
  slug: string
}

interface PageContext {
  presetName: string | null
  preset: Metadata | null
  stripeData: StripeProduct
  spareParts?: Array<{ id: string; nome: string; description: string }>
}

const ProductPage: React.FC<PageProps<null, PageContext>> = ({ pageContext }) => {
  const { preset, stripeData, spareParts } = pageContext
  const isSpare = !preset

  if (isSpare) {
    // Render simplified view for spare parts
    const sparePart = spareParts?.[0]
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
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <svg className="w-20 h-20 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-lg font-semibold text-white/40">Nessuna immagine</span>
                  </div>
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
  spareParts?: Array<{ id: string; nome: string; description: string }>
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
