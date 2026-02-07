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
export type TextPosition = 'Sopra' | 'Sotto'
export type ExtendedTextPosition = TextPosition | 'Centro'

export interface ColorOption {
  name: string
  color: string
}

export interface Module {
  id: string
  sidebarColor: ColorOption
  sidebarText: string
  pageInterior: PageInterior
  isDouble?: boolean
}

// --- Available Options ---
export const formats: AgendaFormat[] = ['A5', 'A6', 'A7']
export const colors: ColorOption[] = [
  { name: 'Rosso', color: '#ff0000' },
  { name: 'Bianco', color: '#ffffff' },
  { name: 'Nero', color: '#000000' },
  { name: 'Giallo', color: '#ffff00' },
  { name: 'Blu', color: '#0000ff' },
  { name: 'Viola', color: '#800080' },
  { name: 'Arancione', color: '#ffa500' },
  { name: 'Grigio', color: '#808080' },
  { name: 'Marrone', color: '#a5522d' }
]

export const fontSizes: FontSize[] = ['Piccolo', 'Medio', 'Grande']
export const textPositions: TextPosition[] = ['Sopra', 'Sotto']
export const extendedTextPositions: ExtendedTextPosition[] = [
  'Sopra',
  'Centro',
  'Sotto'
]

export interface Metadata {
  format: AgendaFormat
  frontCover: {
    color: ColorOption
    collection: Collection
    template: CoverImageTemplate
    text: string
    fontSize: FontSize
    position: ExtendedTextPosition
    textColor: ColorOption
  }
  modules: Module[]
  backCover: {
    color: ColorOption
    text: string
    fontSize: FontSize
    position: TextPosition
    textColor: ColorOption
  }
  lastUpdated: string
  currentStep: number
}

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

export const presets: Record<string, Metadata> = {
  Blank: {
    format: 'A5' as AgendaFormat,
    frontCover: {
      color: colors[1],
      collection: 'Triadic' as Collection,
      template: 'None' as TriadicTemplate,
      text: '',
      fontSize: 'Medio' as FontSize,
      position: 'Sotto' as ExtendedTextPosition,
      textColor: colors[2]
    },
    modules: [],
    backCover: {
      color: colors[1],
      text: '',
      fontSize: 'Medio' as FontSize,
      position: 'Sotto' as TextPosition,
      textColor: colors[2]
    },
    lastUpdated: new Date().toISOString(),
    currentStep: 0
  },
  Punto: {
    format: 'A5' as AgendaFormat,
    frontCover: {
      color: colors[1],
      collection: 'Triadic' as Collection,
      template: 'Punto' as TriadicTemplate,
      text: '',
      fontSize: 'Medio' as FontSize,
      position: 'Sotto' as ExtendedTextPosition,
      textColor: colors[2]
    },
    modules: [
      {
        id: 'mod1',
        sidebarColor: colors[2],
        sidebarText: 'Idee',
        pageInterior: 'Righe'
      },
      {
        id: 'mod2',
        sidebarColor: colors[2],
        sidebarText: 'Progetti',
        pageInterior: 'Punti',
        isDouble: true
      }
    ],
    backCover: {
      color: colors[1],
      text: '',
      fontSize: 'Grande' as FontSize,
      position: 'Sotto' as TextPosition,
      textColor: colors[2]
    },
    lastUpdated: new Date().toISOString(),
    currentStep: 0
  },
  minimal: {
    format: 'A6' as AgendaFormat,
    frontCover: {
      color: colors[4],
      collection: 'Triadic' as Collection,
      template: 'None' as TriadicTemplate,
      text: 'Eat. Write. Sleep. Repeat.',
      fontSize: 'Medio' as FontSize,
      position: 'Centro' as ExtendedTextPosition,
      textColor: colors[3]
    },
    modules: [],
    backCover: {
      color: colors[4],
      text: 'UUUK AGENDA',
      fontSize: 'Medio' as FontSize,
      position: 'Sotto' as TextPosition,
      textColor: colors[3]
    },
    lastUpdated: new Date().toISOString(),
    currentStep: 0
  }
}

export const getRandomPreset = (): Metadata => {
  const presetKeys = Object.keys(presets)
  const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)]
  return presets[randomKey]
}
