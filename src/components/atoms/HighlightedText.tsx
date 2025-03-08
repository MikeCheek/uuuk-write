import React from "react";

const HighlightedText = ({ text = "Default" }) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-[1] font-bold">{text}</span>
      <span
        className="animated-marker will-change-[clip-path] absolute left-[-0.1em] right-[-0.1em] bg-[rgba(255,235,59,0.5)] z-0 -rotate-2 top-[0.2em] bottom-0"
        style={{
          clipPath: `polygon(
            0% 5%,
            0% 0%,
            0% 5%,
            0% 0%,
            0% 5%,
            0% 0%,
            0% 5%,
            0% 95%,
            0% 100%,
            0% 95%,
            0% 100%,
            0% 95%,
            0% 100%,
            0% 95%
          )`,
        }}
      ></span>
    </span>
  );
};

export default HighlightedText;
