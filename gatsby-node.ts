import { GatsbyNode } from 'gatsby'
// gatsby-node.ts
import path from 'path'
import { getProducts, StripeProduct } from './src/utilities/stripeHelper'
import { spareParts } from './src/utilities/spareParts'

import dotenv from 'dotenv'
import { slugify, enrichProductWithPreset } from './src/utilities/arenaHelpers'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const createPages = async ({ actions, graphql }: any) => {
  const { createPage } = actions

  // 1. Fetch Stripe products
  const apiProducts = await getProducts()
  const allStripeProducts = apiProducts.data

  const sparePartsResult = await graphql(`
    query SparePartImages {
      allFile(
        filter: {
          extension: { regex: "/(jpg|jpeg|png|webp)/" }
          relativeDirectory: { regex: "/^spareParts\\//" }
        }
        sort: { name: ASC }
      ) {
        nodes {
          relativeDirectory
          name
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: CONSTRAINED)
          }
        }
      }
    }
  `)

  if (sparePartsResult.errors) {
    throw sparePartsResult.errors
  }

  const sparePartImagesById = new Map<string, any[]>()
  ;(sparePartsResult.data?.allFile?.nodes ?? []).forEach((node: any) => {
    const sparePartId = String(node.relativeDirectory || '')
      .split('/')
      .pop()
    if (!sparePartId) return
    const imageData = node.childImageSharp?.gatsbyImageData
    if (!imageData) return

    const current = sparePartImagesById.get(sparePartId) ?? []
    current.push(imageData)
    sparePartImagesById.set(sparePartId, current)
  })

  const sparePartsWithImages = spareParts.map(sparePart => ({
    ...sparePart,
    images: sparePartImagesById.get(sparePart.id) ?? []
  }))

  // Build a map of spare parts by slug for quick lookup
  const spareMap = new Map<string, typeof spareParts[number]>()
  sparePartsWithImages.forEach(p => spareMap.set(slugify(p.nome ?? p.id), p))
  // Identify universal spare parts (names without separators like " - ")
  const universalSpareParts = sparePartsWithImages.filter(
    p => !(p.nome || '').includes(' - ')
  )

  // 3. Process Stripe products, merge spare-part info when names match, and create pages
  const usedSlugs = new Set<string>()
  const galleryProducts: any[] = []

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
    const matchedSpareParts: typeof spareParts[number][] = []

    // Exact slug match
    const exact = spareMap.get(finalSlug)
    if (exact) matchedSpareParts.push(exact)

    // Match universal spare parts by substring in the Stripe product name or slug
    const lowerProductName = (stripeProduct.name || '').toLowerCase()
    universalSpareParts.forEach(up => {
      const upName = (up.nome || '').toLowerCase()
      const upSlug = slugify(up.nome ?? up.id).toLowerCase()
      if (
        lowerProductName.includes(upName) ||
        finalSlug.toLowerCase().includes(upSlug)
      ) {
        if (!matchedSpareParts.includes(up)) matchedSpareParts.push(up)
      }
    })

    // Build the page context, including spareParts info when available
    const pageContext: any = {
      stripeData,
      presetName,
      preset: presetData
    }
    if (matchedSpareParts.length > 0) {
      pageContext.spareParts = matchedSpareParts
      pageContext.sparePart = matchedSpareParts[0]
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
      spareParts: matchedSpareParts
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
