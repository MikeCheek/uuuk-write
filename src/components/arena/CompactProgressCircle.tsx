import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompactProgressCircle = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  const size = 60; // Increased slightly for shadow padding
  const strokeWidth = 5;
  const center = size / 2;
  const radius = (size - strokeWidth - 8) / 2; // Extra padding for the shadow
  const circumference = 2 * Math.PI * radius;

  const progress = currentStep / (steps.length - 1);
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="fixed top-6 left-6 z-50 flex flex-col items-center">
      {/* Circle Container */}
      <div className="relative group" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
          <defs>
            {/* Soft shadow filter for the ring */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#ecddbe"
            strokeWidth={strokeWidth}
            className="opacity-40"
          />

          {/* Animated Progress Path */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#6b4423"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            strokeLinecap="round"
            filter="url(#shadow)"
          />
        </svg>

        {/* Inner Counter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center leading-none">
            <span className="text-xs font-bold text-brown drop-shadow-sm">
              {currentStep + 1}
              <span className="text-[10px] opacity-40 mx-0.5">/</span>
              {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Label Container - Absolute to prevent shifting */}
      <div className="absolute top-full mt-2 w-40 justify-center pointer-events-none hidden md:flex">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] uppercase tracking-[0.15em] font-bold text-brown text-center bg-black/5 px-2 py-0.5 rounded backdrop-blur-sm"
          >
            {steps[currentStep]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompactProgressCircle;