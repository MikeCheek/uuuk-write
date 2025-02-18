import React, { useEffect, useRef, useState } from "react";

const Cursor = () => {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
    };

    document.addEventListener("mousemove", moveCursor);
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setSmoothPosition((prev) => ({
        x: prev.x + (positionRef.current.x - prev.x) * 0.2,
        y: prev.y + (positionRef.current.y - prev.y) * 0.2,
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none mix-blend-difference fixed top-0 left-0 z-50 w-full h-full isolate">
      {/* First Blob: Original white bordered blob */}
      <div
        className="bg-secondary transition-all duration-[100ms] ease-linear"
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          transform: `translate(${smoothPosition.x - 20}px, ${smoothPosition.y - 20}px)`,
          animation: "blob 10s infinite",
        }}
      />

      {/* Second Blob: Rotated, slightly bigger with a different colour */}
      <div
        className="bg-transparent border-2 border-secondary transition-all duration-[110ms] ease-linear opacity-80"
        style={{
          position: "absolute",
          width: "50px",
          height: "50px",
          transform: `translate(${smoothPosition.x - 25}px, ${smoothPosition.y - 25}px) rotate(45deg)`,
          animation: "blob 10s infinite",
        }}
      />
    </div>
  );
};

export default Cursor;
