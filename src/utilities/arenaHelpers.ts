import {
  AgendaFormat,
  Collection,
  CoverImageTemplate,
  imageAssets,
  moodTemplates,
  triadicTemplates,
  TextPosition,
  FontSize,
  ExtendedTextPosition
} from './arenaSettings'

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
