import React, { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Circle, Triangle, StickyNote, Square, Hexagon } from "lucide-react";

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
  const shapeTypes = ["circle", "triangle", "pencil", "note", "square", "hexagon"];
  const numShapes = 12;
  const minDistance = 30;
  const maxAttempts = 50;

  const [shapes, setShapes] = useState<
    { type: string; size: number; rotation: number; top: number; left: number; opacity: number; animateType: "rotate" | "scale" }[]
  >([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes: typeof shapes = [];

      for (let i = 0; i < numShapes; i++) {
        let attempts = 0;
        let type, size, rotation, top = 0, left = 0, opacity, animateType: "rotate" | "scale";
        let isTooClose;

        do {
          type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          size = Math.floor(Math.random() * 50) + 30;
          rotation = Math.random() * 360;
          top = Math.random() * 90;
          left = Math.random() * 90;
          opacity = Math.random() * 0.3 + 0.2;
          animateType = Math.random() > 0.5 ? "rotate" : "scale"; // Random animation type

          isTooClose = newShapes.some(
            (shape) => Math.hypot(shape.top - top, shape.left - left) < minDistance
          );

          attempts++;
        } while (isTooClose && attempts < maxAttempts);

        if (attempts < maxAttempts) {
          newShapes.push({ type, size, rotation, top, left, opacity, animateType });
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
      {/* Background Shapes with Infinite Animations */}
      {shapes.map(({ type, size, rotation, top, left, opacity, animateType }, key) => {
        const Icon =
          type === "circle"
            ? Circle
            : type === "triangle"
              ? Triangle
              : type === "pencil"
                ? Pencil
                : type === "note"
                  ? StickyNote
                  : type === "square"
                    ? Square
                    : type === "hexagon"
                      ? Hexagon
                      : undefined;

        return (
          <motion.div
            key={key}
            initial={{ scale: 0.8 }}
            animate={animateType === "rotate"
              ? { rotate: [0, 360] }
              : { scale: [1, 1.2, 0.8] }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute ${shapeColor}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              opacity: opacity,
            }}
          >
            {Icon ? <Icon size={size} strokeWidth={1} className="opacity-40" /> : null}
          </motion.div>
        );
      })}

      {children}
    </section>
  );
};

export default Section;
