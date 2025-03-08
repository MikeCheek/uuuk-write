import React, { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import HandDrawn from '../../assets/hand-drawn-circle.svg'

const CircledText = ({ text = "Default" }: { text?: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(100);
  const [textHeight, setTextHeight] = useState(0);

  const padding = 50

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth + padding); // Add padding
      setTextHeight(textRef.current.offsetHeight + padding); // Add padding
    }
  }, [text]);

  return (
    <span className="relative inline-block">
      {/* The Text */}
      <span
        ref={textRef}
        className="text-white font-bold relative z-10"
      >
        {text}
      </span>

      {/* Wrapper for the SVG */}
      <span
        className="absolute top-0 left-0"
        style={{
          width: "100%", // Ensure the wrapper takes up the full width of the container
          height: "100%", // Ensure the wrapper takes up the full height of the container
          transform: `translate(-${padding / 2}px, -${padding / 2}px)`,
          opacity: 0.5,
        }}
      >
        {/* Imported SVG */}
        <motion.span
          className="w-full h-full"
          style={{
            width: "100%", // Set width to 100% of the parent container
            height: "100%", // Set height to 100% of the parent container
          }}
        >
          <HandDrawn
            width={textWidth}
            height={textHeight}
            stroke="yellow"
          // className="text-yellow opacity-80"
          />
        </motion.span>
      </span>
    </span>
  );
};

export default CircledText;
