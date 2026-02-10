import React, { CSSProperties, useMemo, useState } from 'react'
import { AgendaFormat, Metadata, Module, presets } from '../../utilities/arenaSettings'
import Preview3D from './Preview3D'
import Button from '../atoms/Button'
import { getCoverTemplateImagePath } from '../../utilities/arenaHelpers'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import Switch from './Switch'


const TemplateItem = ({
  name,
  preset,
  image,
  index
}: {
  name: string
  preset: Metadata
  image?: IGatsbyImageData
  index: number
}) => {
  const coverZOffset = Math.min(preset.modules.length * 1.5, 10)

  const [mode, setMode] = useState<'flat' | '3D'>('3D')

  const getPreviewSizeClasses = ({
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

  const getPreviewTransform = (
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

  return (
    <div
      className="
    /* Layout & Base Styles */
    border border-gray-600 rounded-lg p-4 overflow-hidden gap-8 flex flex-col items-center relative pt-16
   opacity-0 transition-all duration-300 ease-out animate-fadeIn
    
    /* Hover Effects */
    hover:-translate-y-1 
    hover:border-blue/50
    hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] 
  "
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-br-lg shadow-lg z-10">
        <div className="font-bold text-sm tracking-wide">{name}</div>
        <div className="text-xs opacity-90 capitalize">{preset.frontCover.collection}</div>
      </div>
      {image ? <div className='absolute top-2 right-2 z-10'>
        <Switch isOn={mode === '3D'} toggleSwitch={() => setMode(mode === 'flat' ? '3D' : 'flat')} />
      </div> : <></>}
      {
        mode === '3D' || !image ? (
          <Preview3D
            noExtra
            modules={preset.modules}
            format={preset.format}
            previewTransform={getPreviewTransform('Formato', preset.format)}
            previewSize={getPreviewSizeClasses({ modules: preset.modules, format: preset.format })}
            coverZOffset={coverZOffset}
            frontCoverColor={preset.frontCover.color}
            backCoverColor={preset.backCover.color}
            frontCoverTemplate={preset.frontCover.template}
            frontCoverCollection={preset.frontCover.collection}
            templateImage={getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)}
            frontCoverText={preset.frontCover.text}
            frontCoverFontSize={preset.frontCover.fontSize}
            frontCoverPosition={preset.frontCover.position}
            frontCoverTextColor={preset.frontCover.textColor}
            backCoverTextColor={preset.backCover.textColor}
            backCoverText={preset.backCover.text}
            backCoverFontSize={preset.backCover.fontSize}
            backCoverPosition={preset.backCover.position}
          />
        ) : (
          <GatsbyImage
            image={image}
            alt={`${preset.frontCover.collection} ${preset.format} template`}
            className="w-44 h-auto object-cover rounded-md"
          />
        )
      }
      <div className='flex flex-row gap-2 items-end justify-center w-full mt-auto'>
        <Button
          text="Compra ora"
          href={`/arena?preset=${name}&paynow=true`}
          small
        />
        <Button
          text="Modifica"
          href={`/arena?preset=${name}`}
          smaller
          variant='secondary'
        />
      </div>
    </div>
  )
}

const TemplateGallery = () => {
  // --- 1. Filter State ---
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

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
    <div className="flex flex-col gap-6 p-6 w-[80vw]">
      {/* Filter Controls */}
      <div className="p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between animate-fadeIn">
        {/* Search Bar: Full width on mobile, auto on desktop */}
        <div className="w-full md:flex-1 md:min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca per nome..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-sm bg-beige focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Selectors Container: Grid on mobile, flex on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full md:w-auto items-center">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2.5 md:py-2 text-sm bg-beige cursor-pointer appearance-none md:appearance-auto shadow-sm"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">Collezioni</option>
            {filterOptions.collections.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2.5 md:py-2 text-sm bg-beige cursor-pointer shadow-sm"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">Formati</option>
            {filterOptions.formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2.5 md:py-2 text-sm bg-beige cursor-pointer shadow-sm col-span-1"
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
              className="col-span-1 sm:ml-2 flex items-center justify-center text-brown hover:text-red-600 transition-colors py-2 px-4 md:px-2"
              aria-label="Reset filters"
            >
              <span className="text-xs font-bold tracking-tighter uppercase md:hidden">Reset</span>
              <span className="hidden md:block font-extrabold text-xl">×</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 px-1 animate-fadeIn">
        Mostrando {filteredPresets.length} risultati
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPresets.map(([key, preset], index) => (
          <TemplateItem
            index={index}
            key={key}
            name={key}
            preset={preset}
            image={
              preset.frontCover.template ?
                getImageFromData(preset.format, preset.frontCover.collection, preset.frontCover.template) : undefined}
          />
        ))}
        {filteredPresets.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Nessun risultato trovato per i filtri selezionati.
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateGallery