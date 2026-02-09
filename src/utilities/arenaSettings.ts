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
  lastUpdated?: string
  currentStep: number
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
  'Revisione',
  'Acquista'
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

const triadic = (template: TriadicTemplate): Metadata => ({
  format: 'A5',
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
  frontColor: ColorOption,
  frontTextColor: ColorOption,
  backColor?: ColorOption,
  backTextColor?: ColorOption
): Metadata => ({
  format: 'A5',
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
  ...common
})

export const presets: Record<string, Metadata> = {
  Blank: {
    format: 'A5',
    frontCover: {
      color: getColor('Bianco'),
      collection: 'Custom',
      template: undefined,
      ...noText
    },
    modules: modules,
    backCover: {
      color: getColor('Bianco'),
      ...noText
    },
    ...common
  },
  Punto: triadic('Punto'),
  Flusso: triadic('Flusso'),
  Occhio: triadic('Occhio'),
  '(◣ _ ◢)': mood('(◣ _ ◢)', getColor('Nero'), getColor('Rosso')),
  '(－_－)': mood('(－_－)', getColor('Grigio'), getColor('Bianco')),
  'ヽ⊙_⊙ﾉ': mood('ヽ⊙_⊙ﾉ', getColor('Arancione'), getColor('Nero')),
  '(◕‿◕ )': mood(
    '(◕‿◕ )',
    getColor('Giallo'),
    getColor('Nero'),
    getColor('Blu')
  ),
  '(´◕︵◕`)': mood('(´◕︵◕`)', getColor('Blu'), getColor('Nero')),
  '(●__● )': mood('(●__● )', getColor('Viola'), getColor('Nero')),
  minimal: {
    format: 'A6',
    frontCover: {
      color: colors.find(c => c.name === 'Nero')!,
      collection: 'Custom',
      template: undefined,
      text: 'Eat. Write. Sleep. Repeat.',
      fontSize: 'Medio',
      position: 'Centro',
      textColor: colors.find(c => c.name === 'Arancione')!
    },
    modules: modules,
    backCover: {
      color: colors.find(c => c.name === 'Nero')!,
      text: 'UUUK AGENDA',
      fontSize: 'Medio',
      position: 'Sotto',
      textColor: colors.find(c => c.name === 'Arancione')!
    },
    ...common
  }
}

export const getRandomPreset = (): Metadata => {
  const presetKeys = Object.keys(presets)
  const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)]
  return presets[randomKey]
}

export const getPresetFromKey = (key: string): Metadata => {
  return presets[key] || presets['Punto']
}
