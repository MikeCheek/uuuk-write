import React, { CSSProperties } from 'react'
import { AgendaFormat, Metadata, Module } from '../../utilities/arenaSettings'
import { getCoverTemplateImagePath } from '../../utilities/arenaHelpers'
import Preview3D from './Preview3D'

const Preview3DWrapper = (
  {
    product,
    noExtra = false
  }: {
    product: Metadata
    noExtra?: boolean
  }
) => {

  const coverZOffset = Math.min(product.modules.length * 1.5, 10)

  const getPreviewSizeClasses = ({
    modules,
    format
  }: {
    modules: Module[]
    format: AgendaFormat
  }) => {
    const baseSpineWidth = 2
    const totalSpineWidthRem = modules.length * baseSpineWidth * 0.35

    switch (format) {
      case 'A7':
        return {
          container: 'w-24 h-36',
          text: 'text-[6px]',
          spineWidthRem: totalSpineWidthRem,
          coverTextSize: 'text-xs'
        }
      case 'A6':
        return {
          container: 'w-32 h-48',
          text: 'text-[8px]',
          spineWidthRem: totalSpineWidthRem,
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
    <Preview3D
      noExtra={noExtra}
      modules={product.modules}
      format={product.format}
      previewTransform={getPreviewTransform('Formato', product.format)}
      previewSize={getPreviewSizeClasses({ modules: product.modules, format: product.format })}
      coverZOffset={coverZOffset}
      frontCoverColor={product.frontCover.color}
      backCoverColor={product.backCover.color}
      frontCoverTemplate={product.frontCover.template}
      frontCoverCollection={product.frontCover.collection}
      templateImage={getCoverTemplateImagePath(product.format, product.frontCover.collection, product.frontCover.template)}
      frontCoverText={product.frontCover.text}
      frontCoverFontSize={product.frontCover.fontSize}
      frontCoverPosition={product.frontCover.position}
      frontCoverTextColor={product.frontCover.textColor}
      backCoverTextColor={product.backCover.textColor}
      backCoverText={product.backCover.text}
      backCoverFontSize={product.backCover.fontSize}
      backCoverPosition={product.backCover.position}
    />
  )
}

export default Preview3DWrapper