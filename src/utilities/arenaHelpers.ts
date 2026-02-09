import { CSSProperties, useMemo } from 'react'
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
  FontSize,
  ExtendedTextPosition,
  ColorOption,
  Module
} from './arenaSettings'

export const getCoverTemplateImagePath = (
  format: AgendaFormat,
  collection: Collection,
  template: CoverImageTemplate
): string => {
  console.log(template)
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
    case 'Piccolo':
      return 'text-[8px]'
    case 'Medio':
      return 'text-[10px]'
    case 'Grande':
      return 'text-[12px]'
    default:
      return 'text-[10px]'
  }
}

export const getPreviewSizeClasses = ({
  modules,
  format
}: {
  modules: Module[]
  format: AgendaFormat
}) => {
  const baseSpineWidth = 3
  const totalSpineWidthRem = modules.length * baseSpineWidth * 0.35

  switch (format) {
    case 'A7':
      return {
        container: 'w-24 h-36',
        text: 'text-[6px]',
        spineWidthRem: totalSpineWidthRem, //* 0.7,
        coverTextSize: 'text-xs'
      }
    case 'A6':
      return {
        container: 'w-32 h-48',
        text: 'text-[8px]',
        spineWidthRem: totalSpineWidthRem, //* 0.85,
        coverTextSize: 'text-sm'
      }
    case 'A5':
    default:
      return {
        container: 'w-40 h-56',
        text: 'text-[10px]',
        spineWidthRem: totalSpineWidthRem,
        coverTextSize: 'text-base'
      }
  }
}

export const getPreviewTransform = (
  step: string,
  format: AgendaFormat
): CSSProperties => {
  let baseRotation = 'rotateX(10deg)'
  let stepRotation = 'rotateY(-25deg)'

  switch (step) {
    case 'Formato':
    case 'Copertina Anteriore':
    case 'Revisione':
      stepRotation = 'rotateY(-25deg)'
      break
    case 'Sidebars':
      if (format === 'A7') {
        stepRotation = 'rotateY(0deg)'
        baseRotation = 'rotateX(-45deg)'
      } else stepRotation = 'rotateY(80deg)'
      break
    case 'Copertina Posteriore':
      stepRotation = 'rotateY(160deg)'
      break
    default:
      stepRotation = 'rotateY(-25deg)'
  }

  return {
    transform: `${baseRotation} ${stepRotation}`,
    transformStyle: 'preserve-3d'
  }
}
