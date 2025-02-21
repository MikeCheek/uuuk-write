import React from 'react'
import Menu from '../atoms/Menu'

const Sections = () => {
  return (
    <div className="relative">
      <Menu />

      <section id="section1" className="h-screen flex items-center justify-center bg-black">
        <h1 className="text-5xl text-white">Section 1</h1>
      </section>

      <section id="section2" className="h-screen flex items-center justify-center bg-blue">
        <h1 className="text-5xl text-white">Section 2</h1>
      </section>

      <section id="section3" className="h-screen flex items-center justify-center bg-brown">
        <h1 className="text-5xl text-white">Section 3</h1>
      </section>
    </div>
  )
}

export default Sections