import React, { useState, useRef, useEffect } from 'react'; // Added hooks
import { getFontSizeClass, getPositionClasses } from '../../utilities/arenaHelpers';
import { AgendaFormat, Collection, ColorOption, CoverImageTemplate, ExtendedTextPosition, FontSize, Module, TextPosition } from '../../utilities/arenaSettings';
import Logo from '../atoms/Logo';

const Preview3D = (
  {
    noExtra = false,
    modules,
    format,
    previewTransform, // Note: Ensure this doesn't already have a conflicting rotate() or it will be overwritten
    previewSize,
    coverZOffset,
    frontCoverColor,
    backCoverColor,
    frontCoverTemplate,
    frontCoverCollection,
    templateImage,
    frontCoverText,
    frontCoverFontSize,
    frontCoverPosition,
    backCoverText,
    backCoverFontSize,
    backCoverPosition,
    frontCoverTextColor,
    backCoverTextColor
  }:
    {
      noExtra?: boolean;
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
      frontCoverCollection: Collection;
      templateImage: string;
      frontCoverText: string;
      frontCoverFontSize: FontSize;
      frontCoverPosition: ExtendedTextPosition;
      backCoverText: string;
      backCoverFontSize: FontSize;
      backCoverPosition: TextPosition;
      frontCoverTextColor: ColorOption;
      backCoverTextColor: ColorOption;
    }
) => {
  // --- INTERACTION STATE ---
  const [rotation, setRotation] = useState({ x: 0, y: 0 }); // Initial generic angle
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;

    setRotation((prev) => ({
      x: prev.x - deltaY * 0.5, // Drag up/down rotates X axis (inverted feel usually better)
      y: prev.y + deltaX * 0.5, // Drag left/right rotates Y axis
    }));

    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setRotation({ x: 0, y: 0 });
  }, [previewTransform]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - lastMousePos.current.x;
      const deltaY = clientY - lastMousePos.current.y;

      setRotation((prev) => ({
        x: prev.x - deltaY * 0.4, // Sensitivity
        y: prev.y + deltaX * 0.4,
      }));

      lastMousePos.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // --- CALCULATIONS ---
  const pxPerUnit = 18;
  const baseTotalWidthPx = previewSize.spineWidthRem * pxPerUnit;
  const singleModuleThicknessPx = baseTotalWidthPx / modules.length;
  const singleModuleThicknessRem = previewSize.spineWidthRem / modules.length;

  const totalRealWidthPx = modules.reduce((acc, mod) => {
    return acc + (mod.isDouble ? singleModuleThicknessPx * 2 : singleModuleThicknessPx);
  }, 0) - 2; // -2px is only for visual fine-tuning to prevent visual intersections

  const dynamicCoverOffset = totalRealWidthPx / 2;
  let runningZOffset = -dynamicCoverOffset;

  // Page block textures
  const pageTexture = 'repeating-linear-gradient(180deg, #fdfdfd 0px, #fdfdfd 1px, #f4f4f4 2px, #f4f4f4 3px)';
  const pageTextureVertical = 'repeating-linear-gradient(90deg, #fdfdfd 0px, #fdfdfd 1px, #f4f4f4 2px, #f4f4f4 3px)';
  const vInset = format === 'A7' ? 4 : 10;
  const hInset = format === 'A7' ? 4 : 10;

  return (
    <>
      {
        !noExtra &&
        <h2 className="text-2xl font-semibold mb-6 text-white">Anteprima ({format})</h2>
      }

      {/* 1. Added event handlers to the container 
         2. Added cursor styles 
      */}
      <div
        style={{ perspective: '1000px', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
      // onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves area
      >
        <div
          className={`relative transition-transform duration-75 ease-out ${previewSize.container}`}
          // Note: duration-700 changed to duration-75 or 0 for instant drag response
          style={{
            ...previewTransform,
            // We append our dynamic rotation to whatever transform was passed in
            transform: `${previewTransform?.transform || ''} rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {/* --- WHITE PAGES BLOCK --- */}
          {/* TOP */}
          {format !== 'A7' && (
            <div
              className="absolute left-0"
              style={{
                top: `${vInset}px`,
                height: `${totalRealWidthPx}px`,
                width: `calc(100% - ${hInset}px)`,
                transformOrigin: 'top',
                transform: `translateZ(-${dynamicCoverOffset}px) rotateX(90deg)`,
                background: pageTexture,
                backfaceVisibility: 'hidden'
              }}
            />
          )}

          {/* BOTTOM */}
          <div
            className="absolute left-0"
            style={{
              bottom: `${vInset}px`,
              height: `${totalRealWidthPx}px`,
              width: `calc(100% - ${hInset}px)`,
              transformOrigin: 'bottom',
              transform: `translateZ(-${dynamicCoverOffset}px) rotateX(-90deg)`,
              background: pageTexture,
              backfaceVisibility: 'hidden'
            }}
          />

          {/* SIDES */}
          <div
            className="absolute"
            style={{
              right: `${hInset}px`,
              top: `${vInset}px`,
              bottom: `${vInset}px`,
              width: `${totalRealWidthPx}px`,
              transformOrigin: 'right',
              transform: `translateZ(${-dynamicCoverOffset}px) rotateY(90deg)`,
              background: pageTextureVertical,
              backfaceVisibility: 'hidden'
            }}
          />

          {format === 'A7' && (
            <div
              className="absolute"
              style={{
                left: `${hInset}px`,
                top: `${vInset}px`,
                bottom: `${vInset}px`,
                width: `${totalRealWidthPx}px`,
                transformOrigin: 'left',
                transform: `translateZ(-${dynamicCoverOffset}px) rotateY(-90deg)`,
                background: pageTextureVertical,
                backfaceVisibility: 'hidden'
              }}
            />
          )}
          {/* --- END PAGES BLOCK --- */}

          {/* Front Cover */}
          <div
            className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${frontCoverColor.name === 'White' ? 'border border-gray-200' : ''} overflow-hidden `}
            style={{
              transform: `translateZ(${dynamicCoverOffset}px)`,
              backgroundColor: frontCoverColor.color,
              color: frontCoverColor.color,
              // backfaceVisibility: 'hidden' // Optional: hides it if viewed from inside
            }}
          >
            {
              frontCoverCollection === 'M(O_O)D' ?
                <div className="absolute inset-0 flex items-start justify-center">
                  <p className="text-center whitespace-nowrap" style={{
                    color: frontCoverTextColor?.color || 'Black',
                    fontSize: format === 'A7' ? '20px' : format === 'A6' ? '28px' : '36px',
                    marginTop: '30%'
                  }}>
                    {frontCoverTemplate}
                  </p>
                </div>
                :

                frontCoverCollection !== 'Custom' ?
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${templateImage}')`,
                      margin: frontCoverTemplate === 'Occhio' ? '10%' : 0
                    }}
                  ></div>
                  :

                  <div className={`absolute inset-0 flex text-center ${getPositionClasses(frontCoverPosition)}`}
                    style={{ color: frontCoverTextColor?.color || 'black' }}
                  >
                    <p className={`p-1 rounded bg-transparent font-bold ${getFontSizeClass(frontCoverFontSize)}`}>
                      {frontCoverText}
                    </p>
                  </div>
            }
          </div>

          {/* Sidebars (Spine) */}
          {modules.map((mod, index) => {
            const currentThicknessPx = mod.isDouble ? singleModuleThicknessPx * 2 : singleModuleThicknessPx;
            const currentThicknessRem = mod.isDouble ? singleModuleThicknessRem * 2 : singleModuleThicknessRem;
            const startZ = runningZOffset;
            runningZOffset += currentThicknessPx;

            let spineClasses = '';
            let spineTransform = '';
            let spineTextTransform = '';
            let spineStyle = {};

            if (format === 'A7') {
              spineClasses = `absolute top-0 left-0 right-0 rounded-lg shadow-inner transition-colors duration-300 `;
              spineTransform = `rotateX(90deg) translateY(${startZ}px) translateZ(-0.5px)`;
              spineStyle = {
                height: `${currentThicknessRem}rem`,
                width: '100%',
                transformOrigin: 'top center',
                transform: spineTransform,
                zIndex: index + 1,
                backgroundColor: mod.sidebarColor.color,
              };
              spineTextTransform = `rotate(0deg)`;
            } else {
              spineClasses = `absolute top-0 left-0 bottom-0 rounded-lg shadow-inner transition-colors duration-300`;
              spineTransform = `rotateY(-90deg) translateX(${startZ}px) translateZ(0.5px)`;
              spineStyle = {
                width: `${currentThicknessRem}rem`,
                height: '100%',
                transformOrigin: 'left center',
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
                <div className={`absolute top-0 left-0 ${format === 'A7' ? 'w-4 h-full rounded-l-lg' : 'w-full h-12 rounded-t-lg'} bg-black`}>
                  <div className={`absolute top-1 left-1 right-1 ${format === 'A7' ? 'h-3/4 top-1/2 -translate-y-1/2 w-1' : 'h-1'} rounded-sm`}
                    style={{ backgroundColor: mod.sidebarColor.color }}></div>
                </div>
                <span
                  className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center ${mod.sidebarColor.color.substring(1, 3) === 'ff' ? 'text-black' : 'text-white'} font-medium whitespace-nowrap ${previewSize.text}`}
                  style={{
                    transform: spineTextTransform,
                    writingMode: format === 'A7' ? 'unset' : 'vertical-rl',
                    textOrientation: format === 'A7' ? 'unset' : 'mixed',
                    lineHeight: format !== 'A7' ? `${currentThicknessRem}rem` : 'initial',
                  }}
                >
                  {mod.sidebarText}
                </span>
                <div className={`absolute bottom-0 right-0 ${format === 'A7' ? 'w-4 h-full rounded-r-lg' : 'w-full h-12 rounded-b-lg'} bg-black`}>
                  <div className={`absolute bottom-1 left-1 right-1 ${format === 'A7' ? 'top-1/2 -translate-y-1/2 h-3/4 w-1' : 'h-1'} rounded-sm`}
                    style={{ backgroundColor: mod.sidebarColor.color }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* Back Cover */}
          <div
            className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${backCoverColor.name === 'Bianco' ? 'border border-gray-200' : ''} overflow-hidden flex items-center justify-center`}
            style={{
              transform: `rotateY(-180deg) translateZ(${dynamicCoverOffset}px)`,
              zIndex: -1,
              backgroundColor: backCoverColor.color,
              color: backCoverColor.color
            }}
          >
            <div className={`absolute inset-0 flex text-center ${getPositionClasses(backCoverPosition)}`}
              style={{
                transform: 'rotateY(180deg)',
                color: backCoverTextColor?.color || 'black'
              }}>
              <p className={`p-1 rounded bg-transparent scale-x-[-1] font-bold ${getFontSizeClass(backCoverFontSize)}`}>
                {backCoverText}
              </p>
            </div>
            {/* <div className="absolute top-1 bottom-1 right-0 w-1 bg-white opacity-80 rounded-r-sm"></div> */}
            <Logo className="sticky w-[40px]" onlyBlack />
            {/* <div className="absolute top-2 bottom-2 right-1 w-px bg-gray-300 opacity-60"></div> */}
          </div>

        </div>
      </div>

      {
        !noExtra &&

        <p className="mt-8 text-sm text-gray-500 italic">L'anteprima qui mostrata è una bozza.</p>
      }
    </>
  )
}

export default Preview3D