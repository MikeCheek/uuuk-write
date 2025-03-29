import React from 'react';

interface Step {
  icon: React.ReactNode;
  label?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => {

  const duration = 5000

  return (
    <ol className="flex items-center justify-center w-3/4">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`relative flex items-center ${index == 0 ? "justify-start" : index == steps.length - 1 ? "justify-end" : "justify-center"} flex-1`}
        >
          {index > 0 && (
            <span
              className={`absolute left-0 -z-10 top-1/2 transform -translate-y-1/2 w-3/4 h-1 rounded-e-full ${activeStep >= index
                ? `bg-redBrick animate-[grow_${duration}ms_ease-in-out]`
                : 'bg-beige'
                }`}
            ></span>
          )}
          {index < steps.length - 1 && (
            <span
              className={`absolute right-0 -z-10 top-1/2 transform -translate-y-1/2 w-3/4 h-1 rounded-s-full ${activeStep > index
                ? `bg-redBrick animate-[grow_${duration}ms_ease-in-out]`
                : 'bg-beige'
                }`}
            ></span>
          )}
          <span
            className={`flex items-center z-10 justify-center px-2 mx-2 min-w-10 h-10 rounded-full lg:h-12 lg:min-w-12 shrink-0 transition-transform duration-${duration} ${activeStep == index ?
              'bg-redBrick text-black scale-110'
              :
              activeStep > index
                ? 'border-2 border-redBrick text-redBrick bg-black rounded-full scale-110'
                : 'bg-beige text-black'
              }`}
          >
            {activeStep > index ? (
              <svg
                className="w-3.5 h-3.5 lg:w-4 lg:h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            ) : (
              step.icon
            )}
            {index === activeStep && step.label && (
              <span className={`ml-2 text-sm font-medium text-black pr-2 transition-opacity duration-${duration} opacity-100`}>
                {step.label}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default Stepper;