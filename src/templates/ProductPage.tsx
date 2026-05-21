import React from 'react'
import { PageProps, HeadProps } from 'gatsby'
import { Metadata } from '../utilities/arenaSettings'
import { getCoverTemplateImagePath } from '../utilities/arenaHelpers'
import { StripeProduct } from '../utilities/stripeHelper'
import Seo from '../components/atoms/Seo'
import Layout from '../components/organisms/Layout'
import ProductDetails from '../components/arena/ProductDetails'
import SparePartProductView from '../components/arena/SparePartProductView'
import { SparePartItem } from '../utilities/spareParts'

interface PageContext {
  presetName: string | null
  preset: Metadata | null
  stripeData: StripeProduct
  sparePart?: SparePartItem
}

const ProductPage: React.FC<PageProps<null, PageContext>> = ({ pageContext }) => {
  const { preset, stripeData, sparePart } = pageContext
  const isSpare = !preset

  if (isSpare) {
    return (
      <Layout showCustomCursor={false} shoppingCart>
        <SparePartProductView stripeData={stripeData} sparePart={sparePart} />
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
