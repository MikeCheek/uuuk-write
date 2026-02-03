import React from 'react'
import { ColorOption } from '../../utilities/arenaSettings'

const ColorButton = (
  {
    name,
    color,
    onClick,
    active
  }:
    {
      name: string,
      color: ColorOption['color'],
      onClick: () => void,
      active: boolean
    }
) => {
  return (
    <button
      key={name}
      onClick={onClick}
      className={`w-10 h-10 rounded-full border-2 transition-all ${active ? 'ring-2 ring-offset-2 ring-blue border-white' : 'border-black border-[1px] hover:border-gray-300'}`}
      title={name}
      style={{ backgroundColor: color }}
    />
  )
}

export default ColorButton