// Define types for customization options
export type AgendaFormat = 'A5' | 'A6' | 'A7'
export type PageInterior = 'Righe' | 'Punti' | 'Vuoto'
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
export type FontSize = 'Piccolo' | 'Medio' | 'Grande'
export type TextPosition = 'Sopra' | 'Centro' | 'Sotto'

export interface ColorOption {
  name: string
  color: string
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
  { name: 'Bianco', color: '#ffffff' },
  { name: 'Azzurro', color: '#87ceeb' },
  { name: 'Rosso', color: '#ff6961' },
  { name: 'Smeraldo', color: '#50c878' },
  { name: 'Beige', color: '#ecddbe' },
  { name: 'Nero', color: '#1a1615' }
]

export const fontSizes: FontSize[] = ['Piccolo', 'Medio', 'Grande']
export const textPositions: TextPosition[] = ['Sopra', 'Centro', 'Sotto']

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
      Flusso: '/images/collezioni/TRIADIC/Flusso.png',
      Occhio: '/images/collezioni/TRIADIC/Occhio.png',
      Punto: '/images/collezioni/TRIADIC/Punto.png',
      None: ''
    },
    A7: {
      Flusso: '/images/collezioni/TRIADIC/Flusso.png',
      Occhio: '/images/collezioni/TRIADIC/Occhio.png',
      Punto: '/images/collezioni/TRIADIC/Punto.png',
      None: ''
    }
  }
}

export const pageInteriors: PageInterior[] = ['Righe', 'Punti', 'Vuoto']
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
  'Formato',
  'Copertina Anteriore',
  'Sidebars',
  'Copertina Posteriore',
  'Revisione',
  'Acquista'
]
