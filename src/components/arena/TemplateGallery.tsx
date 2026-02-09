import React from 'react'
import { Metadata, presets } from '../../utilities/arenaSettings'
import Preview3D from './Preview3D'
import Button from '../atoms/Button'
import { getCoverTemplateImagePath, getPreviewSizeClasses, getPreviewTransform } from '../../utilities/arenaHelpers'

const TemplateGallery = () => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {Object.entries(presets).map(([key, preset]) => {
        const coverZOffset = Math.min(preset.modules.length * 1.5, 10)

        return (
          <div key={key} className="border rounded-lg p-4 overflow-hidden gap-8 flex flex-col items-center relative pt-12">
            <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-br-lg shadow-lg">
              <div className="font-bold text-sm tracking-wide">{key}</div>
              <div className="text-xs opacity-90 capitalize">{preset.frontCover.collection}</div>
            </div>
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
            <div className='flex flex-row gap-2 items-end justify-center'>
              <Button
                text="Compra ora"
                onClick={() => { }}
                small
              />
              <Button
                text="Personalizza"
                href={`/arena?preset=${key}`}
                smaller
                variant='secondary'
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TemplateGallery