import React, { useEffect } from 'react';
import type { HeadProps } from "gatsby"
import Seo from '../components/atoms/Seo';
import Cursor from '../components/atoms/Cursor';
import Sections from '../components/organisms/Sections';

const IndexPage = () => {

  return (
    <main className="relative cursor-none">
      <Cursor />
      {/* <Environment /> */}
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
