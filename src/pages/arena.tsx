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
import Layout from '../components/organisms/Layout';
import Review from '../components/arena/Review';
import Preview3D from '../components/arena/Preview3D';

// --- Main Component ---
const Arena = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [format, setFormat] = useState<AgendaFormat>('A5');

  // Front Cover States
  const [frontCoverColor, setFrontCoverColor] = useState<ColorOption>(colors[0]);
  const [frontCoverCollection, setFrontCoverCollection] = useState<Collection>('Triadic');
  const [frontCoverTemplate, setFrontCoverTemplate] = useState<CoverImageTemplate>('None');
  const [frontCoverText, setFrontCoverText] = useState<string>('');
  // --- NEW FRONT COVER TEXT STATES ---
  const [frontCoverFontSize, setFrontCoverFontSize] = useState<FontSize>('Medio');
  const [frontCoverPosition, setFrontCoverPosition] = useState<TextPosition>('Centro');

  // Module States
  const [modules, setModules] = useState<Module[]>([
    { id: useId(), sidebarColor: colors[4], sidebarText: 'Idee', pageInterior: 'Righe' }
  ]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Back Cover States
  const [backCoverColor, setBackCoverColor] = useState<ColorOption>(colors[0]);
  const [backCoverText, setBackCoverText] = useState<string>('');
  // --- NEW BACK COVER TEXT STATES ---
  const [backCoverFontSize, setBackCoverFontSize] = useState<FontSize>('Medio');
  const [backCoverPosition, setBackCoverPosition] = useState<TextPosition>('Centro');
  // --- Handlers ---
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (steps[currentStep] === 'Sidebars') {
        setActiveModuleIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (steps[currentStep] === 'Copertina Posteriore') {
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
        pageInterior: 'Righe',
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
    const totalSpineWidthRem = modules.length * baseSpineWidth * 0.35;

    switch (format) {
      case 'A7': return {
        container: 'w-24 h-36', text: 'text-[6px]', spineWidthRem: totalSpineWidthRem, //* 0.7, 
        coverTextSize: 'text-xs'
      };
      case 'A6': return {
        container: 'w-32 h-48', text: 'text-[8px]', spineWidthRem: totalSpineWidthRem, //* 0.85, 
        coverTextSize: 'text-sm'
      };
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
      case 'Formato':
      case 'Copertina Anteriore':
      case 'Revisione':
        stepRotation = 'rotateY(-25deg)';
        break;
      case 'Sidebars':
        if (format === 'A7') {
          stepRotation = 'rotateY(0deg)';
          baseRotation = 'rotateX(-45deg)';
        }
        else
          stepRotation = 'rotateY(80deg)';
        break;
      case 'Copertina Posteriore':
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
    <Layout showCustomCursor={false}>
      <div className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center font-sans">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 animate-fadeIn">
          <span className="text-beige">Build Your </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-purple to-magenta drop-shadow-sm">
            UUUK
          </span>
        </h1>

        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl animate-fadeIn">
          {/* Customization Options Panel */}
          <div className="lg:w-1/2 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Step {currentStep + 1}: {steps[currentStep]}</h2>
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
              <Review
                format={format}
                frontCoverColor={frontCoverColor}
                frontCoverCollection={frontCoverCollection}
                frontCoverTemplate={frontCoverTemplate}
                frontCoverText={frontCoverText}
                frontCoverFontSize={frontCoverFontSize}
                frontCoverPosition={frontCoverPosition}
                modules={modules}
                backCoverColor={backCoverColor}
                backCoverText={backCoverText}
                backCoverFontSize={backCoverFontSize}
                backCoverPosition={backCoverPosition}
              />
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
                <Checkout metadata={{
                  format,
                  frontCoverColor,
                  frontCoverCollection,
                  frontCoverTemplate,
                  frontCoverText,
                  frontCoverFontSize,
                  frontCoverPosition,
                  modules,
                  backCoverColor,
                  backCoverText,
                  backCoverFontSize,
                  backCoverPosition,
                }} />
              )}
            </div>
          </div>

          {/* 3D Preview Panel (Updated for text size/position) */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-xl shadow-lg min-h-[400px]">
            <Preview3D
              modules={modules}
              format={format}
              previewTransform={previewTransform}
              previewSize={previewSize}
              coverZOffset={coverZOffset}
              frontCoverColor={frontCoverColor}
              backCoverColor={backCoverColor}
              frontCoverTemplate={frontCoverTemplate}
              templateImagePath={templateImagePath}
              frontCoverText={frontCoverText}
              frontCoverFontSize={frontCoverFontSize}
              frontCoverPosition={frontCoverPosition}
              backCoverText={backCoverText}
              backCoverFontSize={backCoverFontSize}
              backCoverPosition={backCoverPosition}
            />
          </div>
        </div>
      </div>
      <p className="text-beige w-full text-center pb-10 animate-fadeIn">⚠️ Questa pagina è ancora in fase di sviluppo. Gli ordini effettuati qui non verranno presi in considerazione e non saremo responsabili per eventuali problemi derivanti dall'utilizzo. ⚠️</p>
    </Layout>
  );
};

export default Arena;