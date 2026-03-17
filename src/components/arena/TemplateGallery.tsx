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
    <div
      className="uuuk-surface relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-4 pt-16 opacity-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-[0_18px_40px_rgba(6,10,20,0.5)] animate-fadeIn"
      style={{ animationDelay: `${index * 0.1}s` }}
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
            className="w-44 h-auto object-cover rounded-md"
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
  )
}

interface TemplateGalleryProps {
  // Products passed from Gatsby Page Context
  serverProducts?: StripeProduct[]
}

const TemplateGallery = ({ serverProducts }: TemplateGalleryProps) => {
  // --- 1. Filter State ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')


  const getProductData = (preset: Metadata) => {
    if (!serverProducts || !serverProducts.length) return null;
    const searchName = `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`;
    return serverProducts.find(p => p.name.trim().toLowerCase() === searchName.trim().toLowerCase()) || null;
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
    return Object.entries(presets).filter(([key, preset]) => {
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
  }, [searchTerm, selectedCollection, selectedFormat, selectedTemplate])

  const getImageFromData = (format: string, collection: string, template: string) => {
    const found = processedData.find(
      (e: any) =>
        e.format.toUpperCase() === format.toUpperCase() &&
        e.collection.toUpperCase() === collection.toUpperCase() &&
        e.node.name.toUpperCase() === template.toUpperCase()
    )
    return found ? found.node.childImageSharp.gatsbyImageData : null
  }

  // --- 4. Render ---
  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl p-6">
      {/* Filter Controls */}
      <div className="uuuk-surface flex flex-col items-center justify-between gap-4 rounded-xl p-4 animate-fadeIn md:flex-row">
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

          {/* Reset Button: Styled as a clear action */}
          {(searchTerm || selectedCollection || selectedFormat || selectedTemplate) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCollection('')
                setSelectedFormat('')
                setSelectedTemplate('')
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
        <span>Mostrando {filteredPresets.length} risultati</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPresets.map(([key, preset], index) => (
          <TemplateItem
            index={index}
            key={key}
            name={key}
            preset={preset}
            // Pass the API data to the item
            productData={getProductData(preset)}
            image={
              preset.frontCover.template ?
                getImageFromData(preset.format, preset.frontCover.collection, preset.frontCover.template) : undefined}
          />
        ))}
        {filteredPresets.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#8ea2d0]">
            Nessun risultato trovato per i filtri selezionati.
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateGallery