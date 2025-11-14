import React from 'react'
import Hero3 from '../molecules/Hero3'
import Actions from '../atoms/Actions'
import Footer from '../molecules/Footer'
import Logo from "../../assets/loguuuk.svg"
import Typography from '../atoms/Typography'

const NewHero = () => {
  return (
    <div className='relative h-full flex flex-col items-center justify-center'>
      <Logo className="absolute top-2 left-2"
        width={60} height={60} fill='#ecddbe' />
      <Typography variant="h1" className="uppercase mb-4 md:mb-10 -mt-20 text-beige [text-shadow:_0_10px_10px_#ecddbe22] w-full text-center opacity-100">
        "Write your story"
      </Typography>
      <Actions />
      <div className='w-full h-screen flex items-center justify-center absolute top-0 left-0 -z-10'>
        <Hero3 />
      </div>
      <div className='absolute w-full bottom-0 left-0 flex items-center justify-center'>
        <Footer />
      </div>
    </div>
  )
}

export default NewHero