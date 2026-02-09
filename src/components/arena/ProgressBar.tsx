import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  // Calculate progress: 0 to 100
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-[70vw] mx-auto py-8">
      {/* Container for the Track and Dots */}
      <div className="relative h-1.5 w-full">
        {/* Main Track - Using your 'bg-beige' */}
        <div className="absolute inset-0 bg-beige rounded-full overflow-hidden">
          {/* Animated Fill - Using your 'bg-brown' */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress === 0 ? 1 : progress}%` }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="h-full bg-brown"
          />
        </div>

        {/* Step Markers: Perfectly aligned with the bar's width */}
        <div className="absolute inset-0 flex justify-between items-center px-0.5 pointer-events-none">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                backgroundColor: i <= currentStep ? '#6b4423' : '#ecddbe ', // Assuming your 'brown' hex, adjust as needed
              }}
              className={`h-4 w-4 rounded-full z-10 transition-colors duration-500 ${i <= currentStep ? 'bg-brown' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Labels Area */}
      <div className="relative mt-4 min-h-[1.5rem]">
        {/* Desktop Labels: Static positions */}
        <div className="hidden md:flex justify-between">
          {steps.map((step, i) => (
            <span
              key={i}
              className={`text-xs transition-colors duration-500 whitespace-nowrap ${i <= currentStep ? 'text-brown font-medium' : 'text-gray-400'
                }`}
            >
              {step}
            </span>
          ))}
        </div>

        {/* Mobile Label: Animates along the X-axis to follow the progress */}
        <div className="md:hidden relative w-full">
          <motion.span
            initial={false}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-0 text-xs text-brown font-bold whitespace-nowrap -translate-x-1/2"
          >
            {steps[currentStep]}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;