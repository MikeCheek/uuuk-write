import React from 'react';
import { graphql, type HeadProps } from "gatsby"
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import NewHero from '../components/organisms/NewHero';
import Hero2 from '../components/molecules/Hero2';
import Footer from '../components/molecules/Footer';
import Hero2_3 from '../components/molecules/Hero2_3';

const IndexPage = () => {

  return (
    <Layout>
      <NewHero />
      <Hero2 />
      <Hero2_3 />
      <Footer />
    </Layout>
  )
}

export default IndexPage

export const Head = ({ location, data, pageContext }: HeadProps) => {
  const edges: Array<{ node: { data: string } }> = (data as any).locales.edges;
  const json = edges.map((e) => JSON.parse(e.node.data)).reduce((acc, curr) => ({ ...acc, ...curr }));
  const t = (key: string) => json[key] ?? key;

  return (
    <Seo
      lang={(pageContext as any).language}
      title={'Home'}
      pathname={location.pathname}
      description={'Write your story...'}
      structuredData
    />
  )
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;