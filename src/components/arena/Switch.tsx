import React from 'react'

const Switch = ({
  isOn,
  toggleSwitch,
  textOn = '3D',
  textOff = 'Flat'
}: {
  isOn: boolean
  toggleSwitch: () => void
  textOn?: string
  textOff?: string
}) => {
  return (
    <div className="flex items-center">
      <button
        onClick={toggleSwitch}
        className="relative flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-full shadow-inner-sm w-[70px] h-9 transition-all hover:border-blue/30"
        aria-label="Toggle view mode"
      >
        {/* Sliding Indicator */}
        <div
          className={`absolute h-7 rounded-full bg-blue shadow-md transition-all duration-300 ease-out ${isOn ? 'w-[32px] translate-x-[30px]' : 'w-[36px] -translate-x-[2px]'
            }`}
        />

        {/* Labels */}
        <div className="relative flex w-full justify-between text-[10px] font-bold uppercase tracking-wider">
          <span
            className={`flex-1 text-center transition-colors duration-200 ${!isOn ? 'text-beige' : 'text-gray-500'
              }`}
          >
            {textOff}
          </span>
          <span
            className={`flex-1 text-center transition-colors duration-200 ${isOn ? 'text-beige' : 'text-gray-500'
              }`}
          >
            {textOn}
          </span>
        </div>
      </button>
    </div>
  )
}

export default Switch