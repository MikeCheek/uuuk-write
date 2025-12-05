import React from 'react'
import { Collection, ColorOption, CoverImageTemplate, FontSize, TextPosition } from '../../utilities/arenaSettings';

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
      {/* Cover Text */}
      <div>
        <label htmlFor="frontCoverText" className="block text-gray-600 mb-1 font-medium">Front Cover Text (Optional):</label>
        <input
          type="text"
          id="frontCoverText"
          value={frontCoverText}
          onChange={(e) => setFrontCoverText(e.target.value)}
          maxLength={30}
          placeholder="e.g. My Custom Agenda"
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
                onClick={() => setFrontCoverFontSize(size)}
                className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${frontCoverFontSize === size ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
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
                onClick={() => setFrontCoverPosition(position)}
                className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${frontCoverPosition === position ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Chooser (omitted for brevity) */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">1. Choose Collection:</p>
        <div className="flex flex-wrap gap-3">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => {
                setFrontCoverCollection(c);
                setFrontCoverTemplate('None' as CoverImageTemplate);
              }}
              className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${frontCoverCollection === c ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Cover Template (omitted for brevity) */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">2. Cover Image Template:</p>
        <div className="flex flex-wrap gap-3">
          {availableTemplates.map((t) => (
            <button
              key={t}
              onClick={() => setFrontCoverTemplate(t)}
              className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${frontCoverTemplate === t ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Color (omitted for brevity) */}
      <div>
        <p className="text-gray-600 mb-2 font-medium">Front Cover Color:</p>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setFrontCoverColor(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${c.class} ${frontCoverColor.name === c.name ? 'ring-2 ring-offset-2 ring-indigo-500 border-white' : 'border-black border-[1px] hover:border-gray-300'}`}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FrontCover