import React from 'react'
import VerticalMenu from '../atoms/Menu'

const Sections = () => {
  return (
    <div className="relative">
      <VerticalMenu />

      <section id="section1" className="h-screen flex items-center justify-center bg-red-500">
        <h1 className="text-5xl text-white">Section 1</h1>
      </section>

      <section id="section2" className="h-screen flex items-center justify-center bg-blue-500">
        <h1 className="text-5xl text-white">Section 2</h1>
      </section>

      <section id="section3" className="h-screen flex items-center justify-center bg-green-500">
        <h1 className="text-5xl text-white">Section 3</h1>
      </section>
    </div>
  )
}

export default Sections