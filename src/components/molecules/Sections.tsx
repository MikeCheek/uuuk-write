import React from 'react'
import Menu from '../atoms/Menu'
import Hero from '../organisms/Hero'
import Hero2 from '../organisms/Hero2'

const Sections = () => {
  return (
    <div className="relative">
      <Menu />

      <Hero />

      <Hero2 />

      <section id="section3" className="h-screen flex items-center justify-center bg-brown">
        <h1 className="text-5xl text-white">Section 3</h1>
      </section>
    </div>
  )
}

export default Sections