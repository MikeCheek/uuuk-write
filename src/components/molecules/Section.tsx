import React, { ReactNode, useState, useEffect } from "react";
import { Pencil, Circle, Triangle, StickyNote } from "lucide-react";

const Section = ({
  id,
  bgColor = "bg-black",
  shapeColor = "text-brown",
  children,
}: {
  id?: string;
  bgColor?: string;
  shapeColor?: string;
  children: ReactNode;
}) => {
  const shapeTypes = ["circle", "triangle", "pencil", "note"];
  const numShapes = 10;
  const minDistance = 20; // Minimum distance in pixels
  const maxAttempts = 50; // Prevent infinite loop

  const [shapes, setShapes] = useState<
    { type: string; size: number; rotation: number; top: number; left: number }[]
  >([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes: typeof shapes = [];

      for (let i = 0; i < numShapes; i++) {
        let attempts = 0;
        let type, size, rotation, top = 0, left = 0
        let isTooClose;

        do {
          type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          size = Math.floor(Math.random() * 40) + 20;
          rotation = Math.random() * 360;
          top = Math.random() * 90; // Percentage of parent container
          left = Math.random() * 90;
          isTooClose = newShapes.some(
            (shape) => Math.hypot(shape.top - top, shape.left - left) < minDistance
          );
          attempts++;
        } while (isTooClose && attempts < maxAttempts);

        if (attempts < maxAttempts) {
          newShapes.push({ type, size, rotation, top, left });
        }
      }

      setShapes(newShapes);
    };

    generateShapes();
  }, []);

  return (
    <section
      id={id}
      className={`${bgColor} min-h-screen flex items-center justify-center px-6 relative overflow-hidden`}
    >
      {shapes.map(({ type, size, rotation, top, left }, key) => {
        const Icon =
          type === "circle"
            ? Circle
            : type === "triangle"
              ? Triangle
              : type === "pencil"
                ? Pencil
                : type === "note"
                  ? StickyNote
                  : undefined;

        return (
          <div
            key={key}
            className="absolute opacity-10"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {Icon ? <Icon size={`${size}px`} className={shapeColor} /> : null}
          </div>
        );
      })}

      {children}
    </section>
  );
};

export default Section;
