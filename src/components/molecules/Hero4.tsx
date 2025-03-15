import React from 'react'
import Section from './Section'
import Typography from '../atoms/Typography'
import ShowOnView from './ShowOnView'
import { useTranslation } from 'react-i18next'
import renderText from '../../utilities/renderText'

const Hero4 = () => {
  const { t } = useTranslation()
  return (
    <Section id="section4" bgColor='bg-beige' shapeColor='text-black' preset='center'>
      <ShowOnView className='-mt-80'>
        <Typography variant="p" className='text-center' dangerouslySetInnerHTML>
          {t("Hero4Text")}
        </Typography>
      </ShowOnView>
    </Section>
  )
}

export default Hero4