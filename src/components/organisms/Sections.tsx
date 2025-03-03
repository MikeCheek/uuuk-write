import React from 'react'
import Menu from '../atoms/Menu'
import Hero from '../molecules/Hero'
import Hero2 from '../molecules/Hero2'
import Hero3 from '../molecules/Hero3'

const Sections = () => {
  return (
    <div className="relative w-full">
      {/* <Menu /> */}

      <Hero />

      <Hero2 />

      <Hero3 />
    </div>
  )
}

export default Sections