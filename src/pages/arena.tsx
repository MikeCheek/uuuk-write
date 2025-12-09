import type { Module } from '../utilities/arenaSettings';
import React, { CSSProperties } from 'react';
import { useState, useId, useMemo } from 'react';
import {
  AgendaFormat, ColorOption, colors, Collection, CoverImageTemplate, FontSize, TextPosition, MAX_MODULES, formats, fontSizes, textPositions, collections, pageInteriors, steps
} from '../utilities/arenaSettings';
import {
  getCoverTemplateImagePath, getTemplatesForCollection, getPositionClasses, getFontSizeClass
} from '../utilities/arenaHelpers';
import Format from '../components/arena/Format';
import FrontCover from '../components/arena/FrontCover';
import Modules from '../components/arena/Modules';
import BackCover from '../components/arena/BackCover';
import ProgressBar from '../components/arena/ProgressBar';
import Checkout from '../components/arena/Checkout';

// --- Main Component ---
const Arena = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [format, setFormat] = useState<AgendaFormat>('A5');

  // Front Cover States
  const [frontCoverColor, setFrontCoverColor] = useState<ColorOption>(colors[0]);
  const [frontCoverCollection, setFrontCoverCollection] = useState<Collection>('Triadic');
  const [frontCoverTemplate, setFrontCoverTemplate] = useState<CoverImageTemplate>('None');
  const [frontCoverText, setFrontCoverText] = useState<string>('My Awesome Agenda');
  // --- NEW FRONT COVER TEXT STATES ---
  const [frontCoverFontSize, setFrontCoverFontSize] = useState<FontSize>('Medium');
  const [frontCoverPosition, setFrontCoverPosition] = useState<TextPosition>('Center');

  // Module States
  const [modules, setModules] = useState<Module[]>([
    { id: useId(), sidebarColor: colors[4], sidebarText: 'Section 1', pageInterior: 'Lined' }
  ]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Back Cover States
  const [backCoverColor, setBackCoverColor] = useState<ColorOption>(colors[0]);
  const [backCoverText, setBackCoverText] = useState<string>('Notes and Dreams');
  // --- NEW BACK COVER TEXT STATES ---
  const [backCoverFontSize, setBackCoverFontSize] = useState<FontSize>('Medium');
  const [backCoverPosition, setBackCoverPosition] = useState<TextPosition>('Center');

  // --- Handlers ---
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (steps[currentStep] === 'Modules') {
        setActiveModuleIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (steps[currentStep] === 'Back Cover') {
        setActiveModuleIndex(modules.length - 1);
      }
    }
  };

  // Module Handlers
  const addModule = () => {
    if (modules.length < MAX_MODULES) {
      const newModule: Module = {
        id: Date.now().toString(),
        sidebarColor: colors[Math.floor(Math.random() * (colors.length - 1))],
        sidebarText: `Section ${modules.length + 1}`,
        pageInterior: 'Lined',
      };
      setModules([...modules, newModule]);
      setActiveModuleIndex(modules.length);
    }
  };

  const removeModule = (indexToRemove: number) => {
    if (modules.length > 1) {
      const newModules = modules.filter((_, index) => index !== indexToRemove);
      setModules(newModules);
      if (activeModuleIndex >= indexToRemove) {
        setActiveModuleIndex(Math.max(0, activeModuleIndex - 1));
      }
    }
  };

  const updateModule = (index: number, updatedProps: Partial<Module>) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], ...updatedProps };
    setModules(newModules);
  };

  // --- END Handlers ---

  const getPreviewSizeClasses = () => {
    const baseSpineWidth = 2;
    const totalSpineWidthRem = modules.length * baseSpineWidth * 0.25;

    switch (format) {
      case 'A7': return { container: 'w-24 h-36', text: 'text-[6px]', spineWidthRem: totalSpineWidthRem * 0.7, coverTextSize: 'text-xs' };
      case 'A6': return { container: 'w-32 h-48', text: 'text-[8px]', spineWidthRem: totalSpineWidthRem * 0.85, coverTextSize: 'text-sm' };
      case 'A5':
      default: return { container: 'w-40 h-56', text: 'text-[10px]', spineWidthRem: totalSpineWidthRem, coverTextSize: 'text-base' };
    }
  };

  const availableTemplates = useMemo(() => {
    return getTemplatesForCollection(frontCoverCollection);
  }, [frontCoverCollection]);

  const previewSize = getPreviewSizeClasses();
  const activeModule = modules[activeModuleIndex];
  const coverZOffset = Math.min(modules.length * 1.5, 10);
  const templateImagePath = getCoverTemplateImagePath(format, frontCoverCollection, frontCoverTemplate);

  // --- Dynamic 3D Transform Logic ---
  const previewTransform = useMemo<CSSProperties>(() => {
    let baseRotation = 'rotateX(10deg)';
    let stepRotation = 'rotateY(-25deg)';

    switch (steps[currentStep]) {
      case 'Format':
      case 'Front Cover':
      case 'Review':
        stepRotation = 'rotateY(-25deg)';
        break;
      case 'Modules':
        if (format === 'A7') {
          stepRotation = 'rotateY(0deg)';
          baseRotation = 'rotateX(-45deg)';
        }
        else
          stepRotation = 'rotateY(80deg)';
        break;
      case 'Back Cover':
        stepRotation = 'rotateY(160deg)';
        break;
      default:
        stepRotation = 'rotateY(-25deg)';
    }

    return {
      transform: `${baseRotation} ${stepRotation}`,
      transformStyle: 'preserve-3d',
    };
  }, [currentStep]);

  // --- JSX Structure ---
  return (
    <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Customize Your UUUK! 📓</h1>

      {/* Progress Bar */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Customization Options Panel */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black">Step {currentStep + 1}: {steps[currentStep]}</h2>
          <hr className="mb-4" />

          {/* Step 1: Format */}
          {currentStep === 0 && (
            <Format formats={formats} setFormat={setFormat} format={format} />
          )}

          {/* Step 2: Front Cover (Template, Color, Graphic, Text) */}
          {currentStep === 1 && (
            <FrontCover
              frontCoverCollection={frontCoverCollection}
              setFrontCoverCollection={setFrontCoverCollection}
              frontCoverTemplate={frontCoverTemplate}
              setFrontCoverTemplate={setFrontCoverTemplate}
              frontCoverColor={frontCoverColor}
              setFrontCoverColor={setFrontCoverColor}
              frontCoverText={frontCoverText}
              setFrontCoverText={setFrontCoverText}
              availableTemplates={availableTemplates}
              fontSizes={fontSizes}
              setFrontCoverFontSize={setFrontCoverFontSize}
              frontCoverFontSize={frontCoverFontSize}
              textPositions={textPositions}
              setFrontCoverPosition={setFrontCoverPosition}
              frontCoverPosition={frontCoverPosition}
              colors={colors}
              collections={collections}
            />
          )}

          {/* Step 3: Modules */}
          {currentStep === 2 && activeModule && (
            <Modules
              modules={modules}
              setActiveModuleIndex={setActiveModuleIndex}
              activeModuleIndex={activeModuleIndex}
              addModule={addModule}
              removeModule={removeModule}
              updateModule={updateModule}
              colors={colors}
              pageInteriors={pageInteriors}
            />
          )}


          {/* Step 4: Back Cover (Color, Graphic, Text) */}
          {currentStep === 3 && (
            <BackCover
              backCoverColor={backCoverColor}
              setBackCoverColor={setBackCoverColor}
              backCoverText={backCoverText}
              setBackCoverText={setBackCoverText}
              backCoverFontSize={backCoverFontSize}
              setBackCoverFontSize={setBackCoverFontSize}
              backCoverPosition={backCoverPosition}
              setBackCoverPosition={setBackCoverPosition}
              fontSizes={fontSizes}
              textPositions={textPositions}
              colors={colors}
            />
          )}

          {/* Step 5: Review (Updated to include new fields) */}
          {currentStep === 4 && (
            <div className="space-y-4 text-black">
              <h3 className="text-xl font-semibold mb-3">Review Your Creation! ✨</h3>
              <p><strong>Format:</strong> {format}</p>

              <div className="border-l-2 border-indigo-200 pl-3">
                <p><strong>Front Cover:</strong></p>
                <ul className="list-disc list-inside pl-4 text-sm space-y-1">
                  <li>Color: {frontCoverColor.name}</li>
                  <li>Collection/Template: "{frontCoverCollection}" / {frontCoverTemplate}</li>
                  <li>Text: "{frontCoverText}"</li>
                  <li>**Text Size:** {frontCoverFontSize}</li>
                  <li>**Text Position:** {frontCoverPosition}</li>
                </ul>
              </div>

              <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                <p className="font-semibold">Modules ({modules.length}):</p>
                {modules.map((mod, index) => (
                  <div key={mod.id} className="text-sm">
                    <p><strong>Module {index + 1}:</strong> Sidebar: {mod.sidebarColor.name} Color, Text: "{mod.sidebarText}" | Pages: {mod.pageInterior}</p>
                  </div>
                ))}
              </div>

              <div className="border-l-2 border-rose-200 pl-3">
                <p><strong>Back Cover:</strong></p>
                <ul className="list-disc list-inside pl-4 text-sm space-y-1">
                  <li>Color: {backCoverColor.name}</li>
                  <li>Text: "{backCoverText}"</li>
                  <li>**Text Size:** {backCoverFontSize}</li>
                  <li>**Text Position:** {backCoverPosition}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors fixed bottom-4 left-4"
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-semibold fixed bottom-4 right-4"
              >
                Next
              </button>
            ) : (
              <Checkout />
            )}
          </div>
        </div>

        {/* 3D Preview Panel (Updated for text size/position) */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-xl shadow-lg min-h-[400px]">
          <h2 className="text-2xl font-semibold mb-6 text-white">Live Preview ({format})</h2>
          <div style={{ perspective: '1000px' }}>
            <div
              className={`relative transition-transform duration-700 ease-out ${previewSize.container}`}
              style={previewTransform} // Dynamic rotation
            >
              {/* Front Cover */}
              <div
                className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${frontCoverColor.class} ${frontCoverColor.name === 'White' ? 'border border-gray-200' : ''} overflow-hidden ${frontCoverColor.textClass}`}
                style={{ transform: `translateZ(${coverZOffset}px)` }}
              >
                {/* Image Template (if selected) */}
                {frontCoverTemplate !== 'None' && (
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${templateImagePath}')` }}
                    title={`Cover Image: ${frontCoverTemplate}`}
                  ></div>
                )}

                {/* Cover Text (UPDATED CLASSES) */}
                <div className={`absolute inset-0 flex text-center text-black ${getPositionClasses(frontCoverPosition)}`}>
                  <p className={`p-1 rounded bg-transparent font-bold ${getFontSizeClass(frontCoverFontSize)}`}>
                    {frontCoverText}
                  </p>
                </div>
              </div>

              {/* Multiple Sidebars/Spines */}
              {modules.map((mod, index) => {
                const moduleWidthRem = previewSize.spineWidthRem / modules.length;

                let spineClasses = '';
                let spineTransform = '';
                let spineTextTransform = '';
                let spineStyle = {};

                if (format === 'A7') {
                  // A7: Modules on the TOP edge
                  // Height becomes the spine thickness, width becomes the full cover width
                  spineClasses = `absolute top-0 left-0 right-0 rounded-t-lg shadow-inner transition-colors duration-300 ${mod.sidebarColor.class}`;
                  spineTransform = `rotateX(90deg) translateY(-50%) translateZ(${(modules.length - 1 - index) * (moduleWidthRem * 16)}px) translateX(0.5px)`;
                  spineStyle = {
                    height: `${moduleWidthRem}rem`, // Spine thickness is now height
                    width: '100%',
                    transformOrigin: 'top center',
                    transform: spineTransform,
                    zIndex: index + 1,
                  };
                  spineTextTransform = `rotate(0deg)`; // Text remains horizontal
                } else {
                  // A5 / A6: Modules on the LEFT side (Spine)
                  spineClasses = `absolute top-0 left-0 bottom-0 rounded-l-lg shadow-inner transition-colors duration-300 ${mod.sidebarColor.class}`;
                  spineTransform = `rotateY(-90deg) translateX(-50%) translateZ(${index * (moduleWidthRem * 16)}px) translateY(0.5px)`;
                  spineStyle = {
                    width: `${moduleWidthRem}rem`, // Spine thickness is width
                    height: '100%',
                    transformOrigin: 'left center',
                    transform: spineTransform,
                    zIndex: index + 1,
                  };
                  spineTextTransform = 'rotate(180deg)'; // Text is rotated for spine
                }

                return (
                  <div
                    key={mod.id}
                    className={spineClasses}
                    style={spineStyle}
                  >
                    {/* Text is only displayed on the last (visible) module */}
                    {index === modules.length - 1 && (
                      <span
                        className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white font-medium whitespace-nowrap ${previewSize.text}`}
                        style={{
                          transform: spineTextTransform,
                          writingMode: format === 'A7' ? 'unset' : 'vertical-rl',
                          textOrientation: format === 'A7' ? 'unset' : 'mixed',
                          // Adjust line height only for A5/A6 vertical text
                          lineHeight: format !== 'A7' ? `${moduleWidthRem}rem` : 'initial',
                          top: format === 'A7' ? '0' : 'initial',
                        }}
                      >
                        {mod.sidebarText}
                      </span>
                    )}
                  </div>
                );
              }).reverse()}

              {/* Back Cover */}
              <div
                className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${backCoverColor.class} ${backCoverColor.name === 'White' ? 'border border-gray-200' : ''} overflow-hidden ${backCoverColor.textClass}`}
                style={{
                  transform: `rotateY(-180deg) translateZ(${coverZOffset}px)`,
                  zIndex: -1
                }}
              >
                {/* Cover Text - Rotated to be readable from the back (UPDATED CLASSES) */}
                <div className={`absolute inset-0 flex text-center text-black ${getPositionClasses(backCoverPosition)}`}
                  style={{ transform: 'rotateY(180deg)' }}>
                  <p className={`p-1 rounded bg-transparent scale-x-[-1] font-bold ${getFontSizeClass(backCoverFontSize)}`}>
                    {backCoverText}
                  </p>
                </div>

                {/* Page edge simulation */}
                <div className="absolute top-1 bottom-1 right-0 w-1 bg-white opacity-80 rounded-r-sm"></div>
                <div className="absolute top-2 bottom-2 right-1 w-px bg-gray-300 opacity-60"></div>
                <div className="absolute top-2 bottom-2 right-[6px] w-px bg-gray-300 opacity-50"></div>
              </div>

            </div>
          </div>
          <p className="mt-8 text-sm text-gray-500 italic">Preview rotates based on the active step.</p>
        </div>
      </div>
    </div>
  );
};

export default Arena;