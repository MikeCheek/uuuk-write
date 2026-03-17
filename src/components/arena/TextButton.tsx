import React from 'react'

const TextButton = (
  {
    text,
    onClick,
    active
  }:
    {
      text: string,
      onClick: () => void,
      active: boolean
    }
) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${active ? 'border-blue bg-blue text-indigo-100 font-semibold' : 'border-gray-300 bg-gray-100 text-blue hover:border-indigo-300'}`}
    >
      {text}
    </button>
  )
}

export default TextButton