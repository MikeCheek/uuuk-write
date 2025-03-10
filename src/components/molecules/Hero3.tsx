import React from 'react'
import Section from './Section'
import Typography from '../atoms/Typography'
import ShowOnView from './ShowOnView'
import { useTranslation } from 'react-i18next'
import renderText from '../../utilities/renderText'

const Hero3 = () => {
  const { t } = useTranslation()

  return (
    <Section id="section3" bgColor='bg-blue' shapeColor='text-white' preset='center'>
      {/* <Typography variant='h2'>Unico</Typography> */}
      <ShowOnView className='text-white text-center -mt-60'>
        <Typography variant='p'>
          {renderText(t('Hero3Text'))}
        </Typography>
      </ShowOnView>
    </Section>
  )
}

export default Hero3