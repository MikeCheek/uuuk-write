// src/templates/ProductPage.tsx
import React, { useState, useMemo } from 'react'
import { PageProps, Link, HeadProps } from 'gatsby'
import { Metadata } from '../utilities/arenaSettings' // Adjust path
import Button from '../components/atoms/Button' // Adjust path
import { getCoverTemplateImagePath } from '../utilities/arenaHelpers'
import Switch from '../components/arena/Switch'
import Preview3DWrapper from '../components/arena/Preview3DWrapper'
import { StripeProduct } from '../utilities/stripeHelper'
import Seo from '../components/atoms/Seo'

// The data passed from gatsby-node via "context"
interface PageContextType {
  name: string
  preset: Metadata
  slug: string
}

interface PageContext {
  presetName: string
  preset: Metadata
  stripeData: StripeProduct
}

const ProductPage: React.FC<PageProps<null, PageContext>> = ({ pageContext }) => {
  const { preset, presetName, stripeData } = pageContext
  const [mode, setMode] = useState<'flat' | '3D'>('flat')
  const [loading, setLoading] = useState(false)

  const name = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`

  // The price is already here! No fetching required.
  const formattedPrice = useMemo(() => {
    if (!stripeData || !stripeData.default_price.unit_amount) return "Prezzo su richiesta"
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: stripeData.default_price.currency.toUpperCase(),
    }).format(stripeData.default_price.unit_amount / 100)
  }, [stripeData])

  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-4 md:p-12">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* Breadcrumb / Back Link */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/galleria" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
            ← Torna alla galleria
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">

          {/* LEFT COLUMN: Visual Preview */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 relative min-h-[500px]">
            <div className="absolute top-4 right-4 z-20">
              <Switch isOn={mode === '3D'} toggleSwitch={() => setMode(mode === 'flat' ? '3D' : 'flat')} />
            </div>

            <div className="scale-100 transition-transform duration-500 max-h-[60vh]">
              {
                preset && mode === '3D' ? (
                  <Preview3DWrapper product={preset} noExtra />
                ) : (
                  <img
                    src={stripeData.images[0] || getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)}
                    alt={name}
                    width={200}
                    height={360}
                    className="object-contain !w-auto !h-auto"
                  />
                )
              }
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">
                {preset.frontCover.collection}
              </h3>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{name}</h1>
              <div className="flex items-center gap-4">
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
                  Formato {preset.format}
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
                  {preset.modules.length} Moduli
                </span>
              </div>
            </div>

            <div className="text-gray-600 leading-relaxed">
              <p>
                Agenda {preset.format} della collezione {preset.frontCover.collection}.
                Include template personalizzati e {preset.modules.length} sezioni interne.
                Perfetta per l'organizzazione quotidiana.
              </p>
            </div>

            <div className="mt-4 pt-6 border-t border-gray-100">
              <div className="flex items-end gap-4 mb-8">
                {loading ? (
                  <div className="h-10 w-32 bg-gray-100 animate-pulse rounded"></div>
                ) : formattedPrice ? (
                  <span className="text-4xl font-bold text-gray-900">{formattedPrice}</span>
                ) : (
                  <span className="text-gray-400 italic">Prezzo non disponibile</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  text="Acquista Ora"
                  // Link to your checkout/arena with paynow flag
                  href={`/arena?preset=${name}&paynow=true${stripeData ? `&pid=${stripeData.id}` : ''}`}
                />
                <Button
                  text="Personalizza"
                  variant="secondary"
                  href={`/arena?preset=${name}`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductPage

type HeadPageContext = {
  presetName: string
  preset: Metadata
  stripeData: StripeProduct | null
}

export const Head = ({ location, pageContext }: HeadProps<null, HeadPageContext>) => {
  const { presetName, preset, stripeData } = pageContext;

  // Construct a clean description
  const description = preset
    ? `Scopri l'agenda ${presetName} della collezione ${preset.frontCover.collection}. Formato ${preset.format}, personalizzala o acquistala subito!`
    : `Scopri la nostra agenda personalizzata UUUK. Design unico e qualità premium.`;

  const seoImages = stripeData?.images?.length
    ? stripeData.images
    : [getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)];



  return (
    <Seo
      lang="it"
      // Use presetName since 'name' isn't in your context
      title={presetName}
      pathname={location.pathname}
      description={description}
      structuredData={true}
      // Pass the raw amount (SEO component handles the decimal)
      price={stripeData?.default_price?.unit_amount ? Number((stripeData.default_price.unit_amount / 100).toFixed(2)) : undefined}
      currency={stripeData?.default_price?.currency?.toUpperCase() || 'EUR'}
      sku={stripeData?.id}
      images={seoImages}
    />
  )
}