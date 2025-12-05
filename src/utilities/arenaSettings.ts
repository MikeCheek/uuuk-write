// Define types for customization options
export type AgendaFormat = 'A5' | 'A6' | 'A7'
export type PageInterior = 'Lined' | 'Dotted' | 'Blank'
export type Collection = 'M(O_O)D' | 'Triadic'
export type MoodTemplate =
  | 'Angry'
  | 'Bored'
  | 'Excited'
  | 'Happy'
  | 'Sad'
  | 'Shock'
  | 'None'
export type TriadicTemplate = 'Flusso' | 'Occhio' | 'Punto' | 'None'
export type CoverImageTemplate = MoodTemplate | TriadicTemplate

// --- NEW TEXT CUSTOMIZATION TYPES ---
export type FontSize = 'Small' | 'Medium' | 'Large'
export type TextPosition = 'Top' | 'Center' | 'Bottom'

export interface ColorOption {
  name: string
  class: string
  textClass: string
}

export interface Module {
  id: string
  sidebarColor: ColorOption
  sidebarText: string
  pageInterior: PageInterior
}

// --- Available Options ---
export const formats: AgendaFormat[] = ['A5', 'A6', 'A7']
export const colors: ColorOption[] = [
  { name: 'White', class: 'bg-white', textClass: 'text-white' },
  { name: 'Sky', class: 'bg-sky-500', textClass: 'text-sky-500' },
  { name: 'Red', class: 'bg-red', textClass: 'text-red' },
  { name: 'Emerald', class: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { name: 'Beige', class: 'bg-beige', textClass: 'text-beige' },
  { name: 'Black', class: 'bg-black', textClass: 'text-white' }
]

export const fontSizes: FontSize[] = ['Small', 'Medium', 'Large']
export const textPositions: TextPosition[] = ['Top', 'Center', 'Bottom']

export const imageAssets = {
  'M(O_O)D': {
    A6: {
      Angry: '/images/collezioni/M(O_O)D/A6/Angry.png',
      Bored: '/images/collezioni/M(O_O)D/A6/Bored.png',
      Excited: '/images/collezioni/M(O_O)D/A6/Excited.png',
      Happy: '/images/collezioni/M(O_O)D/A6/Happy.png',
      Sad: '/images/collezioni/M(O_O)D/A6/Sad.png',
      Shock: '/images/collezioni/M(O_O)D/A6/Shock.png',
      None: ''
    },
    A7: {
      Angry: '/images/collezioni/M(O_O)D/A7/Angry.png',
      Bored: '/images/collezioni/M(O_O)D/A7/Bored.png',
      Excited: '/images/collezioni/M(O_O)D/A7/Excited.png',
      Happy: '/images/collezioni/M(O_O)D/A7/Happy.png',
      Sad: '/images/collezioni/M(O_O)D/A7/Sad.png',
      Shock: '/images/collezioni/M(O_O)D/A7/Shock.png',
      None: ''
    }
  },
  Triadic: {
    A6: {
      Flusso: '/images/collezioni/Triadic/Flusso.png',
      Occhio: '/images/collezioni/Triadic/Occhio.png',
      Punto: '/images/collezioni/Triadic/Punto.png',
      None: ''
    },
    A7: {
      Flusso: '/images/collezioni/Triadic/Flusso.png',
      Occhio: '/images/collezioni/Triadic/Occhio.png',
      Punto: '/images/collezioni/Triadic/Punto.png',
      None: ''
    }
  }
}

export const pageInteriors: PageInterior[] = ['Lined', 'Dotted', 'Blank']
export const collections: Collection[] = imageAssets
  ? (Object.keys(imageAssets).reverse() as Collection[])
  : []
export const moodTemplates: MoodTemplate[] = imageAssets
  ? (Object.keys(imageAssets['M(O_O)D']['A6']) as MoodTemplate[])
  : []
export const triadicTemplates: TriadicTemplate[] = imageAssets
  ? (Object.keys(imageAssets['Triadic']['A6']) as TriadicTemplate[])
  : []

export const MAX_MODULES = 3

export const steps = [
  'Format',
  'Front Cover',
  'Modules',
  'Back Cover',
  'Review',
  'Buy'
]
