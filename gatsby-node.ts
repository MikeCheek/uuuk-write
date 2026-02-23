import { GatsbyNode } from 'gatsby'
// gatsby-node.ts
import path from 'path'
import { presets } from './src/utilities/arenaSettings'
import { getProducts } from './src/utilities/stripeHelper'

import dotenv from 'dotenv'
import { slugify } from './src/utilities/arenaHelpers'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const createPages = async ({ actions }: any) => {
  const { createPage } = actions

  // 1. Fetch Stripe products
  const apiProducts = await getProducts()
  const allStripeProducts = apiProducts.data

  // 2. Create the Gallery Page
  createPage({
    path: `/galleria`,
    component: path.resolve('./src/templates/GalleryPage.tsx'),
    context: {
      allStripeProducts: allStripeProducts
    }
  })

  // 3. Create Product Pages based on Stripe Data
  allStripeProducts.forEach((stripeProduct: any) => {
    // Attempt to find a matching local preset
    // We look for a preset where our searchName matches the stripe product name
    const presetEntry = Object.entries(presets).find(([key, preset]) => {
      const searchName = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`
      return (
        searchName.trim().toLowerCase() ===
        stripeProduct.name.trim().toLowerCase()
      )
    })

    // If found, presetEntry is [key, presetObject]
    const presetName = presetEntry ? presetEntry[0] : null
    const presetData = presetEntry ? presetEntry[1] : null

    // Use the Stripe name as the slug basis if no preset name exists
    const finalSlug = slugify(
      presetData?.slug ?? presetName ?? stripeProduct.name
    )

    createPage({
      path: `/prodotto/${finalSlug}`,
      component: path.resolve('./src/templates/ProductPage.tsx'),
      context: {
        stripeData: stripeProduct,
        presetName: presetName, // "Occhio A5"
        preset: presetData // The actual Metadata object
      }
    })
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
