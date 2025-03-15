import React from "react";
import Section from "./Section";
import Typography from "../atoms/Typography";
import LanguagePicker from "../atoms/LanguagePicker";

const Hero = () => {

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
  };

  return (
    <Section id="section1" bgColor="bg-beige" shapeColor="text-black" preset="right">
      <div className="max-w-3xl text-center text-black md:text-right z-20 mt-20 md:mr-40">
        <Typography variant="h2" className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl md:text-7xl text-transparent bg-clip-text !bg-black drop-shadow-lg">
          UUUK
        </Typography>
        <div className="absolute top-4 right-4">
          <LanguagePicker />
        </div>
        <Typography variant="h1" className="uppercase ">
          "Write your story"
        </Typography>

        <div className="mt-20 md:mr-40">
          <div onClick={scrollDown} className="inline-block animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-black mx-auto"
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
