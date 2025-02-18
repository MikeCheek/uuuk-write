import React from 'react';
import type { HeadProps } from "gatsby"
import Environment from '../components/organisms/Environment';
import Seo from '../components/atoms/Seo';
import Hero from '../components/organisms/Hero';
import Hero2 from '../components/organisms/Hero2';
import Cursor from '../components/atoms/Cursor';
import Sections from '../components/molecules/Sections';

const IndexPage = () => {
  return (
    <main className="relative cursor-none bg-gradient-to-br from-gray-800 to-black">
      <Cursor />
      <Hero />
      <Hero2 />
      <Environment />
      <div className="flex justify-center items-center h-screen">
        <h1 className="title text-white text-6xl font-extrabold tracking-widest">
          Become an UUUKer
        </h1>
      </div>
      <Sections />
    </main>
  )
}

export default IndexPage

export const Head = ({ data, pageContext }: HeadProps) => {

  return (
    <Seo
      lang={(pageContext as any).language}
      title={'SEOTitle'}
      pathname="/"
      description={'SEODescription'}
      structuredData
    />
  )
}
