import {
  AgendaFormat,
  Collection,
  CoverImageTemplate,
  MoodTemplate,
  imageAssets,
  TriadicTemplate,
  moodTemplates,
  triadicTemplates,
  TextPosition,
  FontSize
} from './arenaSettings'

export const getCoverTemplateImagePath = (
  format: AgendaFormat,
  collection: Collection,
  template: CoverImageTemplate
): string => {
  if (template === 'None') return ''

  const formatFolder = format === 'A5' ? 'A6' : format // A5 uses A6 folder structure

  try {
    // Narrow by collection so TypeScript knows which template union is valid
    if (collection === 'M(O_O)D') {
      const key = template as MoodTemplate
      const assets = imageAssets['M(O_O)D'] as Record<
        string,
        Record<MoodTemplate | 'None', string>
      >
      return assets[formatFolder][key]
    } else {
      const key = template as TriadicTemplate
      const assets = imageAssets['Triadic'] as Record<
        string,
        Record<TriadicTemplate | 'None', string>
      >
      return assets[formatFolder][key]
    }
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
export const getPositionClasses = (position: TextPosition): string => {
  switch (position) {
    case 'Top':
      return 'items-start justify-center p-4'
    case 'Center':
      return 'items-center justify-center p-2'
    case 'Bottom':
      return 'items-end justify-center p-4'
    default:
      return 'items-center justify-center p-2'
  }
}

// --- Helper for Font Size Classes ---
export const getFontSizeClass = (size: FontSize): string => {
  switch (size) {
    case 'Small':
      return 'text-[6px]'
    case 'Medium':
      return 'text-[8px]'
    case 'Large':
      return 'text-[10px]'
    default:
      return 'text-[10px]'
  }
}
