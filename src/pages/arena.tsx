import React, { CSSProperties } from 'react';
import { useState, useId, useMemo } from 'react';

// Define types for customization options
type AgendaFormat = 'A5' | 'A6' | 'A7';
type PageInterior = 'Lined' | 'Dotted' | 'Blank';
type Collection = 'M(O_O)D' | 'Triadic';
type MoodTemplate = 'Angry' | 'Bored' | 'Excited' | 'Happy' | 'Sad' | 'Shock' | 'None';
type TriadicTemplate = 'Flusso' | 'Occhio' | 'Punto' | 'None';
type CoverImageTemplate = MoodTemplate | TriadicTemplate;

interface ColorOption {
  name: string;
  class: string;
  textClass: string;
}

interface Module {
  id: string; // Use unique ID for React keys
  sidebarColor: ColorOption;
  sidebarText: string;
  pageInterior: PageInterior;
}

// --- Available Options ---
const formats: AgendaFormat[] = ['A5', 'A6', 'A7'];
const colors: ColorOption[] = [
  { name: 'Sky', class: 'bg-sky-500', textClass: 'text-sky-500' },
  { name: 'Rose', class: 'bg-rose-500', textClass: 'text-rose-500' },
  { name: 'Emerald', class: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { name: 'Amber', class: 'bg-amber-500', textClass: 'text-amber-500' },
  { name: 'Slate', class: 'bg-slate-700', textClass: 'text-slate-700' },
  { name: 'White', class: 'bg-white', textClass: 'text-gray-900' },
];

const imageAssets = {
  'M(O_O)D': {
    'A6': {
      'Angry': '/images/collezioni/M(O_O)D/A6/Angry.png',
      'Bored': '/images/collezioni/M(O_O)D/A6/Bored.png',
      'Excited': '/images/collezioni/M(O_O)D/A6/Excited.png',
      'Happy': '/images/collezioni/M(O_O)D/A6/Happy.png',
      'Sad': '/images/collezioni/M(O_O)D/A6/Sad.png',
      'Shock': '/images/collezioni/M(O_O)D/A6/Shock.png',
      'None': '',
    },
    'A7': {
      'Angry': '/images/collezioni/M(O_O)D/A7/Angry.png',
      'Bored': '/images/collezioni/M(O_O)D/A7/Bored.png',
      'Excited': '/images/collezioni/M(O_O)D/A7/Excited.png',
      'Happy': '/images/collezioni/M(O_O)D/A7/Happy.png',
      'Sad': '/images/collezioni/M(O_O)D/A7/Sad.png',
      'Shock': '/images/collezioni/M(O_O)D/A7/Shock.png',
      'None': '',
    }
  },
  'Triadic': {
    'A6': {
      'Flusso': '/images/collezioni/Triadic/A6/Flusso.png',
      'Occhio': '/images/collezioni/Triadic/A6/Occhio.png',
      'Punto': '/images/collezioni/Triadic/A6/Punto.png',
      'None': '',
    },
    'A7': {
      'Flusso': '/images/collezioni/Triadic/A7/Flusso.png',
      'Occhio': '/images/collezioni/Triadic/A7/Occhio.png',
      'Punto': '/images/collezioni/Triadic/A7/Punto.png',
      'None': '',

    }
  }
};

const pageInteriors: PageInterior[] = ['Lined', 'Dotted', 'Blank'];
const collections: Collection[] = imageAssets ? Object.keys(imageAssets) as Collection[] : [];
const moodTemplates: MoodTemplate[] = imageAssets ? Object.keys(imageAssets['M(O_O)D']['A6']) as MoodTemplate[] : [];
const triadicTemplates: TriadicTemplate[] = imageAssets ? Object.keys(imageAssets['Triadic']['A6']) as TriadicTemplate[] : [];

const MAX_MODULES = 3;

const steps = [
  'Format', 'Front Cover', 'Modules', 'Back Cover', 'Review'
];

const getCoverTemplateImagePath = (format: AgendaFormat, collection: Collection, template: CoverImageTemplate): string => {
  if (template === 'None') return '';

  const formatFolder = format === 'A5' ? 'A6' : format; // A5 uses A6 folder structure

  try {
    // Narrow by collection so TypeScript knows which template union is valid
    if (collection === 'M(O_O)D') {
      const key = template as MoodTemplate;
      const assets = imageAssets['M(O_O)D'] as Record<string, Record<MoodTemplate | 'None', string>>;
      return assets[formatFolder][key];
    } else {
      const key = template as TriadicTemplate;
      const assets = imageAssets['Triadic'] as Record<string, Record<TriadicTemplate | 'None', string>>;
      return assets[formatFolder][key];
    }
  } catch (e) {
    console.error(`Image not found for: ${collection}/${formatFolder}/${template}`);
    return '';
  }
};

const getTemplatesForCollection = (collection: Collection): CoverImageTemplate[] => {
  if (collection === 'M(O_O)D') return moodTemplates;
  if (collection === 'Triadic') return triadicTemplates;
  return []; // Should not happen
};

// --- Main Component ---
const Arena = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [format, setFormat] = useState<AgendaFormat>('A5');

  // Front Cover States
  const [frontCoverColor, setFrontCoverColor] = useState<ColorOption>(colors[0]);
  const [frontCoverCollection, setFrontCoverCollection] = useState<Collection>('M(O_O)D'); // NEW STATE
  const [frontCoverTemplate, setFrontCoverTemplate] = useState<CoverImageTemplate>('None');
  const [frontCoverText, setFrontCoverText] = useState<string>('My Awesome Agenda');

  // Module States
  const [modules, setModules] = useState<Module[]>([
    { id: useId(), sidebarColor: colors[4], sidebarText: 'Section 1', pageInterior: 'Lined' }
  ]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Back Cover States
  const [backCoverColor, setBackCoverColor] = useState<ColorOption>(colors[0]);
  const [backCoverText, setBackCoverText] = useState<string>('Notes and Dreams'); // New state for text

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

  const handleAddToCart = () => {
    alert('Agenda added to cart! (Not really, this is a demo)');
  };

  // Module Handlers (remain mostly the same)
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

  const getPreviewSizeClasses = () => {
    const baseSpineWidth = 1;
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
    // Base rotation for the 3D effect
    const baseRotation = 'rotateX(10deg)';
    let stepRotation = 'rotateY(-25deg)'; // Default: Show front cover + spine

    switch (steps[currentStep]) {
      case 'Format':
      case 'Front Cover':
      case 'Modules':
      case 'Review':
        stepRotation = 'rotateY(-25deg)'; // Show front and spine
        break;
      case 'Back Cover':
        stepRotation = 'rotateY(160deg)'; // Rotate to show back cover clearly
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
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between mb-1">
          {steps.map((step, index) => (
            <span key={step} className={`text-xs font-medium ${index <= currentStep ? 'text-yellow-400' : 'text-gray-400'}`}>
              {step}
            </span>
          ))}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Customization Options Panel */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black">Step {currentStep + 1}: {steps[currentStep]}</h2>
          <hr className="mb-4" />

          {/* Step 1: Format */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <p className="text-gray-600">Choose your agenda size:</p>
              <div className="flex gap-4">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${format === f ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 hover:border-indigo-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Front Cover (Template, Color, Graphic, Text) */}
          {currentStep === 1 && (
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

              {/* Collection Chooser (NEW) */}
              <div>
                <p className="text-gray-600 mb-2 font-medium">1. Choose Collection:</p>
                <div className="flex flex-wrap gap-3">
                  {collections.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setFrontCoverCollection(c);
                        setFrontCoverTemplate('None' as CoverImageTemplate); // Reset template on collection change
                      }}
                      className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${frontCoverCollection === c ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Template (UPDATED) */}
              <div>
                <p className="text-gray-600 mb-2 font-medium">2. Cover Image Template:</p>
                <div className="flex flex-wrap gap-3">
                  {availableTemplates.map((t) => ( // Use availableTemplates here
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

              {/* Color */}
              <div>
                <p className="text-gray-600 mb-2 font-medium">Front Cover Color:</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setFrontCoverColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${c.class} ${frontCoverColor.name === c.name ? 'ring-2 ring-offset-2 ring-indigo-500 border-white' : 'border-transparent hover:border-gray-300'}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Modules (Same logic) */}
          {currentStep === 2 && activeModule && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 flex-wrap border-b pb-4 mb-4">
                <span className="text-gray-600 font-medium">Modules:</span>
                {modules.map((mod, index) => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(index)}
                    className={`px-3 py-1 rounded-md text-sm border ${activeModuleIndex === index ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-semibold' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}
                  >
                    Module {index + 1}
                  </button>
                ))}
                <button
                  onClick={addModule}
                  disabled={modules.length >= MAX_MODULES}
                  className="px-3 py-1 rounded-md bg-emerald-500 text-white text-sm hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  + Add
                </button>
              </div>

              <h3 className="text-lg font-semibold text-black">Editing Module {activeModuleIndex + 1}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sidebar Customization */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium">Sidebar Settings:</p>
                  {/* Color, Text, Remove buttons here (omitted for brevity, assume original logic) */}
                  <div>
                    <p className="text-gray-600 mb-2 text-sm">Color:</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => updateModule(activeModuleIndex, { sidebarColor: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${c.class} ${activeModule.sidebarColor.name === c.name ? 'ring-2 ring-offset-1 ring-indigo-500 border-white' : 'border-transparent hover:border-gray-300'}`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`sidebarText-${activeModule.id}`} className="block text-gray-600 mb-1 text-sm">Text:</label>
                    <input
                      type="text"
                      id={`sidebarText-${activeModule.id}`}
                      value={activeModule.sidebarText}
                      onChange={(e) => updateModule(activeModuleIndex, { sidebarText: e.target.value })}
                      maxLength={15}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  {modules.length > 1 && (
                    <button
                      onClick={() => removeModule(activeModuleIndex)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 mt-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove Module {activeModuleIndex + 1}
                    </button>
                  )}
                </div>

                {/* Page Interior Customization (omitted for brevity, assume original logic) */}
                <div className="space-y-4">
                  <p className="text-gray-600 font-medium">Page Interior:</p>
                  <div className="flex flex-col gap-2">
                    {pageInteriors.map((p) => (
                      <button
                        key={p}
                        onClick={() => updateModule(activeModuleIndex, { pageInterior: p })}
                        className={`px-3 py-1.5 text-left rounded-lg border-2 transition-all text-sm ${activeModule.pageInterior === p ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 hover:border-indigo-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="w-full h-24 bg-white border border-gray-300 rounded p-2 mt-2 overflow-hidden">
                    {activeModule.pageInterior === 'Lined' && <div className="space-y-2 h-full border-l border-red-200 pl-2"><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div></div>}
                    {activeModule.pageInterior === 'Dotted' && <div className="h-full bg-[radial-gradient(#d1d5db_0.5px,transparent_0.5px)] [background-size:10px_10px]"></div>}
                    {activeModule.pageInterior === 'Blank' && <div className="h-full"></div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Back Cover (Color, Graphic, Text) */}
          {currentStep === 3 && (
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

              {/* Color */}
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
          )}

          {/* Step 5: Review (Updated to include new fields) */}
          {currentStep === 4 && (
            <div className="space-y-4 text-black">
              <h3 className="text-xl font-semibold mb-3">Review Your Creation! ✨</h3>
              <p><strong>Format:</strong> {format}</p>
              <p><strong>Front Cover:</strong> {frontCoverColor.name} Color, "{frontCoverCollection}" Collection, {frontCoverTemplate} Template. Text: "{frontCoverText}"</p>
              <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                <p className="font-semibold">Modules ({modules.length}):</p>
                {modules.map((mod, index) => (
                  <div key={mod.id} className="text-sm">
                    <p><strong>Module {index + 1}:</strong></p>
                    <p className="pl-2">Sidebar: {mod.sidebarColor.name} Color, Text: "{mod.sidebarText}"</p>
                    <p className="pl-2">Pages: {mod.pageInterior}</p>
                  </div>
                ))}
              </div>
              <p><strong>Back Cover:</strong> {backCoverColor.name} Color, Text: "{backCoverText}"</p>
              <p className="mt-4 text-lg font-medium">Ready to add this masterpiece to your cart?</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-semibold flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* 3D Preview Panel (Updated for rotation, text, and image template) */}
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
                  // Using a div with background image for simpler sizing/positioning
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${templateImagePath}')` }}
                    title={`Cover Image: ${frontCoverTemplate}`}
                  ></div>
                )}

                {/* Cover Text */}
                <div className={`absolute inset-0 flex items-center justify-center p-2 text-center text-black ${previewSize.coverTextSize} font-bold`}>
                  <p className="p-1 rounded bg-white bg-opacity-80 backdrop-blur-sm shadow-md">
                    {frontCoverText}
                  </p>
                </div>
              </div>

              {/* Multiple Sidebars/Spines (Same logic) */}
              {modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className={`absolute top-0 left-0 bottom-0 rounded-l-lg shadow-inner transition-colors duration-300 ${mod.sidebarColor.class}`}
                  style={{
                    width: `${previewSize.spineWidthRem / modules.length}rem`,
                    transform: `rotateY(-90deg) translateX(-50%) translateZ(${index * (previewSize.spineWidthRem / modules.length * 16)}px) translateY(0.5px)`, // Offset each spine segment forward along Z
                    transformOrigin: 'left center',
                    zIndex: index + 1, // Ensure layers stack correctly
                  }}
                >
                  {/* Show text only on the last (outermost) spine for clarity */}
                  {index === modules.length - 1 && (
                    <span
                      className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white font-medium whitespace-nowrap ${previewSize.text}`}
                      style={{ transform: 'rotate(90deg)', writingMode: 'vertical-rl', textOrientation: 'mixed', lineHeight: `${previewSize.spineWidthRem / modules.length}rem` }}
                    >
                      {mod.sidebarText}
                    </span>
                  )}
                </div>
              )).reverse()}

              {/* Back Cover */}
              <div
                className={`absolute inset-0 rounded-lg shadow-2xl transition-colors duration-300 ${backCoverColor.class} ${backCoverColor.name === 'White' ? 'border border-gray-200' : ''} overflow-hidden ${backCoverColor.textClass}`}
                style={{
                  transform: `rotateY(-180deg) translateZ(${coverZOffset}px)`, // Rotate 180 degrees to face back, and move out by cover thickness
                  zIndex: -1
                }}
              >
                {/* Cover Text - Rotated to be readable from the back */}
                <div className={`absolute inset-0 flex items-center justify-center p-2 text-center text-black ${previewSize.coverTextSize} font-bold`}
                  style={{ transform: 'rotateY(180deg)' }}>
                  <p className="p-1 rounded bg-white bg-opacity-80 backdrop-blur-sm shadow-md scale-x-[-1]">
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