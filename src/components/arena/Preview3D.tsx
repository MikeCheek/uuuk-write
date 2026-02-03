import React from 'react'
import { getFontSizeClass, getPositionClasses } from '../../utilities/arenaHelpers';
import { AgendaFormat, ColorOption, CoverImageTemplate, FontSize, Module, TextPosition } from '../../utilities/arenaSettings';

const Preview3D = (
  {
    modules,
    format,
    previewTransform,
    previewSize,
    coverZOffset,
    frontCoverColor,
    backCoverColor,
    frontCoverTemplate,
    templateImagePath,
    frontCoverText,
    frontCoverFontSize,
    frontCoverPosition,
    backCoverText,
    backCoverFontSize,
    backCoverPosition,
  }:
    {
      modules: Module[];
      format: AgendaFormat;
      previewTransform: React.CSSProperties;
      previewSize: {
        container: string;
        spineWidthRem: number;
        text: string;
        coverTextSize: string;
      };
      coverZOffset: number;
      frontCoverColor: ColorOption;
      backCoverColor: ColorOption;
      frontCoverTemplate: CoverImageTemplate;
      templateImagePath: string;
      frontCoverText: string;
      frontCoverFontSize: FontSize;
      frontCoverPosition: TextPosition;
      backCoverText: string;
      backCoverFontSize: FontSize;
      backCoverPosition: TextPosition;
    }
) => {

  // 1. Calculate dimensions in pixels
  const totalSpineWidthPx = previewSize.spineWidthRem * 18;
  const moduleThicknessRem = previewSize.spineWidthRem / modules.length;
  const moduleThicknessPx = totalSpineWidthPx / modules.length;

  // 2. Determine the offset for the covers (Half the total thickness)
  const dynamicCoverOffset = totalSpineWidthPx / 2;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-white">Anteprima ({format})</h2>
      <div style={{ perspective: '1000px' }}>
        <div
          className={`relative transition-transform duration-700 ease-out ${previewSize.container}`}
          style={previewTransform}
        >
          {/* Front Cover */}
          <div
            className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${frontCoverColor.name === 'White' ? 'border border-gray-200' : ''} overflow-hidden `}
            style={{
              transform: `translateZ(${dynamicCoverOffset}px)`, // Pushed forward by half thickness
              backgroundColor: frontCoverColor.color,
              color: frontCoverColor.color
            }}
          >
            {frontCoverTemplate !== 'None' && (
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${templateImagePath}')` }}
              ></div>
            )}
            <div className={`absolute inset-0 flex text-center text-black ${getPositionClasses(frontCoverPosition)}`}>
              <p className={`p-1 rounded bg-transparent font-bold ${getFontSizeClass(frontCoverFontSize)}`}>
                {frontCoverText}
              </p>
            </div>
          </div>

          {/* Multiple Sidebars/Spines */}
          {modules.map((mod, index) => {

            // LOGIC FIX:
            // We calculate the starting position (Z-depth) for this specific module.
            // Start at the Back (-Offset) and add the thickness of previous modules.
            const startZ = -dynamicCoverOffset + (index * moduleThicknessPx);

            let spineClasses = '';
            let spineTransform = '';
            let spineTextTransform = '';
            let spineStyle = {};

            if (format === 'A7') {
              // --- A7 TOP SPINE ---
              spineClasses = `absolute top-0 left-0 right-0 rounded-lg shadow-inner transition-colors duration-300 `;

              // 1. Rotate X 90deg to lay flat on top.
              // 2. translateY(${startZ}px): Move along the DEPTH (which is local Y after rotation).
              // 3. translateZ(-0.5px): Slight visual adjustment to align flush with cover edge.
              spineTransform = `rotateX(90deg) translateY(${startZ}px) translateZ(-0.5px)`;

              spineStyle = {
                height: `${moduleThicknessRem}rem`, // The "Thickness" of the slice is its Height in A7
                width: '100%',
                transformOrigin: 'top center', // Pivot from the top edge
                transform: spineTransform,
                zIndex: index + 1,
                backgroundColor: mod.sidebarColor.color,
              };
              spineTextTransform = `rotate(0deg)`;
            } else {
              // --- A5 / A6 SIDE SPINE ---
              spineClasses = `absolute top-0 left-0 bottom-0 rounded-lg shadow-inner transition-colors duration-300`;

              // 1. Rotate Y -90deg to stand on the left.
              // 2. translateX(${startZ}px): Move along the DEPTH (which is local X after rotation).
              // 3. translateZ(0.5px): Slight visual adjustment to push it slightly "out" to left edge.
              // Note: We REMOVED 'translateX(-50%)' because we are positioning exactly from the edge now.
              spineTransform = `rotateY(-90deg) translateX(${startZ}px) translateZ(0.5px)`;

              spineStyle = {
                width: `${moduleThicknessRem}rem`, // The "Thickness" of the slice is its Width in A5/A6
                height: '100%',
                transformOrigin: 'left center', // Pivot from the left edge
                transform: spineTransform,
                zIndex: index + 1,
                backgroundColor: mod.sidebarColor.color,
              };
              spineTextTransform = 'rotate(180deg)';
            }

            return (
              <div
                key={mod.id}
                className={spineClasses}
                style={spineStyle}
              >
                {/* Text displayed only on the last module (Front-most) */}

                <span
                  className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white font-medium whitespace-nowrap ${previewSize.text}`}
                  style={{
                    transform: spineTextTransform,
                    writingMode: format === 'A7' ? 'unset' : 'vertical-rl',
                    textOrientation: format === 'A7' ? 'unset' : 'mixed',
                    // Force line-height to equal the FULL spine width, so text centers visually over the whole group
                    lineHeight: format !== 'A7' ? `${previewSize.spineWidthRem}rem` : 'initial',
                    // top: format === 'A7' ? '0' : 'initial',
                  }}
                >
                  {mod.sidebarText}
                </span>
              </div>
            );
          })}

          {/* Back Cover */}
          <div
            className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${backCoverColor.name === 'Bianco' ? 'border border-gray-200' : ''} overflow-hidden `}
            style={{
              transform: `rotateY(-180deg) translateZ(${dynamicCoverOffset}px)`, // Pushed back by half thickness
              zIndex: -1,
              backgroundColor: backCoverColor.color,
              color: backCoverColor.color
            }}
          >
            <div className={`absolute inset-0 flex text-center text-black ${getPositionClasses(backCoverPosition)}`}
              style={{ transform: 'rotateY(180deg)' }}>
              <p className={`p-1 rounded bg-transparent scale-x-[-1] font-bold ${getFontSizeClass(backCoverFontSize)}`}>
                {backCoverText}
              </p>
            </div>
            {/* Page edges */}
            <div className="absolute top-1 bottom-1 right-0 w-1 bg-white opacity-80 rounded-r-sm"></div>
            <div className="absolute top-2 bottom-2 right-1 w-px bg-gray-300 opacity-60"></div>
          </div>

        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500 italic">L'anteprima qui mostrata è una bozza.</p>
    </>
  )
}

export default Preview3D