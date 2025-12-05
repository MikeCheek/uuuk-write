import React from 'react'
import { ColorOption, FontSize, TextPosition } from '../../utilities/arenaSettings';

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
      {/* Back Cover Text */}
      <div>
        <label htmlFor="backCoverText" className="block text-gray-600 mb-1 font-medium">Back Cover Text (Optional):</label>
        <input
          type="text"
          id="backCoverText"
          value={backCoverText}
          onChange={(e) => setBackCoverText(e.target.value)}
          maxLength={30}
          placeholder="e.g. Important Dates"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Text Customization Section (NEW) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Font Size Chooser */}
        <div>
          <p className="text-gray-600 mb-2 font-medium">Text Size:</p>
          <div className="flex flex-wrap gap-2">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => setBackCoverFontSize(size)}
                className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${backCoverFontSize === size ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Text Position Chooser */}
        <div>
          <p className="text-gray-600 mb-2 font-medium">Text Position:</p>
          <div className="flex flex-wrap gap-2">
            {textPositions.map((position) => (
              <button
                key={position}
                onClick={() => setBackCoverPosition(position)}
                className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${backCoverPosition === position ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color (omitted for brevity) */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">Back Cover Color:</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setBackCoverColor(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${c.class} ${backCoverColor.name === c.name ? 'ring-2 ring-offset-2 ring-indigo-500 border-white' : 'border-transparent hover:border-gray-300'}`}
              title={c.name}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default BackCover