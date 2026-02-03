import React from 'react'
import { ColorOption, FontSize, TextPosition } from '../../utilities/arenaSettings';
import ColorButton from './ColorButton';
import TextButton from './TextButton';
import InputText from './InputText';

const BackCover = (
  {
    backCoverText,
    setBackCoverText,
    backCoverFontSize,
    setBackCoverFontSize,
    backCoverPosition,
    setBackCoverPosition,
    backCoverColor,
    setBackCoverColor,
    fontSizes,
    textPositions,
    colors
  }: {
    backCoverText: string;
    setBackCoverText: (text: string) => void;
    backCoverFontSize: FontSize;
    setBackCoverFontSize: (size: FontSize) => void;
    backCoverPosition: TextPosition;
    setBackCoverPosition: (position: TextPosition) => void;
    backCoverColor: ColorOption;
    setBackCoverColor: (color: ColorOption) => void;
    fontSizes: FontSize[];
    textPositions: TextPosition[];
    colors: ColorOption[];
  }

) => {
  return (
    <div className="space-y-6">

      <div>
        <p className="text-gray-600 mb-2 font-medium">Colore Copertina Posteriore:</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <ColorButton key={c.name} name={c.name}
              color={c.color}
              active={backCoverColor.name === c.name}
              onClick={() => setBackCoverColor(c)} />
          ))}
        </div>
      </div>

      {/* Back Cover Text */}
      <div>
        <InputText
          label="Testo Copertina Posteriore (Opzionale):"
          id="backCoverText"
          value={backCoverText}
          onChange={(e) => setBackCoverText(e.target.value)} />
      </div>

      {
        backCoverText.trim() != '' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Font Size Chooser */}
            <div>
              <p className="text-gray-600 mb-2 font-medium">Dimensione Testo:</p>
              <div className="flex flex-wrap gap-2">
                {fontSizes.map((size) => (
                  <TextButton
                    key={size}
                    text={size}
                    onClick={() => setBackCoverFontSize(size)}
                    active={backCoverFontSize === size}
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
                    onClick={() => setBackCoverPosition(position)}
                    active={backCoverPosition === position}
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

export default BackCover