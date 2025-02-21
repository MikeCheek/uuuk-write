import React from "react";

const Hero2 = () => {
  return (
    <section id="section2" className="relative bg-blue min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center text-white">
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-transparent bg-clip-text bg-white drop-shadow-lg">
          Redefining Productivity
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
          The next-gen agenda that adapts, optimizes, and transforms the way you organize your life.
        </p>
        <div className="mt-6">
          <a
            href="#"
            className="relative inline-block px-8 py-3 text-lg font-medium text-black bg-yellow rounded-xl shadow-xl transform transition hover:scale-105 hover:shadow-2xl"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
