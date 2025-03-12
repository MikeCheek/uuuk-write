import React from 'react';
import { graphql, type HeadProps } from "gatsby"
import Seo from '../components/atoms/Seo';
import Cursor from '../components/atoms/Cursor';
import Sections from '../components/organisms/Sections';
import Environment from '../components/organisms/Environment';
import PageLoader from '../components/atoms/PageLoader';

const IndexPage = () => {

  return (
    <main className="relative cursor-none">
      <Cursor />
      <PageLoader />
      <Environment />
      <Sections />
    </main>
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
      title={'SEOTitle'}
      pathname={location.pathname}
      description={'SEODescription'}
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