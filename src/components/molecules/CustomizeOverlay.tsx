import React from 'react';
import Connection from '../atoms/Connection';
import CustomizePart from '../atoms/CustomizePart';

interface CustomizeOverlayProps {
  onColorChange: (part: string, color: string) => void;
}

const CustomizeOverlay: React.FC<CustomizeOverlayProps> = ({ onColorChange }) => {

  const positions = {
    SidebarSmall: { x: -600, y: -300, name: "sidebar", width: 260, height: 40 },
    Front: { x: 400, y: 150, name: "cover", width: 400, height: 50 },
  }

  return (
    <>
      {Object.entries(positions).map(([part, pos]) => {
        return (
          <CustomizePart key={part} name={pos.name} x={pos.x} y={pos.y} height={pos.height} width={pos.width} onColorChange={(color) => onColorChange(part, color)} />
        )
      })}
    </>
  );
};

export default CustomizeOverlay;
