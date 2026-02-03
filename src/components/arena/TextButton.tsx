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
      className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${active ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 bg-gray-100 hover:border-indigo-300'}`}
    >
      {text}
    </button>
  )
}

export default TextButton