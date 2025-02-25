import React from "react";
import Section from "./Section";
import CircledText from "../atoms/CircledText";

const Hero = () => {
  // Function to scroll down by one viewport height
  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
  };

  return (
    <Section id="section1" bgColor="bg-black" shapeColor="text-brown">
      <div className="max-w-3xl text-center z-20 -mt-40">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-transparent bg-clip-text bg-brown drop-shadow-lg">
          UUUK
        </h1>
        <p className="text-lg md:text-xl text-white mt-4">
          Free your <CircledText text="mind" />. Live inspired.
        </p>
        {/* Minimal down arrow that scrolls down on click */}
        <div className="mt-6">
          <div onClick={scrollDown} className="cursor-pointer inline-block animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-white mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
