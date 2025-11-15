import React, { useState } from 'react'
import Hero3 from '../molecules/Hero3'
import Actions from '../atoms/Actions'
import Footer from '../molecules/Footer'
import Logo from "../../assets/loguuuk.svg"
import Typography from '../atoms/Typography'

const NewHero = () => {
  const [galleryOpen, setGalleryOpen] = useState(false)

  const toggleGallery = () => setGalleryOpen(!galleryOpen)

  return (
    <div className='relative h-full flex flex-col items-center justify-center'>
      <Logo className="absolute top-2 left-2 z-50"
        width={60} height={60} fill='#ecddbe' />
      <button onClick={toggleGallery} className="absolute z-50 top-4 right-4 px-4 py-2 border border-transparent text-lg font-medium rounded-lg text-darkBrown bg-beige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
        {galleryOpen ? "X" : "Gallery"}
      </button>
      <Typography variant="h1" className="uppercase mb-4 md:mb-10 -mt-20 text-beige [text-shadow:_0_10px_10px_#ecddbe22] w-full text-center opacity-100">
        Write your story
      </Typography>
      <Actions />
      <div className={`w-full h-screen flex items-center justify-center absolute top-0 left-0 transition-all duration-200 ${galleryOpen ? 'z-10 opacity-100 bg-black' : '-z-10 opacity-50 bg-transparent'}`}>
        <Hero3 opened={galleryOpen} />
      </div>
      <div className='absolute w-full bottom-0 left-0 flex items-center justify-center'>
        <Footer />
      </div>
    </div>
  )
}

export default NewHero