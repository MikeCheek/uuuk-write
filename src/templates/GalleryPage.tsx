import React from 'react'
import TemplateGallery from '../components/arena/TemplateGallery'
import Layout from '../components/organisms/Layout'
import Seo from '../components/atoms/Seo';
import { HeadProps } from 'gatsby';

const GalleryPage = ({ pageContext }: any) => {
  const { allStripeProducts } = pageContext;

  return (
    <Layout showCustomCursor={false} shoppingCart={true}>
      <div className="min-h-screen w-full bg-[#070d1e] bg-[radial-gradient(circle_at_top,_#152f5d_0%,_#070d1e_60%)] px-4 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8">
          <h1 className="my-12 text-center text-4xl font-black uppercase tracking-tight md:text-6xl">
            <span className="text-[#f5f8ff]">Scegli un template o </span>
            <span className="bg-gradient-to-r from-[#f97316] via-[#ffb170] to-[#9ad0ff] bg-clip-text text-transparent">
              personalizza
            </span>
          </h1>
          <TemplateGallery serverProducts={allStripeProducts} />
        </div>
      </div>
    </Layout>
  )
}

export default GalleryPage

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'Galleria agende stampate 3D'}
      pathname={location.pathname}
      description={"Esplora la galleria UUUK di agende stampate 3D: scopri collezioni, confronta template e scegli la base perfetta da personalizzare."}
      keywords={'galleria agenda stampata 3d, template agenda 3d, agenda personalizzata, uuuk galleria'}
      structuredData
    />
  )
}