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
    <main className="relative cursor-none">
      <Cursor />
      <Hero />
      <Hero2 />
      <Environment />
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
