import type { ExtendedTextPosition, Metadata, Module } from '../utilities/arenaSettings';
import React, { CSSProperties, useState, useId, useMemo, useEffect } from 'react';
import { ShoppingCart, X, RotateCcw, Play } from 'lucide-react'; // Suggested icon library
import {
  AgendaFormat, ColorOption, colors, Collection, CoverImageTemplate, FontSize, TextPosition, MAX_MODULES, formats, fontSizes, textPositions, collections, pageInteriors, steps,
  getRandomPreset,
  getPresetFromKey,
  getPresetFromId
} from '../utilities/arenaSettings';
import {
  getCoverTemplateImagePath, getTemplatesForCollection,

} from '../utilities/arenaHelpers';
import ProgressBar from '../components/arena/ProgressBar';
import BackCover from '../components/arena/BackCover';
import Checkout from '../components/arena/Checkout';
import Format from '../components/arena/Format';
import FrontCover from '../components/arena/FrontCover';
import Modules from '../components/arena/Modules';
import Review from '../components/arena/Review';
import Modal from '../components/atoms/Modal';
import Layout from '../components/organisms/Layout';
import Preview3DWrapper from '../components/arena/Preview3DWrapper';

const LOCAL_STORAGE_KEY = 'uuuk_agenda_draft';

const Arena = () => {
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

  const preset: Metadata = queryParams.has('preset_id') ?
    getPresetFromId(Number(queryParams.get('preset_id')!))
    : getPresetFromKey("Punto A5")!;

  const step = queryParams.has('paynow') ? steps.length - 1 : preset.currentStep || 0;

  const [currentStep, setCurrentStep] = useState(step);
  const [format, setFormat] = useState<AgendaFormat>(preset.format || 'A5');

  // Front Cover States
  const [frontCoverColor, setFrontCoverColor] = useState<ColorOption>(preset.frontCover.color || colors[0]);
  const [frontCoverCollection, setFrontCoverCollection] = useState<Collection>(preset.frontCover.collection || 'Custom');
  const [frontCoverTemplate, setFrontCoverTemplate] = useState<CoverImageTemplate>(preset.frontCover.template || undefined);
  const [frontCoverText, setFrontCoverText] = useState<string>(preset.frontCover.text || '');
  const [frontCoverFontSize, setFrontCoverFontSize] = useState<FontSize>(preset.frontCover.fontSize || 'Medio');
  const [frontCoverPosition, setFrontCoverPosition] = useState<ExtendedTextPosition>(preset.frontCover.position || 'Sotto');
  const [frontCoverTextColor, setFrontCoverTextColor] = useState<ColorOption>(preset.frontCover.textColor || colors[2]);

  // Modules State
  const [modules, setModules] = useState<Module[]>(preset.modules.length > 0 ? preset.modules : [
    { id: 'initial-mod', sidebarColor: colors[4], sidebarText: 'Idee', pageInterior: 'Righe' }
  ]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Back Cover States
  const [backCoverColor, setBackCoverColor] = useState<ColorOption>(preset.backCover.color || colors[0]);
  const [backCoverText, setBackCoverText] = useState<string>(preset.backCover.text || '');
  const [backCoverFontSize, setBackCoverFontSize] = useState<FontSize>(preset.backCover.fontSize || 'Medio');
  const [backCoverPosition, setBackCoverPosition] = useState<TextPosition>(preset.backCover.position || 'Sotto');
  const [backCoverTextColor, setBackCoverTextColor] = useState<ColorOption>(preset.backCover.textColor || colors[2]);

  // New UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<any>(null);

  // 1. ORGANIZE DATA IN METADATA OBJECT
  const metadata: Metadata = useMemo(() => ({
    format,
    frontCover: { color: frontCoverColor, collection: frontCoverCollection, template: frontCoverTemplate, text: frontCoverText, fontSize: frontCoverFontSize, position: frontCoverPosition, textColor: frontCoverTextColor },
    modules,
    backCover: { color: backCoverColor, text: backCoverText, fontSize: backCoverFontSize, position: backCoverPosition, textColor: backCoverTextColor },
    lastUpdated: undefined,
    currentStep,
    id: preset.id || -1
  }), [format, frontCoverColor, frontCoverCollection, frontCoverTemplate, frontCoverText, frontCoverFontSize, frontCoverPosition, frontCoverTextColor, modules, backCoverColor, backCoverText, backCoverFontSize, backCoverPosition, backCoverTextColor, currentStep]);

  // 2. LOCALSTORAGE: LOAD ON MOUNT
  // useEffect(() => {

  //   metadata.lastUpdated = new Date().toISOString(); // Update lastUpdated on every change

  //   const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (saved && !queryParams.has('paynow')) {
  //     setPendingDraft(JSON.parse(saved));
  //     setShowResumeModal(true);
  //   }
  // }, []);

  // // 3. LOCALSTORAGE: SAVE ON CHANGE
  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(metadata));
  // }, [metadata]);

  const handleResume = () => {
    if (pendingDraft) {
      setFormat(pendingDraft.format);
      setFrontCoverColor(pendingDraft.frontCover.color);
      setFrontCoverCollection(pendingDraft.frontCover.collection);
      setFrontCoverTemplate(pendingDraft.frontCover.template);
      setFrontCoverText(pendingDraft.frontCover.text);
      setFrontCoverFontSize(pendingDraft.frontCover.fontSize);
      setFrontCoverPosition(pendingDraft.frontCover.position);
      setModules(pendingDraft.modules);
      setBackCoverColor(pendingDraft.backCover.color);
      setBackCoverText(pendingDraft.backCover.text);
      setBackCoverFontSize(pendingDraft.backCover.fontSize);
      setBackCoverPosition(pendingDraft.backCover.position);
      setFrontCoverTextColor(pendingDraft.frontCover.textColor);
      setBackCoverTextColor(pendingDraft.backCover.textColor);
      setCurrentStep(pendingDraft.currentStep || 0);
    }
    setShowResumeModal(false);
  };

  const handleRestart = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setShowResumeModal(false);
  };

  // Helper for Sidebar content
  const SummaryItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="mb-4 border-b border-gray-700 pb-2">
      <span className="text-xs text-gray-400 block uppercase tracking-widest">{label}</span>
      <span className="text-white font-medium">{value ?? 'Nessun ' + label}</span>
    </div>
  );

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
    if (modules.length < MAX_MODULES && !(modules.filter(m => m.isDouble).length > 0 && modules.length >= MAX_MODULES - 1)) {
      const newModule: Module = {
        id: Date.now().toString(),
        sidebarColor: colors[Math.floor(Math.random() * (colors.length - 1))],
        sidebarText: `Sidebar ${modules.length + 1}`,
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

  const availableTemplates = useMemo(() => {
    return getTemplatesForCollection(frontCoverCollection);
  }, [frontCoverCollection]);

  const activeModule = modules[activeModuleIndex];
  const coverZOffset = Math.min(modules.length * 1.5, 10);
  const templateImagePath = getCoverTemplateImagePath(format, frontCoverCollection, frontCoverTemplate);

  const previewProduct = {
    modules,
    format,
    frontCover: {
      color: frontCoverColor,
      collection: frontCoverCollection,
      template: frontCoverTemplate,
      text: frontCoverText,
      fontSize: frontCoverFontSize,
      position: frontCoverPosition,
      textColor: frontCoverTextColor
    },
    backCover: {
      color: backCoverColor,
      text: backCoverText,
      fontSize: backCoverFontSize,
      position: backCoverPosition,
      textColor: backCoverTextColor
    },
    currentStep: 0,
    id: preset.id || -1
  };

  return (
    <Layout showCustomCursor={false}>
      {/* RESUME MODAL */}
      <Modal show={showResumeModal} onClose={() => setShowResumeModal(false)} showCursor>
        <div className="flex flex-col items-center text-center p-4">
          <h3 className="text-2xl font-bold text-beige mb-4 uppercase">Bentornato!</h3>
          <p className="text-white mb-8">Abbiamo trovato una sessione non completata. Vuoi riprendere da dove avevi lasciato?</p>
          <div className="flex gap-4">
            <button onClick={handleRestart} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red/20 text-red border border-red hover:bg-red hover:text-white transition-all">
              <RotateCcw size={18} /> Ricomincia
            </button>
            <button onClick={handleResume} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg transition-all">
              <Play size={18} /> Riprendi
            </button>
          </div>
        </div>
      </Modal>

      {/* SHOPPING CART BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-yellow rounded-full shadow-strong hover:scale-110 transition-transform text-black"
      >
        <ShoppingCart size={24} />
        {/* <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {modules.length + 2}
        </span> */}
      </button>

      {/* CART SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900 z-[1001] shadow-2xl transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart size={20} className="text-yellow" /> Dettagli Agenda
            </h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
            <SummaryItem label="Formato" value={format} />
            <SummaryItem label="Colore Copertina" value={frontCoverColor.name} />
            <SummaryItem label="Testo Copertina" value={frontCoverText || 'Nessuno'} />
            <SummaryItem label="Collezione" value={frontCoverCollection} />
            <SummaryItem label="Template Copertina" value={frontCoverTemplate} />
            <SummaryItem label="Sidebar Selezionate" value={`${modules.length} Sidebar`} />
            <div className="pl-4 border-l-2 border-purple/30 mb-6">
              {modules.map((m, i) => (
                <div key={m.id} className="text-sm text-gray-300 mb-1">
                  {i + 1}. {m.sidebarText} ({m.pageInterior})
                </div>
              ))}
            </div>
            <SummaryItem label="Testo Posteriore" value={backCoverText || 'Nessuno'} />
          </div>

          <button
            disabled={currentStep === steps.length - 1}
            onClick={() => { setIsSidebarOpen(false); setCurrentStep(steps.length - 1); }}
            className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors mt-4"
          >
            Vai al Checkout
          </button>
        </div>
      </div>

      {/* Overlay when sidebar open */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="min-h-screen bg-black mt-16 md:mt-0 p-4 md:p-8 flex flex-col items-center font-sans">
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
                frontCoverTextColor={frontCoverTextColor}
                setFrontCoverTextColor={setFrontCoverTextColor}
                frontCoverFontSize={frontCoverFontSize}
                textPositions={textPositions}
                setFrontCoverPosition={setFrontCoverPosition}
                frontCoverPosition={frontCoverPosition}
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
                backCoverTextColor={backCoverTextColor}
                setBackCoverTextColor={setBackCoverTextColor}
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

            {
              currentStep === steps.length - 1 ? (
                <Checkout metadata={metadata} />
              ) : <></>
            }
          </div>

          {/* 3D Preview Panel (Updated for text size/position) */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-xl shadow-lg min-h-[400px]">
            <Preview3DWrapper product={previewProduct} />
          </div>
        </div>
      </div>
      <div className="absolute py-16 flex justify-between items-center z-10">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors fixed bottom-4 left-4"
        >
          Indietro
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-semibold fixed bottom-4 right-4"
          >
            Avanti
          </button>
        ) : <></>}
      </div>
      <p className="text-beige md:mx-48 text-center pb-10 -z-10 animate-fadeIn">⚠️ Questa pagina è ancora in fase di sviluppo. Gli ordini effettuati qui non verranno presi in considerazione e non saremo responsabili per eventuali problemi derivanti dall'utilizzo. ⚠️</p>
    </Layout>
  );
};

export default Arena;