import type { ExtendedTextPosition, Metadata, Module } from '../utilities/arenaSettings';
import React, { useState, useMemo } from 'react';
import { RotateCcw, Play, ArrowBigLeftIcon } from 'lucide-react';
import { navigate } from 'gatsby';
import {
  AgendaFormat, ColorOption, colors, Collection, CoverImageTemplate, FontSize, TextPosition, MAX_MODULES, formats, fontSizes, textPositions, collections, steps,
  getPresetFromKey,
  getPresetFromId
} from '../utilities/arenaSettings';
import {
  getTemplatesForCollection,

} from '../utilities/arenaHelpers';
import CompactProgressCircle from '../components/arena/CompactProgressCircle';
import BackCover from '../components/arena/BackCover';
import Format from '../components/arena/Format';
import FrontCover from '../components/arena/FrontCover';
import Modules from '../components/arena/Modules';
import Review from '../components/arena/Review';
import Modal from '../components/atoms/Modal';
import Layout from '../components/organisms/Layout';
import Preview3DWrapper from '../components/arena/Preview3DWrapper';
import { HeadProps } from 'gatsby';
import Seo from '../components/atoms/Seo';

const LOCAL_STORAGE_KEY = 'uuuk_agenda_draft';

const Arena = () => {
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

  const preset: Metadata = queryParams.has('preset_id') ?
    getPresetFromId(Number(queryParams.get('preset_id')!))
    : getPresetFromKey("Punto A5")!;

  const isCustom = queryParams.has('custom') ? queryParams.get('custom') === 'true' : false;

  const selectedProductId = queryParams.get('pid') || preset.productId;
  const selectedPriceId = queryParams.get('price_id') || preset.priceId;
  const selectedName = queryParams.get('pname') || preset.name;
  const selectedPrice = queryParams.get('pprice')
    ? Number(queryParams.get('pprice'))
    : preset.price;
  const selectedImage = queryParams.get('pimage') || (typeof preset.image === 'string' ? preset.image : undefined);

  const customSteps = isCustom ? steps : steps.filter(s => s !== 'Copertina Anteriore');

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
    { id: 'initial-mod', sidebarColor: colors[4], sidebarText: 'Idee' }
  ]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Back Cover States
  const [backCoverColor, setBackCoverColor] = useState<ColorOption>(preset.backCover.color || colors[0]);
  const [backCoverText, setBackCoverText] = useState<string>(preset.backCover.text || '');
  const [backCoverFontSize, setBackCoverFontSize] = useState<FontSize>(preset.backCover.fontSize || 'Medio');
  const [backCoverPosition, setBackCoverPosition] = useState<TextPosition>(preset.backCover.position || 'Sotto');
  const [backCoverTextColor, setBackCoverTextColor] = useState<ColorOption>(preset.backCover.textColor || colors[2]);

  // New UI States
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<any>(null);

  // 1. ORGANIZE DATA IN METADATA OBJECT
  const metadata: Metadata = useMemo(() => ({
    format,
    frontCover: { color: frontCoverColor, collection: frontCoverCollection, template: frontCoverTemplate, text: frontCoverText, fontSize: frontCoverFontSize, position: frontCoverPosition, textColor: frontCoverTextColor },
    modules,
    backCover: { color: backCoverColor, text: backCoverText, fontSize: backCoverFontSize, position: backCoverPosition, textColor: backCoverTextColor },
    name: selectedName || `${format} - ${frontCoverCollection} - ${frontCoverTemplate ?? 'Custom'}`,
    productId: selectedProductId,
    priceId: selectedPriceId,
    price: selectedPrice,
    image: selectedImage,
    lastUpdated: undefined,
    currentStep,
    id: preset.id || -1
  }), [format, frontCoverColor, frontCoverCollection, frontCoverTemplate, frontCoverText, frontCoverFontSize, frontCoverPosition, frontCoverTextColor, modules, backCoverColor, backCoverText, backCoverFontSize, backCoverPosition, backCoverTextColor, currentStep, selectedName, selectedProductId, selectedPriceId, selectedPrice, selectedImage, preset.id]);

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

  const handleNext = () => {
    if (currentStep < customSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (customSteps[currentStep] === 'Sidebars') {
        setActiveModuleIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (customSteps[currentStep] === 'Copertina Posteriore') {
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
        sidebarText: `Sidebar ${modules.length + 1}`
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
    name: selectedName || `${format} - ${frontCoverCollection} - ${frontCoverTemplate ?? 'Custom'}`,
    productId: selectedProductId,
    priceId: selectedPriceId,
    price: selectedPrice,
    image: selectedImage,
    currentStep: 0,
    id: preset.id || -1
  } as Metadata;

  return (
    <Layout showCustomCursor={false} shoppingCart>
      <button onClick={() => navigate(-1)} className="fixed left-4 top-4 rounded-full border border-white/15 bg-[#0f1a36]/80 p-4 text-gray-300 backdrop-blur-sm transition-all hover:border-[#f97316]/40 hover:text-white z-40">
        <ArrowBigLeftIcon size={30} className="transition-colors" />
      </button>
      {/* RESUME MODAL */}
      <Modal show={showResumeModal} onClose={() => setShowResumeModal(false)} showCursor>
        <div className="flex flex-col items-center text-center p-4">
          <h3 className="mb-4 text-2xl font-black uppercase text-[#f6f8ff]">Bentornato!</h3>
          <p className="mb-8 text-[#c4d4ff]">Abbiamo trovato una sessione non completata. Vuoi riprendere da dove avevi lasciato?</p>
          <div className="flex gap-4">
            <button onClick={handleRestart} className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/10 px-6 py-3 text-red-200 transition-all hover:bg-red-500/20">
              <RotateCcw size={18} /> Ricomincia
            </button>
            <button onClick={handleResume} className="flex items-center gap-2 rounded-lg border border-[#f97316]/35 bg-[#f97316] px-6 py-3 font-bold text-[#1e293b] shadow-lg transition-all hover:bg-[#fb8a35]">
              <Play size={18} /> Riprendi
            </button>
          </div>
        </div>
      </Modal>

      <div className="pt-24 flex min-h-screen flex-col items-center bg-[#070d1e] bg-[radial-gradient(circle_at_top,_#152f5d_0%,_#070d1e_60%)] p-4 font-sans text-white md:mt-0 md:p-8">
        <h1 className="mb-8 text-4xl font-black uppercase tracking-tight animate-fadeIn md:text-6xl">
          <span className="text-[#f6f8ff]">Personalizza il tuo </span>
          <span className="bg-gradient-to-r from-[#f97316] via-[#ffb170] to-[#9ad0ff] bg-clip-text text-transparent">
            UUUK
          </span>
        </h1>

        {/* Progress Bar */}
        {/* <CompactProgressCircle steps={customSteps} currentStep={currentStep} /> */}

        <div className="flex w-full max-w-6xl flex-col gap-8 animate-fadeIn lg:flex-row">
          {/* Customization Options Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-6 shadow-[0_16px_40px_rgba(6,10,20,0.45)] lg:w-1/2">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-white">
              {/* Step {currentStep + 1}:  */}
              {customSteps[currentStep]}</h2>
            <hr className="mb-4 border-white/10" />

            {
              customSteps[currentStep] === 'Formato' ? (
                <Format formats={formats} setFormat={setFormat} format={format} />
              ) : customSteps[currentStep] === 'Copertina Anteriore' && isCustom ? (
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
              ) : customSteps[currentStep] === 'Sidebars' && activeModule ? (
                <Modules
                  modules={modules}
                  setActiveModuleIndex={setActiveModuleIndex}
                  activeModuleIndex={activeModuleIndex}
                  addModule={addModule}
                  removeModule={removeModule}
                  updateModule={updateModule}
                  colors={colors}
                />
              ) : customSteps[currentStep] === 'Copertina Posteriore' ? (
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
              ) : customSteps[currentStep] === 'Revisione' ?
                <Review item={previewProduct} />
                : <></>}
          </div>

          {/* 3D Preview Panel (Updated for text size/position) */}
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-6 shadow-[0_16px_40px_rgba(6,10,20,0.45)] lg:w-1/2">
            <Preview3DWrapper product={previewProduct} />
          </div>
        </div>
      </div>
      <div className="absolute py-16 flex justify-between items-center z-10">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="fixed bottom-1/2 left-4 -translate-y-1/2 rounded-full border border-white/20 bg-[#0f1b3c]/90 px-4 py-3 text-[#d2ddfb] transition-colors hover:border-[#f97316]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {'<'}
        </button>
        {currentStep < customSteps.length - 1 ? (
          <button
            onClick={handleNext}
            className="fixed bottom-1/2 right-4 -translate-y-1/2 rounded-full border border-[#f97316]/35 bg-[#f97316] px-6 py-3 font-black text-[#1e293b] transition-colors hover:bg-[#fb8a35]"
          >
            {'>'}
          </button>
        ) : <></>}
      </div>
    </Layout>
  );
};

export default Arena;

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'Arena'}
      pathname={location.pathname}
      description={"Personalizza la tua UUUK con il nostro configuratore 3D. Scegli formato, copertina, moduli interni e molto altro per creare l'agenda perfetta per te. Esplora la nostra arena e dai vita alla tua UUUK unica e su misura."}
      noIndex
    />
  )
}