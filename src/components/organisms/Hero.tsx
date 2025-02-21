import React from "react";

const Hero = () => {
  return (
    <section className="bg-black min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-brown">
          A Smarter Way to Plan Your Day
        </h1>
        <p className="text-lg md:text-xl text-white mt-4">
          Experience a revolutionary agenda that adapts to your needs and
          optimizes your schedule like never before.
        </p>
        <div className="mt-6">
          <a
            href="#"
            className="bg-yellow text-black font-medium px-6 py-3 rounded-xl shadow-soft transition hover:bg-opacity-90"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
