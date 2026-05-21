import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Metadata, presets } from '../../utilities/arenaSettings'
import { Link } from 'gatsby'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import Switch from './Switch'
import Preview3DWrapper from './Preview3DWrapper'
import { StripeProduct } from '../../utilities/stripeHelper'
import { getCoverTemplateImagePath, slugify } from '../../utilities/arenaHelpers'
import { useCart } from '../../utilities/cartContext'
import { PlusIcon, ShoppingCartIcon, SlidersHorizontal, X } from 'lucide-react'
import NoImagePlaceholder from '../atoms/NoImagePlaceholder'
import { HOTPICKS } from '../../utilities/arenaSettings'
import SparePartImageSlider from './SparePartImageSlider'

const HOTPICK_PARTICLES = [
  { x: 15, y: 100, tx: -18, ty: -55, type: 'spark' },
  { x: 42, y: 102, tx: 6, ty: -70, type: 'flame' },
  { x: 68, y: 100, tx: 14, ty: -60, type: 'spark' },
  { x: 88, y: 98, tx: 22, ty: -50, type: 'spark' },
  { x: -2, y: 75, tx: -50, ty: -30, type: 'flame' },
  { x: -3, y: 50, tx: -45, ty: -45, type: 'spark' },
  { x: -1, y: 25, tx: -35, ty: -55, type: 'spark' },
  { x: 102, y: 72, tx: 50, ty: -28, type: 'flame' },
  { x: 103, y: 44, tx: 42, ty: -50, type: 'spark' },
  { x: 101, y: 18, tx: 30, ty: -60, type: 'spark' },
  { x: 25, y: -2, tx: -20, ty: -55, type: 'flame' },
  { x: 56, y: -3, tx: 4, ty: -60, type: 'spark' },
  { x: 80, y: -1, tx: 18, ty: -50, type: 'spark' },
  { x: 8, y: 8, tx: -28, ty: -45, type: 'flame' },
] as const

const SPARK_COLORS = ['#ffd54f', '#ffab40', '#ff8a00', '#fff176', '#ffe082']
const FLAME_STOPS = [
  ['#ff3d00', '#ff6d00'],
  ['#ff6a00', '#ffab40'],
  ['#e64a19', '#ffd54f'],
]

// ---------------------------------------------------------------------------
// FilterPanel — shared content rendered in both sidebar and mobile overlay
// ---------------------------------------------------------------------------
interface FilterPanelProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  productType: 'all' | 'agenda' | 'spare'
  handleProductTypeSelect: (v: 'all' | 'agenda' | 'spare') => void
  selectedCollection: string
  handleCollectionSelect: (v: string) => void
  selectedFormat: string
  handleFormatSelect: (v: string) => void
  selectedTemplate: string
  handleTemplateSelect: (v: string) => void
  dynamicFilterOptions: { collections: string[]; formats: string[]; templates: string[] }
  resetAllFilters: () => void
  hasActiveFilters: boolean
}

const FilterPanel = ({
  searchTerm, setSearchTerm,
  productType, handleProductTypeSelect,
  selectedCollection, handleCollectionSelect,
  selectedFormat, handleFormatSelect,
  selectedTemplate, handleTemplateSelect,
  dynamicFilterOptions,
  resetAllFilters,
  hasActiveFilters,
}: FilterPanelProps) => (
  <div className="flex flex-col gap-5 p-4 overflow-y-auto h-full">
    {/* Search */}
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Cerca</p>
      <input
        type="text"
        placeholder="Cerca..."
        className="w-full uuuk-input rounded-xl px-3 py-2 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Tipo */}
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Tipo</p>
      <div className="flex flex-col gap-1.5">
        {(['all', 'agenda', 'spare'] as const).map((type) => (
          <button
            key={type}
            onClick={() => handleProductTypeSelect(type)}
            className={`text-xs font-medium px-3 py-2 rounded-lg text-left transition-all ${productType === type
              ? 'bg-[#f97316] text-white shadow-sm'
              : 'bg-white/5 text-[#e5e7eb] hover:bg-white/10'
              }`}
          >
            {type === 'all' ? 'Tutti' : type === 'agenda' ? 'Agende' : 'Ricambi'}
          </button>
        ))}
      </div>
    </div>

    {/* Collezione */}
    {dynamicFilterOptions.collections.length > 0 && (
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Collezione</p>
        <div className="flex flex-col gap-1.5">
          {dynamicFilterOptions.collections.map((c) => (
            <button
              key={c}
              onClick={() => handleCollectionSelect(c)}
              className={`text-xs font-medium px-3 py-2 rounded-lg text-left transition-all ${selectedCollection === c
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white/5 text-[#e5e7eb] hover:bg-white/10'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Formato */}
    {dynamicFilterOptions.formats.length > 0 && (
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Formato</p>
        <div className="flex flex-wrap gap-1.5">
          {dynamicFilterOptions.formats.map((f) => (
            <button
              key={f}
              onClick={() => handleFormatSelect(f)}
              className={`text-xs font-medium px-3 py-2 rounded-lg transition-all ${selectedFormat === f
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white/5 text-[#e5e7eb] hover:bg-white/10'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Template */}
    {dynamicFilterOptions.templates.length > 0 && (
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Template</p>
        <div className="flex flex-col gap-1.5">
          {dynamicFilterOptions.templates.map((t) => (
            <button
              key={t}
              onClick={() => handleTemplateSelect(t)}
              className={`text-xs font-medium px-3 py-2 rounded-lg text-left transition-all ${selectedTemplate === t
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white/5 text-[#e5e7eb] hover:bg-white/10'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Reset */}
    {hasActiveFilters && (
      <button
        onClick={resetAllFilters}
        className="mt-auto text-xs font-medium text-[#8ea2d0] hover:text-[#ffb170] underline underline-offset-2 text-left transition-colors"
      >
        Ripristina filtri
      </button>
    )}
  </div>
)

// ---------------------------------------------------------------------------
// TemplateItem
// ---------------------------------------------------------------------------
const TemplateItem = ({
  name,
  preset,
  image,
  index,
  productData,
}: {
  name: string
  preset: Metadata
  image?: IGatsbyImageData
  index: number
  productData?: StripeProduct | null
}) => {
  const [mode, setMode] = useState<'flat' | '3D'>('flat')
  const { addToCart } = useCart()
  const isHotpick = HOTPICKS.includes(name)

  const formattedPrice = useMemo(() => {
    if (!productData?.default_price || !productData.default_price.unit_amount) return null
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: productData.default_price.currency.toUpperCase(),
    }).format(productData.default_price.unit_amount / 100)
  }, [productData])

  return (
    <div className="relative">
      {isHotpick && (
        <div
          className="pointer-events-none absolute inset-0 z-1 animate-fadeIn opacity-50"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {HOTPICK_PARTICLES.map((p, i) => {
            const dur = `${1.4 + (i % 5) * 0.22}s`
            const delay = `${(i * 0.17) % 2.2}s`
            const left = `${p.x}%`
            const top = `${p.y}%`

            if (p.type === 'spark') {
              const color = SPARK_COLORS[i % SPARK_COLORS.length]
              const size = 4 + (i % 3)
              return (
                <span
                  key={i}
                  className="absolute rounded-full animate-sparkFly"
                  style={{
                    left, top, width: size, height: size,
                    background: color,
                    boxShadow: `0 0 6px 2px ${color}88`,
                    '--dur': dur, '--delay': delay,
                    '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                  } as React.CSSProperties}
                />
              )
            }

            const [c1, c2] = FLAME_STOPS[i % FLAME_STOPS.length]
            const scale = 0.6 + (i % 3) * 0.15
            const fw = Math.round(18 * scale), fh = Math.round(34 * scale)
            return (
              <span
                key={i}
                className="absolute animate-flameFly"
                style={{
                  left, top, width: fw, height: fh,
                  '--dur': dur, '--delay': delay,
                  '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                  '--rot': `${(i % 2 === 0 ? 1 : -1) * 12}deg`,
                } as React.CSSProperties}
              >
                <svg viewBox="0 0 40 80" width={fw} height={fh}>
                  <defs>
                    <linearGradient id={`hpfg${i}`} x1="0.5" y1="1" x2="0.5" y2="0">
                      <stop offset="0%" stopColor={c1} />
                      <stop offset="60%" stopColor={c2} />
                      <stop offset="100%" stopColor="#fff9c4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 80 C8 60 2 48 10 28 C14 16 12 6 20 0 C22 12 30 14 28 30 C26 42 34 52 32 60 C30 70 26 77 20 80Z"
                    fill={`url(#hpfg${i})`}
                  />
                </svg>
              </span>
            )
          })}
        </div>
      )}

      <div
        className="uuuk-surface h-full relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-4 pt-16 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-[0_18px_40px_rgba(6,10,20,0.5)] animate-fadeIn"
        style={{
          animationDelay: `${index * 0.1}s`,
          boxShadow: isHotpick
            ? '0 0 18px rgba(255, 122, 0, 0.35), 0 0 42px rgba(255, 61, 0, 0.18)'
            : undefined,
        }}
      >
        <div className="absolute left-0 top-0 z-10 rounded-br-xl border-b border-r border-[#f97316]/40 bg-gradient-to-br from-[#f97316] to-[#ff9d57] px-4 py-2 text-[#1f2937] shadow-lg">
          <div className="text-sm font-bold tracking-wide">{name}</div>
          <div className="text-xs opacity-90 capitalize">{preset.frontCover.collection}</div>
        </div>

        {image ? (
          <div className="absolute top-2 right-2 z-10">
            <Switch isOn={mode === '3D'} toggleSwitch={() => setMode(mode === 'flat' ? '3D' : 'flat')} />
          </div>
        ) : null}

        {mode === '3D' || !image ? (
          <Preview3DWrapper product={preset} noExtra />
        ) : (
          <GatsbyImage
            image={image}
            alt={`${preset.frontCover.collection} ${preset.format} template`}
            className={`h-auto object-cover rounded-md ${preset.format === 'A5' ? 'w-44' :
              preset.format === 'A6' ? 'w-40' :
                preset.format === 'A7' ? 'w-32' : 'w-44'
              }`}
          />
        )}

        <div className="w-full flex justify-center -mb-4 z-10">
          {formattedPrice ? (
            <span className="rounded border border-[#37b87d]/40 bg-[#37b87d]/15 px-2.5 py-0.5 text-xs font-bold text-[#8fe7be]">
              {formattedPrice}
            </span>
          ) : (
            <span className="h-5 w-16 animate-pulse rounded bg-white/10" />
          )}
        </div>

        <div className="flex flex-row gap-2 items-end justify-center w-full mt-auto pt-6">
          <Link
            to={`/prodotto/${slugify(preset?.slug ?? name)}`}
            className="uuuk-btn-primary !px-4 !py-2 !text-xs"
          >
            Vedi prodotto
          </Link>
          <button
            onClick={() =>
              addToCart({
                ...preset,
                productId: productData?.id,
                priceId: productData?.default_price.id,
                price: Number(productData?.default_price.unit_amount_decimal) / 100,
                image: image
                  ? image
                  : preset.frontCover.template
                    ? getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)
                    : undefined,
                name,
              })
            }
            className="uuuk-btn-secondary relative flex items-center gap-1 !px-3 !py-2 !text-xs"
          >
            <ShoppingCartIcon className="inline-block mr-1" size={16} />
            <PlusIcon className="inline-block absolute top-px right-px" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SpareCard — extracted to avoid duplication
// ---------------------------------------------------------------------------
const SpareCard = ({
  entry,
  globalIndex,
  addToCart,
}: {
  entry: any
  globalIndex: number
  addToCart: (item: any) => void
}) => {
  const sparePart = entry.spareParts?.[0]
  return (
    <div
      key={`spare-${sparePart?.id || globalIndex}`}
      className="uuuk-surface h-full relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-4 pt-16 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-[0_18px_40px_rgba(6,10,20,0.5)] animate-fadeIn"
      style={{ animationDelay: `${globalIndex * 0.1}s` }}
    >
      <div className="absolute left-0 top-0 z-10 rounded-br-xl border-b border-r border-[#f97316]/40 bg-gradient-to-br from-[#f97316] to-[#ff9d57] px-4 py-2 text-[#1f2937] shadow-lg">
        <div className="text-sm font-bold tracking-wide">{sparePart?.nome || entry.stripeData?.name}</div>
        <div className="text-xs opacity-90">Ricambio</div>
      </div>

      {sparePart?.images?.length ? (
        <SparePartImageSlider
          images={sparePart.images}
          alt={sparePart?.nome || 'Ricambio'}
          className="w-44 h-44"
          imageClassName="rounded-md"
          arrowsClassName="h-8 w-8"
        />
      ) : entry.stripeData?.images?.[0] ? (
        <img
          src={entry.stripeData.images[0]}
          alt={sparePart?.nome || 'Ricambio'}
          className="w-44 h-auto object-cover rounded-md"
        />
      ) : (
        <NoImagePlaceholder size="lg" />
      )}

      <div className="w-full flex justify-center -mb-4 z-10">
        {entry.stripeData?.default_price?.unit_amount ? (
          <span className="rounded border border-[#37b87d]/40 bg-[#37b87d]/15 px-2.5 py-0.5 text-xs font-bold text-[#8fe7be]">
            {new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: entry.stripeData.default_price.currency.toUpperCase(),
            }).format(entry.stripeData.default_price.unit_amount / 100)}
          </span>
        ) : (
          <span className="h-5 w-16 animate-pulse rounded bg-white/10" />
        )}
      </div>

      <div className="flex flex-row gap-2 items-end justify-center w-full mt-auto pt-6">
        <Link to={`/prodotto/${entry.slug}`} className="uuuk-btn-primary !px-4 !py-2 !text-xs">
          Vedi prodotto
        </Link>
        <button
          onClick={() =>
            addToCart({
              ...sparePart,
              productId: entry.stripeData?.id,
              priceId: entry.stripeData?.default_price?.id,
              price: entry.stripeData?.default_price?.unit_amount
                ? Number(entry.stripeData.default_price.unit_amount) / 100
                : 0,
              image: entry.stripeData?.images?.[0],
              name: sparePart?.nome || entry.stripeData?.name,
              id: sparePart?.id || entry.stripeData?.id,
              productType: 'spare',
              sparePart,
            })
          }
          className="uuuk-btn-secondary relative flex items-center gap-1 !px-3 !py-2 !text-xs"
        >
          <ShoppingCartIcon className="inline-block mr-1" size={16} />
          <PlusIcon className="inline-block absolute top-px right-px" size={16} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TemplateGallery
// ---------------------------------------------------------------------------
interface TemplateGalleryProps {
  serverProducts?: any[]
}

const TemplateGallery = ({ serverProducts }: TemplateGalleryProps) => {
  // --- Filter state ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [productType, setProductType] = useState<'all' | 'agenda' | 'spare'>('all')

  // --- Sidebar state ---
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setMobileOpen(false)
    }
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close mobile sidebar on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = mobileOpen ? 'hidden' : ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, isMobile])

  const { addToCart } = useCart()

  const resetAllFilters = () => {
    setSearchTerm('')
    setSelectedCollection('')
    setSelectedFormat('')
    setSelectedTemplate('')
    setProductType('all')
  }

  const hasActiveFilters =
    !!searchTerm || !!selectedCollection || !!selectedFormat || !!selectedTemplate || productType !== 'all'

  const getCollectionForTemplate = (template: string) => {
    const foundPreset = Object.values(presets).find((p) => p.frontCover.template === template)
    return foundPreset?.frontCover.collection ?? ''
  }

  const handleCollectionSelect = (collection: string) => {
    if (selectedCollection === collection) {
      setSelectedCollection('')
      setSelectedFormat('')
      setSelectedTemplate('')
      setProductType('all')
      return
    }
    setSelectedCollection(collection)
    setSelectedFormat('')
    setSelectedTemplate('')
    setProductType('agenda')
  }

  const handleFormatSelect = (format: string) => {
    if (selectedFormat === format) {
      setSelectedFormat('')
      setSelectedTemplate('')
      return
    }
    setSelectedFormat(format)
    setSelectedTemplate('')
    setProductType('agenda')
  }

  const handleTemplateSelect = (template: string) => {
    if (selectedTemplate === template) {
      setSelectedTemplate('')
      setSelectedCollection('')
      setSelectedFormat('')
      setProductType('all')
      return
    }
    const collection = getCollectionForTemplate(template)
    setSelectedTemplate(template)
    if (collection) setSelectedCollection(collection)
    setSelectedFormat('')
    setProductType('agenda')
  }

  const handleProductTypeSelect = (nextType: 'all' | 'agenda' | 'spare') => {
    setProductType(nextType)
    if (nextType === 'spare') {
      setSelectedCollection('')
      setSelectedFormat('')
      setSelectedTemplate('')
    }
  }

  const getProductData = (preset: Metadata) => {
    if (!serverProducts || !serverProducts.length) return null
    const searchName = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`
    const foundEntry =
      serverProducts.find((entry: any) => {
        const candidate =
          (entry && typeof entry.name === 'string' && entry.name) ||
          (entry?.stripeProduct && typeof entry.stripeProduct.name === 'string' && entry.stripeProduct.name) ||
          (entry?.stripeData && typeof entry.stripeData.name === 'string' && entry.stripeData.name) ||
          null
        if (!candidate) return false
        return candidate.trim().toLowerCase() === searchName.trim().toLowerCase()
      }) || null
    if (!foundEntry) return null
    return (foundEntry.stripeProduct ?? foundEntry) as StripeProduct | null
  }

  const rawData = useStaticQuery(graphql`
    query {
      allFile(
        filter: {
          extension: { regex: "/(jpg|jpeg|png)/" }
          relativePath: { regex: "/collezioni\\//" }
        }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED layout: CONSTRAINED)
            }
            relativePath
            name
          }
        }
      }
    }
  `)

  const parseCollectionAndFormat = (relativePath: string) => {
    const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
    const parts = normalized.split('/').filter(Boolean)
    if (parts.length < 4 || parts[0].toLowerCase() !== 'collezioni') return { collection: '', format: '' }
    return { collection: parts[1], format: parts[2] }
  }

  const processedData = useMemo(() => {
    const edges = [...rawData.allFile.edges]
    const modEdges = edges.map((e: any) => {
      const { collection, format } = parseCollectionAndFormat(e.node.relativePath)
      return { ...e, collection, format }
    })
    const additional = modEdges
      .filter((e: any) => (e.format || '').toUpperCase() === 'A6')
      .map((e: any) => ({ ...e, format: 'A5' }))
    modEdges.push(...additional)
    modEdges.sort((a: any, b: any) => {
      if (a.format !== b.format) return a.format.localeCompare(b.format)
      if (a.collection !== b.collection) return a.collection.localeCompare(b.collection)
      return a.node.name.localeCompare(b.node.name)
    })
    return modEdges
  }, [rawData])

  const filterOptions = useMemo(() => {
    const formats = new Set<string>()
    const collections = new Set<string>()
    const templates = new Set<string>()
    Object.values(presets).forEach((preset) => {
      if (preset.format) formats.add(preset.format)
      if (preset.frontCover.collection) collections.add(preset.frontCover.collection)
      if (preset.frontCover.template) templates.add(preset.frontCover.template)
    })
    return {
      formats: Array.from(formats).sort(),
      collections: Array.from(collections).sort(),
      templates: Array.from(templates).sort(),
    }
  }, [])

  const dynamicFilterOptions = useMemo(() => {
    if (productType === 'spare') return { collections: [], formats: [], templates: [] }

    const effectiveCollection = selectedCollection || (selectedTemplate ? getCollectionForTemplate(selectedTemplate) : '')

    const availableCollections = filterOptions.collections.filter((collection) => {
      if (!selectedTemplate) return true
      return collection === effectiveCollection
    })

    let availableFormats = filterOptions.formats
    if (effectiveCollection) {
      const formatsInCollection = new Set<string>()
      Object.values(presets).forEach((preset) => {
        if (preset.frontCover.collection === effectiveCollection) formatsInCollection.add(preset.format)
      })
      availableFormats = Array.from(formatsInCollection).sort()
    }

    const availableTemplates = filterOptions.templates.filter((template) => {
      const templateCollection = getCollectionForTemplate(template)
      if (effectiveCollection && templateCollection !== effectiveCollection) return false
      if (selectedFormat) {
        return Object.values(presets).some(
          (preset) => preset.frontCover.template === template && preset.format === selectedFormat
        )
      }
      return true
    })

    return { collections: availableCollections, formats: availableFormats, templates: availableTemplates }
  }, [selectedCollection, selectedFormat, selectedTemplate, productType])

  const filteredPresets = useMemo(() => {
    return Object.entries(presets)
      .filter(([key, preset]) => {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
          key.toLowerCase().includes(searchLower) ||
          preset.frontCover.collection.toLowerCase().includes(searchLower) ||
          preset.frontCover.template?.toLowerCase().includes(searchLower) ||
          preset.format.toLowerCase().includes(searchLower) ||
          preset.frontCover.collection.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().includes(searchLower)

        const effectiveCollection =
          selectedCollection || (selectedTemplate ? getCollectionForTemplate(selectedTemplate) : '')
        const matchesCollectionEffective = effectiveCollection
          ? preset.frontCover.collection === effectiveCollection
          : true
        const matchesFormat = selectedFormat ? preset.format === selectedFormat : true
        const matchesTemplate = selectedTemplate ? preset.frontCover.template === selectedTemplate : true

        return matchesSearch && matchesCollectionEffective && matchesFormat && matchesTemplate
      })
      .sort(([leftKey], [rightKey]) => {
        const leftIsHotpick = HOTPICKS.includes(leftKey)
        const rightIsHotpick = HOTPICKS.includes(rightKey)
        if (leftIsHotpick !== rightIsHotpick) return leftIsHotpick ? -1 : 1
        return leftKey.localeCompare(rightKey)
      })
  }, [searchTerm, selectedCollection, selectedFormat, selectedTemplate])

  const noFiltersApplied =
    !searchTerm && !selectedCollection && !selectedFormat && !selectedTemplate && productType === 'all'

  const orderedPresets = useMemo(() => {
    if (!noFiltersApplied) return filteredPresets

    const hotpickItems = filteredPresets.filter(([key]) => HOTPICKS.includes(key))
    const regularItems = filteredPresets.filter(([key]) => !HOTPICKS.includes(key))

    const triadicItems: typeof filteredPresets = []
    const moodItems: typeof filteredPresets = []
    const otherItems: typeof filteredPresets = []

    regularItems.forEach(([key, preset]) => {
      if (preset.frontCover.collection === 'Triadic') triadicItems.push([key, preset])
      else if (preset.frontCover.collection === 'M(O_O)D') moodItems.push([key, preset])
      else otherItems.push([key, preset])
    })

    const cyclicItems: typeof filteredPresets = []
    const maxCycles = Math.max(triadicItems.length, moodItems.length)
    for (let i = 0; i < maxCycles; i++) {
      if (i < triadicItems.length) cyclicItems.push(triadicItems[i])
      if (i < moodItems.length) cyclicItems.push(moodItems[i])
    }

    return [...hotpickItems, ...cyclicItems, ...otherItems]
  }, [filteredPresets, noFiltersApplied])

  const getImageFromData = (format: string, collection: string, template: string) => {
    const found = processedData.find(
      (e: any) =>
        e.format.toUpperCase() === format.toUpperCase() &&
        e.collection.toUpperCase() === collection.toUpperCase() &&
        e.node.name.toUpperCase() === template.toUpperCase()
    )
    return found ? found.node.childImageSharp.gatsbyImageData : null
  }

  const spareOnlyProducts = useMemo(() => {
    if (!serverProducts || !Array.isArray(serverProducts)) return []
    return serverProducts.filter(
      (entry: any) => (!entry.preset || entry.preset === null) && entry.spareParts && entry.spareParts.length > 0
    )
  }, [serverProducts])

  const filterPanelProps: FilterPanelProps = {
    searchTerm, setSearchTerm,
    productType, handleProductTypeSelect,
    selectedCollection, handleCollectionSelect,
    selectedFormat, handleFormatSelect,
    selectedTemplate, handleTemplateSelect,
    dynamicFilterOptions,
    resetAllFilters,
    hasActiveFilters,
  }

  const totalShown =
    (productType !== 'spare' ? orderedPresets.length : 0) +
    (productType !== 'agenda' ? spareOnlyProducts.length : 0)

  // --- Render ---
  return (
    <div className="flex w-full gap-0 rounded-3xl overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside
        aria-label="Filtri"
        className={`
          hidden lg:flex flex-col flex-shrink-0
          border-white/10 bg-white/[0.03]
          rounded-3xl h-fit
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0'}
        `}
      >
        <div className="w-64 flex flex-col h-auto">
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
            <p className="text-[10px] font-semibold text-[#8ea2d0] uppercase tracking-wider">Filtri</p>
            {hasActiveFilters && (
              <span className="text-[10px] font-medium text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded-full">
                attivi
              </span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      </aside>

      {/* ── Mobile Overlay ── */}
      <>
        {/* Backdrop */}
        <div
          ref={backdropRef}
          onClick={() => setMobileOpen(false)}
          className={`
            lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300
            ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtri"
          className={`
            lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72
            flex flex-col
            bg-[#0d1424] border-r border-white/10
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
            <p className="text-sm font-semibold text-[#e5e7eb]">Filtri</p>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Chiudi filtri"
              className="p-1.5 rounded-lg text-[#8ea2d0] hover:text-[#e5e7eb] hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      </>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 min-w-0 p-6 gap-4">

        {/* Topbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Toggle button — desktop collapses sidebar, mobile opens drawer */}
          <button
            onClick={() => isMobile ? setMobileOpen(true) : setSidebarOpen((v) => !v)}
            aria-label={isMobile ? 'Apri filtri' : sidebarOpen ? 'Nascondi filtri' : 'Mostra filtri'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#e5e7eb] bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">
              {isMobile ? 'Filtri' : sidebarOpen ? 'Nascondi filtri' : 'Mostra filtri'}
            </span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" aria-label="Filtri attivi" />
            )}
          </button>

          {/* Active filter pills (compact summary) */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {productType !== 'all' && (
                <span className="flex items-center gap-1 text-xs bg-[#f97316]/15 border border-[#f97316]/30 text-[#ffb170] px-2.5 py-1 rounded-full">
                  {productType === 'agenda' ? 'Agende' : 'Ricambi'}
                  <button onClick={() => handleProductTypeSelect('all')} aria-label="Rimuovi filtro tipo" className="ml-0.5 hover:text-white">
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedCollection && (
                <span className="flex items-center gap-1 text-xs bg-[#f97316]/15 border border-[#f97316]/30 text-[#ffb170] px-2.5 py-1 rounded-full">
                  {selectedCollection}
                  <button onClick={() => handleCollectionSelect(selectedCollection)} aria-label="Rimuovi filtro collezione" className="ml-0.5 hover:text-white">
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedFormat && (
                <span className="flex items-center gap-1 text-xs bg-[#f97316]/15 border border-[#f97316]/30 text-[#ffb170] px-2.5 py-1 rounded-full">
                  {selectedFormat}
                  <button onClick={() => handleFormatSelect(selectedFormat)} aria-label="Rimuovi filtro formato" className="ml-0.5 hover:text-white">
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedTemplate && (
                <span className="flex items-center gap-1 text-xs bg-[#f97316]/15 border border-[#f97316]/30 text-[#ffb170] px-2.5 py-1 rounded-full">
                  {selectedTemplate}
                  <button onClick={() => handleTemplateSelect(selectedTemplate)} aria-label="Rimuovi filtro template" className="ml-0.5 hover:text-white">
                    <X size={11} />
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#8ea2d0] hover:text-[#ffb170] underline underline-offset-2 transition-colors"
              >
                Ripristina
              </button>
            </div>
          )}

          <span className="ml-auto text-xs text-[#8ea2d0] animate-fadeIn">
            {totalShown} risultati
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {noFiltersApplied && productType === 'all' ? (
            (() => {
              const hotpickItems = orderedPresets.filter(([key]) => HOTPICKS.includes(key))
              const regularItems = orderedPresets.filter(([key]) => !HOTPICKS.includes(key))

              const triadicItems = regularItems.filter(([, p]) => p.frontCover.collection === 'Triadic')
              const moodItems = regularItems.filter(([, p]) => p.frontCover.collection === 'M(O_O)D')
              const otherItems = regularItems.filter(
                ([, p]) => p.frontCover.collection !== 'Triadic' && p.frontCover.collection !== 'M(O_O)D'
              )

              const cyclicItems: Array<{ type: 'agenda' | 'spare'; key?: string; preset?: any; entry?: any }> = []
              const maxCycles = Math.max(triadicItems.length, moodItems.length, spareOnlyProducts.length)

              for (let i = 0; i < maxCycles; i++) {
                if (i < triadicItems.length) cyclicItems.push({ type: 'agenda', key: triadicItems[i][0], preset: triadicItems[i][1] })
                if (i < moodItems.length) cyclicItems.push({ type: 'agenda', key: moodItems[i][0], preset: moodItems[i][1] })
                if (i < spareOnlyProducts.length) cyclicItems.push({ type: 'spare', entry: spareOnlyProducts[i] })
              }

              const allItems = [
                ...hotpickItems.map(([key, preset]) => ({ type: 'agenda' as const, key, preset })),
                ...cyclicItems,
                ...otherItems.map(([key, preset]) => ({ type: 'agenda' as const, key, preset })),
                ...spareOnlyProducts
                  .slice(Math.max(triadicItems.length, moodItems.length))
                  .map((entry) => ({ type: 'spare' as const, entry })),
              ]

              return allItems.map((item, globalIndex) =>
                item.type === 'agenda' ? (
                  <TemplateItem
                    key={item.key}
                    index={globalIndex}
                    name={item.key!}
                    preset={item.preset!}
                    productData={getProductData(item.preset!)}
                    image={
                      item.preset!.frontCover.template
                        ? getImageFromData(item.preset!.format, item.preset!.frontCover.collection, item.preset!.frontCover.template)
                        : undefined
                    }
                  />
                ) : (
                  <SpareCard
                    key={`spare-${item.entry?.spareParts?.[0]?.id || globalIndex}`}
                    entry={item.entry}
                    globalIndex={globalIndex}
                    addToCart={addToCart}
                  />
                )
              )
            })()
          ) : (
            <>
              {productType !== 'spare' &&
                orderedPresets.map(([key, preset], index) => (
                  <TemplateItem
                    key={key}
                    index={index}
                    name={key}
                    preset={preset}
                    productData={getProductData(preset)}
                    image={
                      preset.frontCover.template
                        ? getImageFromData(preset.format, preset.frontCover.collection, preset.frontCover.template)
                        : undefined
                    }
                  />
                ))}

              {productType !== 'agenda' &&
                spareOnlyProducts.map((entry: any, index: number) => (
                  <SpareCard
                    key={`spare-${entry.spareParts?.[0]?.id || index}`}
                    entry={entry}
                    globalIndex={orderedPresets.length + index}
                    addToCart={addToCart}
                  />
                ))}
            </>
          )}
        </div>

        {/* Empty state */}
        {((productType !== 'spare' && filteredPresets.length === 0) || productType === 'spare') &&
          ((productType !== 'agenda' && spareOnlyProducts.length === 0) || productType === 'agenda') && (
            <div className="py-12 text-center text-[#8ea2d0]">
              Nessun risultato trovato per i filtri selezionati.
            </div>
          )}
      </div>
    </div>
  )
}

export default TemplateGallery