import React from 'react'
import { Collection, ColorOption, CoverImageTemplate, FontSize, TextPosition } from '../../utilities/arenaSettings';
import ColorButton from './ColorButton';
import TextButton from './TextButton';
import InputText from './InputText';

const FrontCover = (
  {
    frontCoverText,
    setFrontCoverText,
    frontCoverFontSize,
    setFrontCoverFontSize,
    frontCoverPosition,
    setFrontCoverPosition,
    frontCoverCollection,
    setFrontCoverCollection,
    frontCoverTemplate,
    setFrontCoverTemplate,
    frontCoverColor,
    setFrontCoverColor,
    fontSizes,
    textPositions,
    collections,
    availableTemplates,
    colors
  }: {
    frontCoverText: string;
    setFrontCoverText: (text: string) => void;
    frontCoverFontSize: FontSize;
    setFrontCoverFontSize: (size: FontSize) => void;
    frontCoverPosition: TextPosition;
    setFrontCoverPosition: (position: TextPosition) => void;
    frontCoverCollection: Collection;
    setFrontCoverCollection: (collection: Collection) => void;
    frontCoverTemplate: CoverImageTemplate;
    setFrontCoverTemplate: (template: CoverImageTemplate) => void;
    frontCoverColor: ColorOption;
    setFrontCoverColor: (color: ColorOption) => void;
    fontSizes: FontSize[];
    textPositions: TextPosition[];
    collections: Collection[];
    availableTemplates: CoverImageTemplate[];
    colors: ColorOption[];
  }
) => {
  return (
    <div className="space-y-6">
      {/* Collection Chooser */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">1. Scegli la collezione:</p>
        <div className="flex flex-wrap gap-3">
          {collections.map((c) => (
            <TextButton
              key={c}
              text={c}
              onClick={() => { setFrontCoverCollection(c); setFrontCoverTemplate('None' as CoverImageTemplate); }}
              active={frontCoverCollection === c}
            />
          ))}
        </div>
      </div>

      {/* Cover Template */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">2. Modello immagine copertina:</p>
        <div className="flex flex-wrap gap-3">
          {availableTemplates.map((t) => (
            <TextButton
              key={t}
              text={t}
              onClick={() => setFrontCoverTemplate(t)}
              active={frontCoverTemplate === t}
            />
          ))}
        </div>
      </div>

      {/* Color (omitted for brevity) */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">Colore Copertina Anteriore:</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <ColorButton key={c.name} name={c.name}
              color={c.color}
              active={frontCoverColor.name === c.name}
              onClick={() => setFrontCoverColor(c)} />
          ))}
        </div>
      </div>


      {/* Front Cover Text */}
      <div>
        <InputText
          label="Testo Copertina Anteriore (Opzionale):"
          id="frontCoverText"
          value={frontCoverText}
          onChange={(e) => setFrontCoverText(e.target.value)} />
      </div>

      {
        frontCoverText.trim() !== '' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Font Size Chooser */}
            <div>
              <p className="text-gray-600 mb-2 font-medium">Dimensione Testo:</p>
              <div className="flex flex-wrap gap-2">
                {fontSizes.map((size) => (
                  <TextButton
                    key={size}
                    text={size}
                    onClick={() => setFrontCoverFontSize(size)}
                    active={frontCoverFontSize === size}
                  />
                ))}
              </div>
            </div>

            {/* Text Position Chooser */}
            <div>
              <p className="text-gray-600 mb-2 font-medium">Posizione Testo:</p>
              <div className="flex flex-wrap gap-2">
                {textPositions.map((position) => (
                  <TextButton
                    key={position}
                    text={position}
                    onClick={() => setFrontCoverPosition(position)}
                    active={frontCoverPosition === position}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }

    </div >
  )
}

export default FrontCover