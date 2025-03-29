import React, { useState } from 'react';
import Stepper from './Stepper';
import { BookOpen, Image, Sidebar, Palette } from 'lucide-react';

const Overlay = () => {
  const stepsData = [
    { label: 'Choose your format', icon: <BookOpen /> },
    { label: 'Choose your cover', icon: <Image /> },
    { label: 'Choose your sidebar', icon: <Sidebar /> },
    { label: 'Choose your color', icon: <Palette /> },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const steps = stepsData.map((step, index) => ({
    label: step.label,
    completed: index < currentStep,
    icon: step.icon,
  }));

  const handleNextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const duration = 500;

  return (
    <div
      className={`w-full h-full absolute z-50 top-10 left-0 flex items-center justify-center transition-opacity duration-${duration} ${currentStep < stepsData.length ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <Stepper steps={steps} activeStep={currentStep} />
      <button
        onClick={handleNextStep}
        className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded bg-transparent border-[1px] border-white hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Next
      </button>
      <button
        onClick={handlePreviousStep}
        className="fixed bottom-10 left-10 bg-blue-500 text-white px-4 py-2 rounded bg-transparent border-[1px] border-white hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Previous
      </button>
    </div>
  );
};

export default Overlay;
