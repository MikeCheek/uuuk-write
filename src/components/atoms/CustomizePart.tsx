import React, { useState, useEffect, useRef } from 'react'
import Connection from './Connection'

const CustomizePart = ({ name, x, y, width, height, onColorChange, text, setCustomizing, customizing }:
  {
    name: string, x: number, y: number, width: number, height: number,
    onColorChange: (color: string) => void, text: string,
    setCustomizing: () => void, customizing: boolean
  }) => {

  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragThreshold = 5
  const startPos = useRef({ x: 0, y: 0 })
  const draggingStarted = useRef(false)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        startPos.current = { x: e.clientX, y: e.clientY }
      } else if (e instanceof TouchEvent) {
        startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      draggingStarted.current = true
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingStarted.current) return
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
      const dx = clientX - startPos.current.x
      const dy = clientY - startPos.current.y
      if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
        setIsDragging(true)
      }
    }

    const handleMouseUp = () => {
      draggingStarted.current = false
      setIsDragging(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchstart', handleMouseDown)
    document.addEventListener('touchmove', handleMouseMove)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchstart', handleMouseDown)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

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

  const containerStyle = {
    left: x,
    top: y,
    opacity: isDragging ? 0 : 1,
    transition: 'opacity 0.2s'
  }

  const showOnCustomizeClass = `transition-opacity duration-200 ${customizing ? 'opacity-100' : 'opacity-0'}`

  return (
    <div
      className={`z-50 absolute text-white w-64 flex flex-col gap-4 shadow-lg ${!customizing ? "bg-transparent border-none shadow-none" : hovered ? 'bg-white/5 border-white/40' : 'bg-white/[0.005] border-white/10'} backdrop-blur-md border rounded-xl p-6 transition-bgColor duration-200`}
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className={showOnCustomizeClass}>{text}</p>
      <div className={`flex flex-row gap-2 flex-wrap ${showOnCustomizeClass}`}>
        {colors.map((color) => (
          <button
            key={color}
            className="rounded-full hover:scale-105 transition-transform duration-100 w-8 h-6 border-[1px] border-white/10"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
      <Connection
        bottom={y < 0}
        right={x < 0}
        width={width}
        height={height}
        bgColor={hovered ? 'bg-white/40' : 'bg-white/10'}
        customizing={customizing}
        setCustomizing={setCustomizing}
      />
    </div>
  )
}

export default CustomizePart
