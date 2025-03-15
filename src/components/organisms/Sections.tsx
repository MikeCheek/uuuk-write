import React from 'react'
import Hero from '../molecules/Hero'
import Hero2 from '../molecules/Hero2'
import Hero3 from '../molecules/Hero3'
import Hero4 from '../molecules/Hero4'
import Hero5 from '../molecules/Hero5'

const Sections = () => {
  return (
    <div className="relative w-full">
      <Hero />
      {/* <Hero2 /> */}
      <Hero3 />
      <Hero4 />
      <Hero5 />
    </div>
  )
}

export default Sections