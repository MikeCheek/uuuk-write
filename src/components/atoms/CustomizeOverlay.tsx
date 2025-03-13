import React, { useRef, useEffect, useState } from 'react';

interface CustomizeOverlayProps {
  onColorChange: (part: string, color: string) => void;
}

const CustomizeOverlay: React.FC<CustomizeOverlayProps> = ({ onColorChange }) => {

  const positions = {
    SidebarSmall: { x: -600, y: -300, name: "sidebar" },
    Front: { x: 400, y: 150, name: "cover" },
  }

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
    <>
      {Object.entries(positions).map(([part, pos]) => {
        return (<>
          <div key={part} className="z-50 absolute text-white w-60 flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg" style={{ left: pos.x, top: pos.y }}>
            <p>Customize {pos.name} color</p>
            <div className="flex flex-row gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  className="rounded-full hover:scale-105 transition-transform duration-100 w-8 h-6 border-[1px] border-white"
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(part, color)}
                />
              ))}
            </div>
          </div>
        </>
        )
      })}
    </>
  );
};

export default CustomizeOverlay;
