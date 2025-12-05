import React from 'react'

const ProgressBar = (
  {
    steps,
    currentStep
  }: {
    steps: string[];
    currentStep: number;
  }
) => {
  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="flex justify-between mb-1">
        {steps.map((step, index) => (
          <span key={step} className={`text-xs font-medium ${index <= currentStep ? 'text-brown' : 'text-gray-400'}`}>
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-brown h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 0.5) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar