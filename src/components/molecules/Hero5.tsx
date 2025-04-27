import React from 'react'
import Section from './Section'

const Hero5 = () => {
  return (
    <Section id="section5" bgColor='bg-brown' shapeColor='text-black' preset='center'>
      <section className="py-20 md:py-28 bg-gradient-to-r">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Ready to Build Your Masterpiece?</h2>
          <p className="text-lg text-amber-100 mb-10 max-w-2xl mx-auto">
            Stop adapting to your planner. Start designing a planner that adapts to you. Begin your creative journey today.
          </p>
          <button className="px-10 py-4 border border-transparent text-lg font-medium rounded-lg text-redBrick bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-white transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
            Craft Your Personalized Agenda
          </button>
        </div>
      </section>
    </Section>
  )
}

export default Hero5