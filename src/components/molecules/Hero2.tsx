import React from "react";
import Section from "./Section";

const Hero2 = () => {
  return (
    <Section id="section2" bgColor="bg-black" shapeColor="text-white" preset="left">
      <div className="max-w-3xl text-left text-white">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-transparent bg-clip-text bg-white drop-shadow-lg">
          Redefining Productivity
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
          The next-gen agenda that adapts, optimizes, and transforms the way you organize your life.
        </p>
      </div>
    </Section>
  );
};

export default Hero2;
