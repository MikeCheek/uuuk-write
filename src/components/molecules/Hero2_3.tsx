import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import { StaticImage } from 'gatsby-plugin-image'
import HighlightedText from '../atoms/HighlightedText'

const Hero2_3 = () => {
  return (
    <Section id={`section2_3`} bgColor='bg-darkBrown' shapeColor='text-white' preset='center'>
      <ShowOnView className="flex flex-col md:flex-row items-center justify-center md:!items-end md:!justify-end">
        <StaticImage
          src="../../images/triadics.png"
          alt="Triadics Cover Options"
          width={800}
          height={400}
          className="max-h-[20vh] md:max-h-[50vh] mb-16 md:mb-auto"
          objectFit="contain"
          objectPosition="center"
          layout="fixed"
        />

        <div className='text-beige md:mx-10 md:max-w-[50vw] [perspective:400px] w-[80vw] md:w-auto'>
          <h2 className='text-7xl font-bold mb-8 uppercase -ml-32 md:-ml-40 [transform:rotateY(-35deg)_rotateZ(0deg)] '>Personale</h2>
          <p className='text-lg'>Cambia la cover <HighlightedText text="Plug & Play" /> per rappresentare ciò a cui tieni</p>
          <p className='text-lg'>L'occhio vuole la sua parte</p>
        </div>
      </ShowOnView>
    </Section>
  )
}

export default Hero2_3