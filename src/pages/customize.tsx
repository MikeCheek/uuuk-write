import React from 'react';
import { graphql, type HeadProps } from "gatsby"
import Seo from '../components/atoms/Seo';
import EnvironmentCustomize from '../components/organisms/EnvironmentCustomize';
import { CustomizeProvider } from '../utilities/CustomizeContext';

const CustomizePage = () => {
  return (
    <CustomizeProvider >
      <EnvironmentCustomize />
    </CustomizeProvider>
  )
}

export default CustomizePage

export const Head = ({ location, data, pageContext }: HeadProps) => {
  const edges: Array<{ node: { data: string } }> = (data as any).locales.edges;
  const json = edges.map((e) => JSON.parse(e.node.data)).reduce((acc, curr) => ({ ...acc, ...curr }));
  const t = (key: string) => json[key] ?? key;

  return (
    <Seo
      lang={(pageContext as any).language}
      title={'Customize'}
      pathname={location.pathname}
      description={'SEODescription'}
      structuredData
      bgColor='black'
    />
  )
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { ns: { in: ["common", "customize"] }, language: { eq: $language } }) {
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