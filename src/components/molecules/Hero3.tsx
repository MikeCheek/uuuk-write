import React from 'react'
import Section from './Section'
import Typography from '../atoms/Typography'
import CircledText from '../atoms/CircledText'
import ShowOnView from '../atoms/ShowOnView'

const Hero3 = () => {
  return (
    <Section id="section3" bgColor='bg-blue' shapeColor='text-white' preset='center'>
      {/* <Typography variant='h2'>Unico</Typography> */}
      <ShowOnView className='text-white text-center -mt-60'>
        <Typography variant='p'>
          Personalizza UUUK in base alle tue <CircledText text='esigenze' />.<br />
          Modifica le sidebar a tuo piacimento in modo da organizzare al meglio le tue attività preferite
        </Typography>
      </ShowOnView>
    </Section>
  )
}

export default Hero3