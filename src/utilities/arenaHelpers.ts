import {
  AgendaFormat,
  Collection,
  CoverImageTemplate,
  imageAssets,
  moodTemplates,
  triadicTemplates,
  TextPosition,
  FontSize,
  ExtendedTextPosition,
  presets,
  Metadata
} from './arenaSettings'
import { StripeProduct } from './stripeHelper'

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()

export const getCoverTemplateImagePath = (
  format: AgendaFormat,
  collection: Collection,
  template: CoverImageTemplate
): string => {
  if (template === undefined) return ''

  const formatFolder = format === 'A5' ? 'A6' : format // A5 uses A6 folder structure

  try {
    return imageAssets[collection][formatFolder][template]
  } catch (e) {
    console.error(
      `Image not found for: ${collection}/${formatFolder}/${template}`
    )
    return ''
  }
}

export const getTemplatesForCollection = (
  collection: Collection
): CoverImageTemplate[] => {
  if (collection === 'M(O_O)D') return moodTemplates
  if (collection === 'Triadic') return triadicTemplates
  return [] // Should not happen
}

// --- Helper for Text Position Classes ---
export const getPositionClasses = (
  position: TextPosition | ExtendedTextPosition
): string => {
  switch (position) {
    case 'Sopra':
      return 'items-start justify-center p-4'
    case 'Centro':
      return 'items-center justify-center p-2'
    case 'Sotto':
      return 'items-end justify-center p-4'
    default:
      return 'items-center justify-center p-2'
  }
}

// --- Helper for Font Size Classes ---
export const getFontSizeClass = (size: FontSize): string => {
  switch (size) {
    case 'Medio':
      return 'text-[10px]'
    case 'Grande':
      return 'text-[12px]'
    default:
      return 'text-[10px]'
  }
}

// --- Enrich Stripe Product with Preset Data ---
export const enrichProductWithPreset = (
  stripeProduct: StripeProduct
): {
  stripeData: StripeProduct
  presetName: string | null
  preset: Metadata | null
} => {
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

  return {
    stripeData: stripeProduct,
    presetName,
    preset: presetData
  }
}
