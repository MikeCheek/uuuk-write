import React, { useEffect } from 'react'
import { Collection, ColorOption, colors, colorsMood, CoverImageTemplate, ExtendedTextPosition, extendedTextPositions, FontSize, TextPosition } from '../../utilities/arenaSettings';
import ColorButton from './ColorButton';
import TextButton from './TextButton';
import InputText from './InputText';

const FrontCover = (
  {
    frontCoverText,
    setFrontCoverText,
    frontCoverTextColor,
    setFrontCoverTextColor,
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
  }: {
    frontCoverText: string;
    setFrontCoverText: (text: string) => void;
    frontCoverTextColor: ColorOption;
    setFrontCoverTextColor: (color: ColorOption) => void;
    frontCoverFontSize: FontSize;
    setFrontCoverFontSize: (size: FontSize) => void;
    frontCoverPosition: ExtendedTextPosition;
    setFrontCoverPosition: (position: ExtendedTextPosition) => void;
    frontCoverCollection: Collection;
    setFrontCoverCollection: (collection: Collection) => void;
    frontCoverTemplate: CoverImageTemplate;
    setFrontCoverTemplate: (template: CoverImageTemplate) => void;
    frontCoverColor: ColorOption;
    setFrontCoverColor: (color: ColorOption) => void;
    fontSizes: FontSize[];
    textPositions: ExtendedTextPosition[];
    collections: Collection[];
    availableTemplates: CoverImageTemplate[];
  }
) => {

  useEffect(() => {
    if (frontCoverCollection !== 'Custom' && !availableTemplates.includes(frontCoverTemplate!)) {
      setFrontCoverTemplate(availableTemplates[0])
      if (frontCoverCollection === 'Triadic')
        setFrontCoverColor(colors.find(c => c.name === 'Bianco')!)
    }
  }, [frontCoverCollection, availableTemplates, setFrontCoverTemplate, colors, setFrontCoverColor])

  const currentCoverColorOptions = frontCoverCollection === 'M(O_O)D' ? colorsMood : colors

  return (
    <div className="space-y-6">
      {/* Collection Chooser */}
      <div>
        <p className="text-gray-300 mb-2 font-medium">Scegli la collezione:</p>
        <div className="flex flex-wrap gap-3">
          {collections.map((c) => (
            <TextButton
              key={c}
              text={c}
              onClick={() => {
                setFrontCoverCollection(c);
                if (c === 'Custom') {
                  setFrontCoverTemplate(undefined);
                }
              }}
              active={frontCoverCollection === c}
            />
          ))}
        </div>
      </div>

      {/* Cover Template */}
      {
        frontCoverCollection !== 'Custom' && (
          <div>
            <p className="text-gray-300 mb-2 font-medium">Modello copertina:</p>
            <div className="flex flex-wrap gap-3">
              {availableTemplates.map((t) => (
                <TextButton
                  key={t}
                  text={t!}
                  onClick={() => setFrontCoverTemplate(t)}
                  active={frontCoverTemplate === t}
                />
              ))}
            </div>
          </div>)
      }


      {
        frontCoverCollection !== 'Triadic' && (
          <div>
            <p className="text-gray-300 mb-2 font-medium">Colore Copertina:</p>
            <div className="flex flex-wrap gap-3">
              {currentCoverColorOptions.map((c) => (
                <ColorButton key={c.name} name={c.name}
                  color={c.color}
                  active={frontCoverColor.name === c.name}
                  onClick={() => setFrontCoverColor(c)} />
              ))}
            </div>
          </div>
        )
      }

      {/* Front Cover Text */}
      {
        frontCoverCollection === 'Custom' && (
          <>
            <div>
              <InputText
                label="Testo Copertina:"
                id="frontCoverText"
                value={frontCoverText}
                onChange={(e) => setFrontCoverText(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Font Size Chooser */}
              <div>
                <p className="text-gray-300 mb-2 font-medium">Dimensione Testo:</p>
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
                <p className="text-gray-300 mb-2 font-medium">Posizione Testo:</p>
                <div className="flex flex-wrap gap-2">
                  {extendedTextPositions.map((position) => (
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
          </>
        )

      }

      {
        frontCoverCollection === 'Custom' || frontCoverCollection === 'M(O_O)D' ? (
          <div>
            <p className="text-gray-300 mb-2 font-medium">Colore Testo:</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <ColorButton key={c.name} name={c.name}
                  color={c.color}
                  active={frontCoverTextColor.name === c.name}
                  onClick={() => setFrontCoverTextColor(c)} />
              ))}
            </div>
          </div>
        ) : <></>
      }

    </div >
  )
}

export default FrontCover