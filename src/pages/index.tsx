import React from 'react';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import NewHero from '../components/organisms/NewHero';
import UUUKForever from '../components/molecules/UUUKForever';
import Footer from '../components/molecules/Footer';
import Personal from '../components/molecules/Personal';
import Banner from '../components/atoms/Banner';
import Infinite from '../components/molecules/Infinite';
import ProjectIdentity from '../components/molecules/ProjectIdentity';
import { HeadProps } from 'gatsby';

const IndexPage = () => {

  return (
    <Layout>
      <NewHero />
      <UUUKForever />
      <ProjectIdentity />
      <Banner />
      <Personal />
      <Infinite />
      <Footer />
    </Layout>
  )
}

export default IndexPage

export const Head = ({ location, data, pageContext }: HeadProps) => {
  // const edges: Array<{ node: { data: string } }> = (data as any).locales.edges;
  // const json = edges.map((e) => JSON.parse(e.node.data)).reduce((acc, curr) => ({ ...acc, ...curr }));
  // const t = (key: string) => json[key] ?? key;

  return (
    <Seo
      lang={"it"
        // (pageContext as any).language
      }
      title={'Agenda stampata 3D personalizzabile'}
      pathname={location.pathname}
      description={"UUUK è l'agenda stampata 3D personalizzabile. Configura formato, copertina e moduli interni per creare una planner unica, realizzata in Italia."}
      keywords={'agenda stampata 3d, agenda stampata in 3d, agenda personalizzabile, planner 3d, uuuk'}
      structuredData
    />
  )
}

// export const query = graphql`
//   query ($language: String!) {
//     locales: allLocale(filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }) {
//       edges {
//         node {
//           ns
//           data
//           language
//         }
//       }
//     }
//   }
// `;