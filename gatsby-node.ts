import { GatsbyNode } from 'gatsby'
// gatsby-node.ts
import path from 'path'
import { getProducts, StripeProduct } from './src/utilities/stripeHelper'
import { spareParts } from './src/utilities/spareParts'

import dotenv from 'dotenv'
import { slugify, enrichProductWithPreset } from './src/utilities/arenaHelpers'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const createPages = async ({ actions }: any) => {
  const { createPage } = actions

  // 1. Fetch Stripe products
  const apiProducts = await getProducts()
  const allStripeProducts = apiProducts.data

  // Build a map of spare parts by slug for quick lookup
  const spareMap = new Map<string, typeof spareParts[number]>()
  spareParts.forEach(p => spareMap.set(slugify(p.nome ?? p.id), p))

  // 3. Process Stripe products, merge spare-part info when names match, and create pages
  const usedSlugs = new Set<string>()
  const galleryProducts: any[] = []

  console.log('Stripe products fetched:', allStripeProducts)

  allStripeProducts.forEach((stripeProduct: StripeProduct) => {
    if (!stripeProduct.active) {
      return
    }

    const {
      stripeData,
      presetName,
      preset: presetData
    } = enrichProductWithPreset(stripeProduct)

    const finalSlug = slugify(
      presetData?.slug ?? presetName ?? stripeProduct.name
    )

    usedSlugs.add(finalSlug)

    // Check if this stripe product corresponds to a local spare part
    const sparePart = spareMap.get(finalSlug)

    // Build the page context, including sparePart info when available
    const pageContext: any = {
      stripeData,
      presetName,
      preset: presetData
    }
    if (sparePart) {
      pageContext.sparePart = sparePart
    }

    createPage({
      path: `/prodotto/${finalSlug}`,
      component: path.resolve('./src/templates/ProductPage.tsx'),
      context: pageContext
    })

    // Prepare product entry for gallery (include merged sparePart info)
    const galleryEntry = {
      stripeProduct,
      stripeData,
      presetName,
      preset: presetData,
      slug: finalSlug,
      sparePart: sparePart ?? null
    }
    galleryProducts.push(galleryEntry)
  })

  // 4. Create the Gallery Page with merged product data
  createPage({
    path: `/galleria`,
    component: path.resolve('./src/templates/GalleryPage.tsx'),
    context: {
      allStripeProducts: galleryProducts
    }
  })
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ stage, loaders, actions }) => {
    const { createTypes } = actions
    createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }
    type SitePageContext {
      i18n: i18nContext
    }
    type i18nContext {
        language: String,
        languages: [String],
        defaultLanguage: String,
        originalPath: String
        routed: Boolean
    }
  `)
    // if (stage === 'build-html' || stage === 'develop-html') {
    //   actions.setWebpackConfig({
    //     module: {
    //       rules: [
    //         {
    //           test: /react-p5/,
    //           use: (loaders as any).null(),
    //         },
    //       ],
    //     },
    //   });
    // }
  }
