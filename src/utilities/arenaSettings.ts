import { IGatsbyImageData } from 'gatsby-plugin-image'
import { getCoverTemplateImagePath } from './arenaHelpers'

// Define types for customization options
export type AgendaFormat = 'A5' | 'A6' | 'A7'
export type PageInterior = 'Righe' | 'Punti' | 'Vuoto'
export type Collection = 'M(O_O)D' | 'Triadic' | 'Custom'
export type MoodTemplate =
  | '(◣ _ ◢)'
  | '(－_－)'
  | 'ヽ⊙_⊙ﾉ'
  | '(◕‿◕ )'
  | '(´◕︵◕`)'
  | '(●__● )'
export type TriadicTemplate = 'Flusso' | 'Occhio' | 'Punto'
export type CoverImageTemplate = MoodTemplate | TriadicTemplate | undefined

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
  { name: 'Rosso', color: '#d55f5a' },
  { name: 'Bianco', color: '#ffffff' },
  { name: 'Nero', color: '#000000' },
  { name: 'Giallo', color: '#e9e042' },
  { name: 'Blu', color: '#2529a9' },
  { name: 'Viola', color: '#f1c7ff' },
  { name: 'Arancione', color: '#ffc790' },
  { name: 'Grigio', color: '#696765' },
  { name: 'Marrone', color: '#a5522d' }
]

const colorsNamesForMood = ['Nero', 'Viola', 'Arancione', 'Grigio', 'Marrone']

export const colorsMood: ColorOption[] = colors.filter(c =>
  colorsNamesForMood.includes(c.name)
)

export const fontSizes: FontSize[] = ['Piccolo', 'Medio', 'Grande']
export const textPositions: TextPosition[] = ['Sopra', 'Sotto']
export const extendedTextPositions: ExtendedTextPosition[] = [
  'Sopra',
  'Centro',
  'Sotto'
]

interface RawMetadata {
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
  lastUpdated?: string
  currentStep: number
  slug?: string
}

export interface Metadata extends RawMetadata {
  id: number
  name?: string
  priceId?: string
  productId?: string
  price?: number
  image?: IGatsbyImageData | string
}

export interface CartItem extends Metadata {
  quantity: number
  cartId: number
}

export const imageAssets: Record<
  Collection,
  Record<string, Record<string, string>>
> = {
  Custom: {
    A6: {},
    A7: {}
  },
  'M(O_O)D': {
    A6: {
      '(◣ _ ◢)': '',
      '(－_－)': '',
      'ヽ⊙_⊙ﾉ': '',
      '(◕‿◕ )': '',
      '(´◕︵◕`)': '',
      '(●__● )': ''
    },
    A7: {
      '(◣ _ ◢)': '',
      '(－_－)': '',
      'ヽ⊙_⊙ﾉ': '',
      '(◕‿◕ )': '',
      '(´◕︵◕`)': '',
      '(●__● )': ''
    }
  },
  Triadic: {
    A6: {
      Flusso: '/images/collezioni/TRIADIC/Flusso.png',
      Occhio: '/images/collezioni/TRIADIC/Occhio.png',
      Punto: '/images/collezioni/TRIADIC/Punto.png'
    },
    A7: {
      Flusso: '/images/collezioni/TRIADIC/Flusso.png',
      Occhio: '/images/collezioni/TRIADIC/Occhio.png',
      Punto: '/images/collezioni/TRIADIC/Punto.png'
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
  'Revisione'
  // 'Acquista'
]

////// TEMPLATES //////

const getColor = (name: string): ColorOption =>
  colors.find(c => c.name === name)!

const common = {
  lastUpdated: new Date().toISOString(),
  currentStep: 0
}

const modules: Module[] = [
  {
    id: 'mod1',
    sidebarColor: getColor('Bianco'),
    sidebarText: 'Idee',
    pageInterior: 'Righe'
  },
  {
    id: 'mod2',
    sidebarColor: getColor('Bianco'),
    sidebarText: 'Progetti',
    pageInterior: 'Punti',
    isDouble: true
  }
]

const noText = {
  text: '' as const,
  fontSize: 'Medio' as FontSize,
  position: 'Sotto' as TextPosition,
  textColor: getColor('Nero')
}

const triadic = (
  template: TriadicTemplate,
  format: AgendaFormat
): RawMetadata => ({
  format: format,
  frontCover: {
    color: getColor('Bianco'),
    collection: 'Triadic',
    template: template,
    ...noText
  },
  modules: modules,
  backCover: {
    color: getColor('Bianco'),
    ...noText
  },
  ...common
})

const mood = (
  template: MoodTemplate,
  format: AgendaFormat,
  frontColor: ColorOption,
  frontTextColor: ColorOption,
  slug?: string,
  backColor?: ColorOption,
  backTextColor?: ColorOption
): RawMetadata => ({
  format: format,
  frontCover: {
    color: frontColor,
    collection: 'M(O_O)D',
    template: template,
    ...noText,
    textColor: frontTextColor
  },
  modules: modules,
  backCover: {
    color: backColor ?? frontColor,
    ...noText,
    textColor: backTextColor ?? frontTextColor
  },
  slug: slug,
  ...common
})

const rawPresets: Record<string, RawMetadata> = {
  // Blank: {
  //   format: 'A5',
  //   frontCover: {
  //     color: getColor('Bianco'),
  //     collection: 'Custom',
  //     template: undefined,
  //     ...noText
  //   },
  //   modules: modules,
  //   backCover: {
  //     color: getColor('Bianco'),
  //     ...noText
  //   },
  //   ...common
  // },
  'Punto A5': triadic('Punto', 'A5'),
  'Flusso A5': triadic('Flusso', 'A5'),
  'Occhio A5': triadic('Occhio', 'A5'),
  '(◣ _ ◢) A5': mood(
    '(◣ _ ◢)',
    'A5',
    getColor('Nero'),
    getColor('Rosso'),
    'angry A5'
  ),
  '(－_－) A5': mood(
    '(－_－)',
    'A5',
    getColor('Grigio'),
    getColor('Bianco'),
    'bored A5'
  ),
  'ヽ⊙_⊙ﾉ A5': mood(
    'ヽ⊙_⊙ﾉ',
    'A5',
    getColor('Arancione'),
    getColor('Nero'),
    'shocked A5'
  ),
  '(◕‿◕ ) A5': mood(
    '(◕‿◕ )',
    'A5',
    getColor('Giallo'),
    getColor('Nero'),
    'happy A5',
    getColor('Blu')
  ),
  '(´◕︵◕`) A5': mood(
    '(´◕︵◕`)',
    'A5',
    getColor('Blu'),
    getColor('Nero'),
    'sad A5'
  ),
  '(●__● ) A5': mood(
    '(●__● )',
    'A5',
    getColor('Viola'),
    getColor('Nero'),
    'neutral A5'
  ),

  'Punto A6': triadic('Punto', 'A6'),
  'Flusso A6': triadic('Flusso', 'A6'),
  'Occhio A6': triadic('Occhio', 'A6'),
  '(◣ _ ◢) A6': mood(
    '(◣ _ ◢)',
    'A6',
    getColor('Nero'),
    getColor('Rosso'),
    'angry A6'
  ),
  '(－_－) A6': mood(
    '(－_－)',
    'A6',
    getColor('Grigio'),
    getColor('Bianco'),
    'bored A6'
  ),
  'ヽ⊙_⊙ﾉ A6': mood(
    'ヽ⊙_⊙ﾉ',
    'A6',
    getColor('Arancione'),
    getColor('Nero'),
    'shocked A6'
  ),
  '(◕‿◕ ) A6': mood(
    '(◕‿◕ )',
    'A6',
    getColor('Giallo'),
    getColor('Nero'),
    'happy A6',
    getColor('Blu')
  ),
  '(´◕︵◕`) A6': mood(
    '(´◕︵◕`)',
    'A6',
    getColor('Blu'),
    getColor('Nero'),
    'sad A6'
  ),
  '(●__● ) A6': mood(
    '(●__● )',
    'A6',
    getColor('Viola'),
    getColor('Nero'),
    'neutral A6'
  ),

  'Punto A7': triadic('Punto', 'A7'),
  'Flusso A7': triadic('Flusso', 'A7'),
  'Occhio A7': triadic('Occhio', 'A7'),
  '(◣ _ ◢) A7': mood(
    '(◣ _ ◢)',
    'A7',
    getColor('Nero'),
    getColor('Rosso'),
    'angry A7'
  ),
  '(－_－) A7': mood(
    '(－_－)',
    'A7',
    getColor('Grigio'),
    getColor('Bianco'),
    'bored A7'
  ),
  'ヽ⊙_⊙ﾉ A7': mood(
    'ヽ⊙_⊙ﾉ',
    'A7',
    getColor('Arancione'),
    getColor('Nero'),
    'shocked A7'
  ),
  '(◕‿◕ ) A7': mood(
    '(◕‿◕ )',
    'A7',
    getColor('Giallo'),
    getColor('Nero'),
    'happy A7',
    getColor('Blu')
  ),
  '(´◕︵◕`) A7': mood(
    '(´◕︵◕`)',
    'A7',
    getColor('Blu'),
    getColor('Nero'),
    'sad A7'
  ),
  '(●__● ) A7': mood(
    '(●__● )',
    'A7',
    getColor('Viola'),
    getColor('Nero'),
    'neutral A7'
  ),

  Custom: {
    format: 'A6',
    frontCover: {
      color: colors.find(c => c.name === 'Nero')!,
      collection: 'Custom',
      template: undefined,
      text: 'La tua scritta',
      fontSize: 'Medio',
      position: 'Centro',
      textColor: colors.find(c => c.name === 'Arancione')!
    },
    modules: modules,
    backCover: {
      color: colors.find(c => c.name === 'Nero')!,
      text: 'La tua scritta',
      fontSize: 'Medio',
      position: 'Sotto',
      textColor: colors.find(c => c.name === 'Arancione')!
    },
    ...common
  }
}

// Export presets with id for each that are increasing numbers like 0, 1, 2, 3, ...
export const presets: Record<string, Metadata> = Object.fromEntries(
  Object.entries(rawPresets).map(([key, value], index) => [
    key,
    {
      ...value,
      id: index
    }
  ])
)

export const getRandomPreset = (): Metadata => {
  const presetKeys = Object.keys(presets)
  const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)]
  return presets[randomKey]
}

export const getPresetFromKey = (key: string): Metadata => {
  return presets[key] || presets['Punto']
}

export const getPresetFromId = (id: number): Metadata => {
  const preset = Object.values(presets).find(p => p.id === id)
  return preset || presets['Punto']
}

export const getPresetImageFromId = (id: number): IGatsbyImageData | string => {
  const preset = getPresetFromId(id)
  // return preset.image
  //   ? preset.image
  //   :

  return getCoverTemplateImagePath(
    preset.format,
    preset.frontCover.collection,
    preset.frontCover.template
  )
}
