import React, { useState } from 'react'
import Connection from './Connection'

const CustomizePart = ({ name, x, y, width, height, onColorChange, text }: { name: string, x: number, y: number, width: number, height: number, onColorChange: (color: string) => void, text: string }) => {
  const [hovered, setHovered] = useState(false)
  const colors = [
    "#1a1615", // black
    "#4f186b", // purple
    "#3e4db4", // blue
    "#91144e", // magenta
    "#ea1f25", // red
    "#ac6d37", // brown
    "#f1ca00", // yellow
    "#ecddbe", // beige
    "#a3635e"  // redBrick
  ]

  return (
    <div className={`z-50 absolute text-white w-64 flex flex-col gap-4 ${hovered ? 'bg-white/5 border-white/40' : 'bg-white/[0.005] border-white/10'} backdrop-blur-md border rounded-xl p-6 shadow-lg transition-bgColor duration-200`}
      style={{ left: x, top: y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p>{text}</p>
      <div className="flex flex-row gap-2 flex-wrap">
        {colors.map((color) => (
          <button
            key={color}
            className="rounded-full hover:scale-105 transition-transform duration-100 w-8 h-6 border-[1px] border-white/10"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
      <Connection bottom={y < 0} right={x < 0} width={width} height={height} bgColor={hovered ? 'bg-white/40' : 'bg-white/10'} />
    </div>
  )
}

export default CustomizePart