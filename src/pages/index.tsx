import React from 'react';
import type { HeadProps } from "gatsby"
import Environment from '../components/organisms/Environment';
import Seo from '../components/atoms/Seo';
import Hero from '../components/organisms/Hero';

const IndexPage = () => {
  return (
    <main>
      <Hero />
      <Environment />
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
