import React, { useRef, useEffect, useState } from 'react';

interface CustomizeOverlayProps {
  onColorChange: (part: string, color: string) => void;
  get3DPosition: (part: string) => { x: number; y: number };
}

const CustomizeOverlay: React.FC<CustomizeOverlayProps> = ({ onColorChange, get3DPosition }) => {
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    const updatePositions = () => {
      setPositions({
        SidebarSmall: get3DPosition('SidebarSmall'),
        Front: get3DPosition('Front'),
        Laces: get3DPosition('Laces'),
      });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);

    return () => window.removeEventListener('resize', updatePositions);
  }, [get3DPosition]);

  return (
    <div className="z-10">
      {Object.entries(positions).map(([part, pos]) => (
        <div key={part} className="annotation" style={{ left: pos.x, top: pos.y }}>
          <p>Customize {part}</p>
          <div className="flex flex-row gap-2">
            {['#FF0000', '#00FF00', '#0000FF', '#FFFFFF'].map((color) => (
              <button
                key={color}
                className="rounded-full"
                style={{ backgroundColor: color, width: 20, height: 20 }}
                onClick={() => onColorChange(part, color)}
              />
            ))}
          </div>
        </div>
      ))}
      <svg className="lines">
        {Object.entries(positions).map(([part, pos]) => (
          <line key={part} x1={pos.x} y1={pos.y} x2={pos.x - 50} y2={pos.y - 50} stroke="white" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
};

export default CustomizeOverlay;
