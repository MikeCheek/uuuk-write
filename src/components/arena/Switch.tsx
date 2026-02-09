import React from 'react'

const Switch = (
  {
    isOn,
    toggleSwitch,
    textOn = '3D',
    textOff = 'Flat'
  }: {
    isOn: boolean
    toggleSwitch: () => void
    textOn?: string
    textOff?: string
  }
) => {

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleSwitch}
        className={`relative w-14 h-8 rounded-full transition-colors ${isOn ? 'bg-yellow' : 'bg-brown'
          }`}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center text-xs font-semibold ${isOn ? 'translate-x-6' : 'translate-x-0'
            }`}
        >
          {isOn ? textOn : textOff}
        </div>
      </button>
    </div>
  )
}

export default Switch