import React from 'react'
import TemplateGallery from '../components/arena/TemplateGallery'
import Layout from '../components/organisms/Layout'
import Seo from '../components/atoms/Seo';
import { HeadProps } from 'gatsby';

const GalleryPage = ({ pageContext }: any) => {
  const { allStripeProducts } = pageContext;

  return (
    <Layout showCustomCursor={false} shoppingCart={true}>
      <div className='flex flex-col items-center justify-center'>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold my-8 animate-fadeIn text-center">
          <span className="text-beige">Scegli un template o </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-purple to-magenta drop-shadow-sm">
            personalizza
          </span>
        </h1>
        <TemplateGallery serverProducts={allStripeProducts} />
      </div>
    </Layout>
  )
}

export default GalleryPage

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'Galleria'}
      pathname={location.pathname}
      description={"Esplora la nostra galleria di prodotti. Scopri design unici, collezioni esclusive e idee creative per personalizzare la tua agenda 3D. Scegli il template che più ti rappresenta e inizia a creare la tua UUUK su misura."}
      structuredData
    />
  )
}