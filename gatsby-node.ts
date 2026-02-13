import { GatsbyNode } from 'gatsby'
// gatsby-node.ts
import path from 'path'
import { presets } from './src/utilities/arenaSettings'
import { getProducts } from './src/utilities/stripeHelper'

import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// Helper to slugify names for URLs
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()

export const createPages = async ({ actions }: any) => {
  const { createPage } = actions

  // 1. Fetch API data at Build Time
  const apiProducts = await getProducts()

  createPage({
    path: `/galleria`, // or your gallery path
    component: path.resolve('./src/templates/GalleryPage.tsx'), // Point to your Gallery file
    context: {
      allStripeProducts: apiProducts.data // Pass the full array here
    }
  })

  // 2. Iterate through local presets
  Object.entries(presets).forEach(([key, preset]) => {
    // 3. Find the matching Stripe product
    const searchName = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`
    const stripeMatch = apiProducts.data.find(
      (p: any) =>
        p.name.trim().toLowerCase() === searchName.trim().toLowerCase()
    )

    createPage({
      path: `/prodotto/${slugify(key)}`,
      component: path.resolve('./src/templates/ProductPage.tsx'),
      context: {
        presetName: key,
        preset: preset,
        // Pass the combined Stripe data directly!
        stripeData: stripeMatch || null
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
