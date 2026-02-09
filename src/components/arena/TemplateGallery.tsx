import React, { CSSProperties, useState } from 'react'
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
  image
}: {
  name: string
  preset: Metadata
  image?: IGatsbyImageData
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
    <div className="border rounded-lg p-4 overflow-hidden gap-8 flex flex-col items-center relative pt-16">
      <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-br-lg shadow-lg">
        <div className="font-bold text-sm tracking-wide">{name}</div>
        <div className="text-xs opacity-90 capitalize">{preset.frontCover.collection}</div>
      </div>
      {image ? <div className='absolute top-2 right-2'>
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
      <div className='flex flex-row gap-2 items-end justify-center'>
        <Button
          text="Compra ora"
          href={`/arena?preset=${name}&paynow=true`}
          small
        />
        <Button
          text="Personalizza"
          href={`/arena?preset=${name}`}
          smaller
          variant='secondary'
        />
      </div>
    </div>
  )
}

const TemplateGallery = (
  { mode }: { mode: 'flat' | '3D' }
) => {

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

  const [data] = useState(() => {
    const edges = [...rawData.allFile.edges]

    const modEdges = edges.map(e => {
      const { collection, format } = parseCollectionAndFormat(e.node.relativePath)
      return { ...e, collection, format }
    })

    const additional = modEdges
      .filter(e => (e.format || '').toUpperCase() === 'A6')
      .map(e => ({ ...e, format: 'A5' }));

    modEdges.push(...additional);

    modEdges.sort((a, b) => {
      if (a.format !== b.format) return a.format.localeCompare(b.format);
      if (a.collection !== b.collection) return a.collection.localeCompare(b.collection);
      return a.node.name.localeCompare(b.node.name);
    });

    // for (let i = modEdges.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1))
    //     ;[modEdges[i], modEdges[j]] = [modEdges[j], modEdges[i]]
    // }
    return { allFile: { modEdges } }
  })

  const getImageFromData = (format: string, collection: string, template: string) => {
    const found = data.allFile.modEdges.find(
      (e: any) =>
        e.format.toUpperCase() === format.toUpperCase() &&
        e.collection.toUpperCase() === collection.toUpperCase() &&
        e.node.name.toUpperCase() === template.toUpperCase()
    )
    return found ? found.node.childImageSharp.gatsbyImageData : null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {Object.entries(presets).map(([key, preset]) => (
        <TemplateItem
          key={key}
          name={key}
          preset={preset}
          image={
            preset.frontCover.template ?
              getImageFromData(preset.format, preset.frontCover.collection, preset.frontCover.template) : undefined}
        />
      ))}
    </div>
  )
}

export default TemplateGallery