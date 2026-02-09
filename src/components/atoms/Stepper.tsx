import React from 'react';

interface Step {
  icon: React.ReactNode;
  label?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  duration?: number; // Prop-based duration
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, duration = 500 }) => {
  return (
    <nav aria-label="Progress" className="w-full max-w-3xl mx-auto">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = activeStep > index;
          const isActive = activeStep === index;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={index}
              className={`relative flex items-center ${!isLast ? 'flex-1' : 'flex-initial'}`}
            >
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center group">
                <span
                  className={`
                    relative z-20 flex items-center justify-center 
                    w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all 
                    ${isActive
                      ? 'bg-redBrick text-white scale-110 shadow-lg'
                      : isCompleted
                        ? 'bg-black border-2 border-redBrick text-redBrick'
                        : 'bg-beige text-gray-500'}
                  `}
                  style={{ transitionDuration: `${duration}ms` }}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="flex items-center justify-center">
                      {step.icon}
                    </span>
                  )}
                </span>

                {/* Optional Label - Positioned absolutely to avoid layout shifts */}
                {step.label && (
                  <span
                    className={`absolute -bottom-8 whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-opacity
                      ${isActive ? 'opacity-100 text-redBrick' : 'opacity-40 text-gray-500'}
                    `}
                    style={{ transitionDuration: `${duration}ms` }}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4 h-1 bg-beige rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-redBrick origin-left transition-transform ease-out"
                    style={{
                      transform: `scaleX(${isCompleted ? 1 : 0})`,
                      transitionDuration: `${duration}ms`,
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default Stepper;