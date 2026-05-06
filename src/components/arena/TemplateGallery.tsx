import React, { useMemo, useState, useEffect } from 'react'
import { Metadata, presets } from '../../utilities/arenaSettings'
import { Link } from 'gatsby'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import Switch from './Switch'
import Preview3DWrapper from './Preview3DWrapper'
import { StripeProduct } from '../../utilities/stripeHelper'
import { getCoverTemplateImagePath, slugify } from '../../utilities/arenaHelpers'
import { useCart } from '../../utilities/cartContext'
import { PlusIcon, ShoppingCartIcon } from 'lucide-react'
import NoImagePlaceholder from '../atoms/NoImagePlaceholder'
import { HOTPICKS } from '../../utilities/arenaSettings'

const HOTPICK_PARTICLES = [
  // [x%, y%, tx, ty, type]  — x/y are % of card size, tx/ty are drift in px
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


const TemplateItem = ({
  name,
  preset,
  image,
  index,
  productData // New prop for Stripe data
}: {
  name: string
  preset: Metadata
  image?: IGatsbyImageData
  index: number
  productData?: StripeProduct | null
}) => {
  const [mode, setMode] = useState<'flat' | '3D'>('flat')
  const { addToCart } = useCart();
  const isHotpick = HOTPICKS.includes(name)

  // Helper to format currency
  const formattedPrice = useMemo(() => {
    if (!productData?.default_price || !productData.default_price.unit_amount) return null;
    return new Intl.NumberFormat('it-IT', { // Assuming Italian based on text
      style: 'currency',
      currency: productData.default_price.currency.toUpperCase(),
    }).format(productData.default_price.unit_amount / 100);
  }, [productData]);

  const linkProduct = productData ? `/arena?preset=${name}&pid=${productData.id}&price_id=${productData.default_price.id}` : `/arena?preset=${name}`
  const linkProductPay = linkProduct + '&paynow=true'

  return (
    <div className="relative">
      {isHotpick && (
        <div className="pointer-events-none absolute inset-0 z-50 animate-fadeIn opacity-50"
          style={{ animationDelay: `${index * 0.1}s` }}>
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
          boxShadow: isHotpick ? '0 0 18px rgba(255, 122, 0, 0.35), 0 0 42px rgba(255, 61, 0, 0.18)' : undefined
        }}
      >
        <div className="absolute left-0 top-0 z-10 rounded-br-xl border-b border-r border-[#f97316]/40 bg-gradient-to-br from-[#f97316] to-[#ff9d57] px-4 py-2 text-[#1f2937] shadow-lg">
          <div className="text-sm font-bold tracking-wide">{name}</div>
          <div className="text-xs opacity-90 capitalize">{preset.frontCover.collection}</div>
        </div>

        {image ? <div className='absolute top-2 right-2 z-10'>
          <Switch isOn={mode === '3D'} toggleSwitch={() => setMode(mode === 'flat' ? '3D' : 'flat')} />
        </div> : <></>}

        {
          mode === '3D' || !image ? (
            <Preview3DWrapper product={preset} noExtra />
          ) : (
            <GatsbyImage
              image={image}
              alt={`${preset.frontCover.collection} ${preset.format} template`}
              className={`h-auto object-cover rounded-md ${preset.format === 'A5' ? 'w-44' :
                preset.format === 'A6' ? 'w-40' :
                  preset.format === 'A7' ? 'w-32' :
                    'w-44'
                }`}
            />
          )
        }

        {/* Price Display */}
        <div className="w-full flex justify-center -mb-4 z-10">
          {formattedPrice ? (
            <span className="rounded border border-[#37b87d]/40 bg-[#37b87d]/15 px-2.5 py-0.5 text-xs font-bold text-[#8fe7be]">
              {formattedPrice}
            </span>
          ) : (
            // Placeholder for loading price
            <span className="h-5 w-16 animate-pulse rounded bg-white/10"></span>
          )}
        </div>

        <div className='flex flex-row gap-2 items-end justify-center w-full mt-auto pt-6'>
          <Link
            to={`/prodotto/${slugify(preset?.slug ?? name)}`}
            className="uuuk-btn-primary !px-4 !py-2 !text-xs"
          >
            Vedi prodotto
          </Link>
          <button
            onClick={() => addToCart({
              ...preset,
              productId: productData?.id,
              priceId: productData?.default_price.id,
              price: Number(productData?.default_price.unit_amount_decimal) / 100,
              image: image ? image : preset.frontCover.template ? getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template) : undefined,
              name
            })}
            className="uuuk-btn-secondary relative flex items-center gap-1 !px-3 !py-2 !text-xs"
          >
            <ShoppingCartIcon className="inline-block mr-1" size={16} />
            <PlusIcon className="inline-block absolute top-px right-px" size={16} />
            {/* Aggiungi al carrello */}
          </button>
        </div>
      </div>
    </div>
  )
}

interface TemplateGalleryProps {
  // Products passed from Gatsby Page Context (can be merged entries)
  serverProducts?: any[]
}

const TemplateGallery = ({ serverProducts }: TemplateGalleryProps) => {
  // --- 1. Filter State ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [productType, setProductType] = useState<'all' | 'agenda' | 'spare'>('all')
  const [gallerySeed] = useState(() => Math.random())
  const { addToCart } = useCart()


  const getProductData = (preset: Metadata) => {
    if (!serverProducts || !serverProducts.length) return null;
    const searchName = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`;

    const foundEntry = serverProducts.find((entry: any) => {
      const candidate =
        (entry && typeof entry.name === 'string' && entry.name) ||
        (entry && entry.stripeProduct && typeof entry.stripeProduct.name === 'string' && entry.stripeProduct.name) ||
        (entry && entry.stripeData && typeof entry.stripeData.name === 'string' && entry.stripeData.name) ||
        null

      if (!candidate) return false
      return candidate.trim().toLowerCase() === searchName.trim().toLowerCase()
    }) || null

    if (!foundEntry) return null

    // if the gallery entry wraps the Stripe product, return the inner stripeProduct, otherwise return the entry itself
    return (foundEntry.stripeProduct ?? foundEntry) as StripeProduct | null
  };

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
                gatsbyImageData(
                  placeholder: BLURRED
                  layout: CONSTRAINED
                )
              }
              relativePath
              name
            }
          }
        }
      }
    `)

  const parseCollectionAndFormat = (relativePath: string): { collection: string; format: string } => {
    const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
    const parts = normalized.split('/').filter(Boolean)
    if (parts.length < 4 || parts[0].toLowerCase() !== 'collezioni') {
      return { collection: '', format: '' }
    }
    return { collection: parts[1], format: parts[2] }
  }

  // Use Memo for image data processing to avoid recalculation on every filter keystroke
  const processedData = useMemo(() => {
    const edges = [...rawData.allFile.edges]
    const modEdges = edges.map((e: any) => {
      const { collection, format } = parseCollectionAndFormat(e.node.relativePath)
      return { ...e, collection, format }
    })

    const additional = modEdges
      .filter((e: any) => (e.format || '').toUpperCase() === 'A6')
      .map((e: any) => ({ ...e, format: 'A5' }));

    modEdges.push(...additional);

    modEdges.sort((a: any, b: any) => {
      if (a.format !== b.format) return a.format.localeCompare(b.format);
      if (a.collection !== b.collection) return a.collection.localeCompare(b.collection);
      return a.node.name.localeCompare(b.node.name);
    });

    return modEdges
  }, [rawData])

  // --- 2. Extract Unique Options for Dropdowns ---
  const filterOptions = useMemo(() => {
    const formats = new Set<string>()
    const collections = new Set<string>()
    const templates = new Set<string>()

    Object.values(presets).forEach(preset => {
      if (preset.format) formats.add(preset.format)
      if (preset.frontCover.collection) collections.add(preset.frontCover.collection)
      if (preset.frontCover.template) templates.add(preset.frontCover.template)
    })

    return {
      formats: Array.from(formats).sort(),
      collections: Array.from(collections).sort(),
      templates: Array.from(templates).sort()
    }
  }, [])

  // --- 3. Filter Logic ---
  const filteredPresets = useMemo(() => {
    return Object.entries(presets)
      .filter(([key, preset]) => {
        const searchLower = searchTerm.toLowerCase()

        // Text Search matches Name or Collection
        const matchesSearch =
          key.toLowerCase().includes(searchLower) ||
          preset.frontCover.collection.toLowerCase().includes(searchLower) ||
          preset.frontCover.template?.toLowerCase().includes(searchLower) ||
          preset.format.toLowerCase().includes(searchLower) ||
          // check also in collection without special characters, only letters and the numbers
          preset.frontCover.collection.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().includes(searchLower)

        const matchesCollection = selectedCollection ? preset.frontCover.collection === selectedCollection : true
        const matchesFormat = selectedFormat ? preset.format === selectedFormat : true
        const matchesTemplate = selectedTemplate ? preset.frontCover.template === selectedTemplate : true

        return matchesSearch && matchesCollection && matchesFormat && matchesTemplate
      })
      .sort(([leftKey], [rightKey]) => {
        const leftIsHotpick = HOTPICKS.includes(leftKey)
        const rightIsHotpick = HOTPICKS.includes(rightKey)

        if (leftIsHotpick !== rightIsHotpick) {
          return leftIsHotpick ? -1 : 1
        }

        return leftKey.localeCompare(rightKey)
      })
  }, [searchTerm, selectedCollection, selectedFormat, selectedTemplate])

  const noFiltersApplied = !searchTerm && !selectedCollection && !selectedFormat && !selectedTemplate && productType === 'all'

  const orderedPresets = useMemo(() => {
    if (!noFiltersApplied) return filteredPresets

    const hotpickItems = filteredPresets.filter(([key]) => HOTPICKS.includes(key))
    const regularItems = filteredPresets.filter(([key]) => !HOTPICKS.includes(key))

    // Categorize regular items by collection type
    const triadicItems: typeof filteredPresets = []
    const moodItems: typeof filteredPresets = []
    const otherItems: typeof filteredPresets = []

    regularItems.forEach(([key, preset]) => {
      if (preset.frontCover.collection === 'Triadic') {
        triadicItems.push([key, preset])
      } else if (preset.frontCover.collection === 'M(O_O)D') {
        moodItems.push([key, preset])
      } else {
        otherItems.push([key, preset])
      }
    })

    // Build cyclic order: 1 triadic, 1 mood, repeat until one is exhausted
    const cyclicItems: typeof filteredPresets = []
    const maxCycles = Math.max(triadicItems.length, moodItems.length)

    for (let i = 0; i < maxCycles; i++) {
      if (i < triadicItems.length) {
        cyclicItems.push(triadicItems[i])
      }
      if (i < moodItems.length) {
        cyclicItems.push(moodItems[i])
      }
    }

    // Combine: hotpicks + cyclic items + remaining items
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

  // Extract spare-only products (no preset)
  const spareOnlyProducts = useMemo(() => {
    if (!serverProducts || !Array.isArray(serverProducts)) return []
    return serverProducts.filter((entry: any) => {
      // Include entries where preset is null/undefined but spareParts exists
      return (!entry.preset || entry.preset === null) && entry.spareParts && entry.spareParts.length > 0
    })
  }, [serverProducts])

  const orderedSpareOnlyProducts = useMemo(() => {
    if (!noFiltersApplied) return spareOnlyProducts
    return spareOnlyProducts
  }, [noFiltersApplied, spareOnlyProducts])

  // --- 4. Render ---
  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl p-6">
      {/* Filter Controls */}
      <div className="uuuk-surface h-full flex flex-col items-center justify-between gap-4 rounded-xl p-4 animate-fadeIn md:flex-row">
        {/* Search Bar: Full width on mobile, auto on desktop */}
        <div className="w-full md:flex-1 md:min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca per nome..."
              className="uuuk-input rounded-xl px-4 py-3 md:py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Selectors Container: Grid on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full md:w-auto items-center">
          <select
            className="uuuk-select cursor-pointer appearance-none rounded-lg py-2.5 md:appearance-auto md:py-2"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">Collezioni</option>
            {filterOptions.collections.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="uuuk-select cursor-pointer rounded-lg py-2.5 md:py-2"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">Formati</option>
            {filterOptions.formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select
            className="uuuk-select col-span-1 cursor-pointer rounded-lg py-2.5 md:py-2"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="">Template</option>
            {filterOptions.templates.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            className="uuuk-select col-span-1 cursor-pointer rounded-lg py-2.5 md:py-2"
            value={productType}
            onChange={(e) => setProductType(e.target.value as 'all' | 'agenda' | 'spare')}
          >
            <option value="all">Tutti i prodotti</option>
            <option value="agenda">Solo Agende</option>
            <option value="spare">Solo Ricambi</option>
          </select>

          {/* Reset Button: Styled as a clear action */}
          {(searchTerm || selectedCollection || selectedFormat || selectedTemplate || productType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCollection('')
                setSelectedFormat('')
                setSelectedTemplate('')
                setProductType('all')
              }}
              className="col-span-1 flex items-center justify-center px-4 py-2 text-[#ffb170] transition-colors hover:text-[#f97316] sm:ml-2 md:px-2"
              aria-label="Reset filters"
            >
              <span className="text-xs font-bold tracking-tighter uppercase md:hidden">Reset</span>
              <span className="hidden md:block font-extrabold text-xl">×</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between px-1 text-sm text-[#8ea2d0] animate-fadeIn">
        <span>Mostrando {(productType !== 'spare' ? orderedPresets.length : 0) + (productType !== 'agenda' ? orderedSpareOnlyProducts.length : 0)} risultati</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {noFiltersApplied && productType === 'all' ? (
          // Cyclic rendering when no filters applied and showing all products
          (() => {
            const hotpickItems = orderedPresets.filter(([key]) => HOTPICKS.includes(key))
            const regularItems = orderedPresets.filter(([key]) => !HOTPICKS.includes(key))

            const triadicItems = regularItems.filter(([, preset]) => preset.frontCover.collection === 'Triadic')
            const moodItems = regularItems.filter(([, preset]) => preset.frontCover.collection === 'M(O_O)D')
            const otherItems = regularItems.filter(([, preset]) => preset.frontCover.collection !== 'Triadic' && preset.frontCover.collection !== 'M(O_O)D')

            const cyclicItems: Array<{ type: 'agenda' | 'spare'; key?: string; preset?: any; entry?: any; index?: number }> = []
            const maxCycles = Math.max(triadicItems.length, moodItems.length, spareOnlyProducts.length)

            for (let i = 0; i < maxCycles; i++) {
              if (i < triadicItems.length) {
                cyclicItems.push({ type: 'agenda', key: triadicItems[i][0], preset: triadicItems[i][1] })
              }
              if (i < moodItems.length) {
                cyclicItems.push({ type: 'agenda', key: moodItems[i][0], preset: moodItems[i][1] })
              }
              if (i < spareOnlyProducts.length) {
                cyclicItems.push({ type: 'spare', entry: spareOnlyProducts[i], index: i })
              }
            }

            const allItems = [
              ...hotpickItems.map(([key, preset]) => ({ type: 'agenda' as const, key, preset })),
              ...cyclicItems,
              ...otherItems.map(([key, preset]) => ({ type: 'agenda' as const, key, preset })),
              ...spareOnlyProducts.slice(Math.max(triadicItems.length, moodItems.length)).map((entry, idx) => ({ type: 'spare' as const, entry, index: Math.max(triadicItems.length, moodItems.length) + idx }))
            ]

            return allItems.map((item, globalIndex) => {
              if (item.type === 'agenda') {
                return (
                  <TemplateItem
                    index={globalIndex}
                    key={item.key}
                    name={item.key!}
                    preset={item.preset!}
                    productData={getProductData(item.preset!)}
                    image={
                      item.preset!.frontCover.template ?
                        getImageFromData(item.preset!.format, item.preset!.frontCover.collection, item.preset!.frontCover.template) : undefined
                    }
                  />
                )
              } else {
                const sparePart = item.entry?.spareParts?.[0]
                return (
                  <div
                    key={`spare-${sparePart?.id || globalIndex}`}
                    className="uuuk-surface h-full relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-4 pt-16 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-[0_18px_40px_rgba(6,10,20,0.5)] animate-fadeIn"
                    style={{ animationDelay: `${globalIndex * 0.1}s` }}
                  >
                    <div className="absolute left-0 top-0 z-10 rounded-br-xl border-b border-r border-[#f97316]/40 bg-gradient-to-br from-[#f97316] to-[#ff9d57] px-4 py-2 text-[#1f2937] shadow-lg">
                      <div className="text-sm font-bold tracking-wide">{sparePart?.nome || item.entry?.stripeData?.name}</div>
                      <div className="text-xs opacity-90">Ricambio</div>
                    </div>

                    {item.entry?.stripeData?.images?.[0] ? (
                      <img
                        src={item.entry.stripeData.images[0]}
                        alt={sparePart?.nome || 'Ricambio'}
                        className="w-44 h-auto object-cover rounded-md"
                      />
                    ) : (
                      <NoImagePlaceholder size="lg" />
                    )}

                    <div className="w-full flex justify-center -mb-4 z-10">
                      {item.entry?.stripeData?.default_price?.unit_amount ? (
                        <span className="rounded border border-[#37b87d]/40 bg-[#37b87d]/15 px-2.5 py-0.5 text-xs font-bold text-[#8fe7be]">
                          {new Intl.NumberFormat('it-IT', {
                            style: 'currency',
                            currency: item.entry.stripeData.default_price.currency.toUpperCase(),
                          }).format(item.entry.stripeData.default_price.unit_amount / 100)}
                        </span>
                      ) : (
                        <span className="h-5 w-16 animate-pulse rounded bg-white/10"></span>
                      )}
                    </div>

                    <div className='flex flex-row gap-2 items-end justify-center w-full mt-auto pt-6'>
                      <Link
                        to={`/prodotto/${item.entry?.slug}`}
                        className="uuuk-btn-primary !px-4 !py-2 !text-xs"
                      >
                        Vedi prodotto
                      </Link>
                      <button
                        onClick={() => addToCart({
                          ...sparePart,
                          productId: item.entry?.stripeData?.id,
                          priceId: item.entry?.stripeData?.default_price?.id,
                          price: item.entry?.stripeData?.default_price?.unit_amount ? Number(item.entry.stripeData.default_price.unit_amount) / 100 : 0,
                          image: item.entry?.stripeData?.images?.[0],
                          name: sparePart?.nome || item.entry?.stripeData?.name,
                          id: sparePart?.id || item.entry?.stripeData?.id,
                          productType: 'spare',
                          sparePart,
                        })}
                        className="uuuk-btn-secondary relative flex items-center gap-1 !px-3 !py-2 !text-xs"
                      >
                        <ShoppingCartIcon className="inline-block mr-1" size={16} />
                        <PlusIcon className="inline-block absolute top-px right-px" size={16} />
                      </button>
                    </div>
                  </div>
                )
              }
            })
          })()
        ) : (
          // Separate rendering when filters are applied
          <>
            {productType !== 'spare' && orderedPresets.map(([key, preset], index) => (
              <TemplateItem
                index={index}
                key={key}
                name={key}
                preset={preset}
                productData={getProductData(preset)}
                image={
                  preset.frontCover.template ?
                    getImageFromData(preset.format, preset.frontCover.collection, preset.frontCover.template) : undefined
                }
              />
            ))}

            {/* Render spare-only products */}
            {productType !== 'agenda' && orderedSpareOnlyProducts.map((entry: any, index: number) => {
              const sparePart = entry.spareParts?.[0]
              return (
                <div
                  key={`spare-${sparePart?.id || index}`}
                  className="uuuk-surface h-full relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-4 pt-16 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-[0_18px_40px_rgba(6,10,20,0.5)] animate-fadeIn"
                  style={{ animationDelay: `${(orderedPresets.length + index) * 0.1}s` }}
                >
                  <div className="absolute left-0 top-0 z-10 rounded-br-xl border-b border-r border-[#f97316]/40 bg-gradient-to-br from-[#f97316] to-[#ff9d57] px-4 py-2 text-[#1f2937] shadow-lg">
                    <div className="text-sm font-bold tracking-wide">{sparePart?.nome || entry.stripeData?.name}</div>
                    <div className="text-xs opacity-90">Ricambio</div>
                  </div>

                  {entry.stripeData?.images?.[0] ? (
                    <img
                      src={entry.stripeData.images[0]}
                      alt={sparePart?.nome || 'Ricambio'}
                      className="w-44 h-auto object-cover rounded-md"
                    />
                  ) : (
                    <NoImagePlaceholder size="lg" />
                  )}

                  {/* Price Display */}
                  <div className="w-full flex justify-center -mb-4 z-10">
                    {entry.stripeData?.default_price?.unit_amount ? (
                      <span className="rounded border border-[#37b87d]/40 bg-[#37b87d]/15 px-2.5 py-0.5 text-xs font-bold text-[#8fe7be]">
                        {new Intl.NumberFormat('it-IT', {
                          style: 'currency',
                          currency: entry.stripeData.default_price.currency.toUpperCase(),
                        }).format(entry.stripeData.default_price.unit_amount / 100)}
                      </span>
                    ) : (
                      <span className="h-5 w-16 animate-pulse rounded bg-white/10"></span>
                    )}
                  </div>

                  <div className='flex flex-row gap-2 items-end justify-center w-full mt-auto pt-6'>
                    <Link
                      to={`/prodotto/${entry.slug}`}
                      className="uuuk-btn-primary !px-4 !py-2 !text-xs"
                    >
                      Vedi prodotto
                    </Link>
                    <button
                      onClick={() => addToCart({
                        ...sparePart,
                        productId: entry.stripeData?.id,
                        priceId: entry.stripeData?.default_price?.id,
                        price: entry.stripeData?.default_price?.unit_amount ? Number(entry.stripeData.default_price.unit_amount) / 100 : 0,
                        image: entry.stripeData?.images?.[0],
                        name: sparePart?.nome || entry.stripeData?.name,
                        id: sparePart?.id || entry.stripeData?.id,
                        productType: 'spare',
                        sparePart,
                      })}
                      className="uuuk-btn-secondary relative flex items-center gap-1 !px-3 !py-2 !text-xs"
                    >
                      <ShoppingCartIcon className="inline-block mr-1" size={16} />
                      <PlusIcon className="inline-block absolute top-px right-px" size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {((productType !== 'spare' && filteredPresets.length === 0) || productType === 'spare') &&
        ((productType !== 'agenda' && spareOnlyProducts.length === 0) || productType === 'agenda') && (
          <div className="col-span-full py-12 text-center text-[#8ea2d0]">
            Nessun risultato trovato per i filtri selezionati.
          </div>
        )}
    </div>
  )
}

export default TemplateGallery