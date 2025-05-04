import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'

const Hero2_3 = () => {
  const contents = [
    "Customize your cover with your favourite graphics.",
    "Customize your sidebar with your topics of interest.",
    "Choose your format for everyday use."
  ]
  return (<>
    {contents.map((content, index) => (
      <Section key={index} id={`section2_3_${index}`} bgColor='bg-beige' shapeColor='text-black' preset='center'>
        <ShowOnView className={`w-screen flex flex-col`} align={index % 2 == 0 ? 'left' : 'right'} fadeIn="bottomUp">
          <div className='text-black mx-10 max-w-[30%]'>
            <h2 className='text-2xl font-bold mb-4'>{content}</h2>
            <p className='text-lg'>{content}</p>
          </div>
        </ShowOnView>
      </Section>
    ))}
  </>
  )
}

export default Hero2_3