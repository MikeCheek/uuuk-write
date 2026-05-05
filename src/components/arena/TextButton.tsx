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
      className={`px-3 py-1 rounded-md text-sm border transition-all shadow-sm shadow-gray-600 ${active ? 'bg-gray-200 text-blue border-none font-semibold' : 'text-white border-none bg-transparent hover:bg-gray-200/10'}`}
    >
      {text}
    </button>
  )
}

export default TextButton