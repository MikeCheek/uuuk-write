import React, { useState, useEffect } from 'react';
import CustomizePart from '../atoms/CustomizePart';

interface CustomizeOverlayProps {
  onColorChange: (part: string, color: string) => void;
  text: { [key: string]: string };
}

const CustomizeOverlay: React.FC<CustomizeOverlayProps> = ({ onColorChange, text }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const halfScreen = screenWidth / 2;
  const maxX = halfScreen - 50

  const positions = {
    SidebarSmall: { x: Math.max(-600, -maxX), y: -300, name: "sidebar", width: 280 - (Math.max(-600, -maxX) + 600), height: 40, text: text["SideBarColor"] },
    Front: { x: Math.min(400, maxX - 250), y: 150, name: "cover", width: 420 + (Math.min(400, maxX - 250) - 400), height: 50, text: text["CoverColor"] },
  };

  return (
    <>
      {Object.entries(positions).map(([part, pos]) => (
        <CustomizePart
          key={part}
          name={pos.name}
          x={pos.x}
          y={pos.y}
          height={pos.height}
          width={pos.width}
          text={pos.text}
          onColorChange={(color) => onColorChange(part, color)}
        />
      ))}
    </>
  );
};

export default CustomizeOverlay;
