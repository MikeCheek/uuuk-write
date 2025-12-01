import React from 'react'
import Hero from '../molecules/Hero'
import Hero2 from '../molecules/UUUKForever'
import Hero3 from '../molecules/Showcase'
import Hero4 from '../molecules/Hero4'
import Hero5 from '../molecules/Hero5'
import Hero2_3 from '../molecules/Personal'

const Sections = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      <Hero />
      <Hero2 />
      <Hero2_3 />
      <Hero3 data={[undefined]} opened={true} />
      <Hero4 />
      <Hero5 />
    </div>
  )
}

export default Sections