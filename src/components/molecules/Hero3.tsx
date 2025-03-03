import React from 'react'
import Section from './Section'
import Typography from '../atoms/Typography'
import CircledText from '../atoms/CircledText'

const Hero3 = () => {
  return (
    <Section id="section3" bgColor='bg-black' preset='right'>
      <Typography variant='h2'>Unico</Typography>
      <Typography variant='p'>
        Crediamo che dietro ogni persona ci sia una <CircledText text="storia unica" /> che aspetta solo di essere raccontata ed enorme potenziale
        da esprimere attraverso il solenne atto della scrittura
      </Typography>
    </Section>
  )
}

export default Hero3