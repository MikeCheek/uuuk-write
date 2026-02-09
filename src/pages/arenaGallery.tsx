import React from 'react'
import TemplateGallery from '../components/arena/TemplateGallery'
import Layout from '../components/organisms/Layout'

const ArenaGallery = () => {
  return (
    <Layout >
      <div className='flex flex-col items-center justify-center'>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 animate-fadeIn">
          <span className="text-beige">Scegli un template o </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-purple to-magenta drop-shadow-sm">
            personalizza
          </span>
        </h1>
        <TemplateGallery />
      </div>
    </Layout>
  )
}

export default ArenaGallery