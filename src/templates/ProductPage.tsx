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
  presetName: string
  preset: Metadata
  stripeData: StripeProduct
}

const ProductPage: React.FC<PageProps<null, PageContext>> = ({ pageContext }) => {


  return (
    <Layout showCustomCursor={false} shoppingCart>
      <ProductDetails {...pageContext} />
    </Layout>
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
      price={stripeData?.default_price?.unit_amount ? Number((stripeData.default_price.unit_amount / 100)) : undefined}
      currency={stripeData?.default_price?.currency?.toUpperCase() || 'EUR'}
      sku={stripeData?.id}
      images={seoImages}
    />
  )
}