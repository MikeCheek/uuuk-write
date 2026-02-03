import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import { StaticImage } from 'gatsby-plugin-image'
import HighlightedText from '../atoms/HighlightedText'
import Typography from '../atoms/Typography'

const Personal = () => {
  return (
    <Section id={`section2_3`} bgColor='bg-darkBrown' shapeColor='text-white' preset='center'>
      <ShowOnView className="flex flex-col md:flex-row items-center justify-center md:!items-end md:!justify-end">
        <StaticImage
          src="../../images/triadics.png"
          alt="Triadics Cover Options"
          width={800}
          height={400}
          className="max-h-[20vh] md:max-h-[50vh] md:max-w-[40vw] mb-16 md:mb-auto"
          objectFit="contain"
          objectPosition="center"
          layout="fixed"
        />

        <div className='text-beige md:mx-10 md:max-w-[50vw] w-[80vw] md:w-auto'>
          <Typography variant="h2" render="div" className="[perspective:400px]" >
            <h2 className='text-6xl md:text-8xl font-bold mb-8 uppercase -ml-24 md:-ml-40 [transform:rotateY(-30deg)_rotateZ(0deg)]  text-beige'>Personale</h2>
          </Typography>
          <Typography variant="p" >
            Cambia la cover <HighlightedText text="Plug & Play" /> per rappresentare ciò a cui tieni
            <br />
            L'occhio vuole la sua parte
          </Typography>
        </div>
      </ShowOnView>
    </Section>
  )
}

export default Personal