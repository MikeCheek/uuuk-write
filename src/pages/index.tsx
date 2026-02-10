import React from 'react';
import { graphql, type HeadProps } from "gatsby"
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import NewHero from '../components/organisms/NewHero';
import UUUKForever from '../components/molecules/UUUKForever';
import Footer from '../components/molecules/Footer';
import Personal from '../components/molecules/Personal';
import Banner from '../components/atoms/Banner';
import Infinite from '../components/molecules/Infinite';

const IndexPage = () => {

  return (
    <Layout>
      <NewHero />
      <UUUKForever />
      <Banner />
      <Personal />
      <Infinite />
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
      title={''}
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