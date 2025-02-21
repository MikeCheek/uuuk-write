import React, { useEffect, useRef, useState } from "react"

const Cursor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const smoothPositionRef = useRef({ x: 0, y: 0 })
  const requestRef = useRef<number>()

  const [scale, setScale] = useState(1)

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
    }
    document.addEventListener("mousemove", moveCursor)
    return () => {
      document.removeEventListener("mousemove", moveCursor)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      smoothPositionRef.current.x += (positionRef.current.x - smoothPositionRef.current.x) * 0.2
      smoothPositionRef.current.y += (positionRef.current.y - smoothPositionRef.current.y) * 0.2

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${smoothPositionRef.current.x - 20}px, ${smoothPositionRef.current.y - 20}px, 0)`
      }
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  useEffect(() => {
    const handleMouseDown = () => {
      setScale(0.7)
    }
    const handleMouseUp = () => {
      setScale(1.3)
      setTimeout(() => setScale(1), 100)
    }
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed top-0 left-0 z-50 w-full h-full mix-blend-difference isolate no-cursor:hidden"
      style={{
        willChange: "transform",
      }}
    >
      <div
        className="bg-brown rounded-full"
        style={{
          width: "20px",
          height: "20px",
          transform: `scale(${scale})`,
          transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  )
}

export default Cursor
