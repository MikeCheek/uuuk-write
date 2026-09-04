import React from 'react';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import SiteNav from '../components/organisms/SiteNav';
import NewHero from '../components/organisms/NewHero';
import ExplorePillars from '../components/molecules/ExplorePillars';
import Footer from '../components/molecules/Footer';
import Banner from '../components/atoms/Banner';
import { HeadProps } from 'gatsby';

const IndexPage = () => {

  return (
    <Layout>
      <SiteNav />
      <NewHero />
      <ExplorePillars />
      <Banner />
      <Footer />
    </Layout>
  )
}

export default IndexPage

export const Head = ({ location, data, pageContext }: HeadProps) => {
  return (
    <Seo
      lang={"it"}
      title={'Agenda stampata 3D personalizzabile'}
      pathname={location.pathname}
      description={"UUUK è l'agenda stampata 3D personalizzabile. Configura formato, copertina e moduli interni per creare una planner unica, realizzata in Italia."}
      keywords={'agenda stampata 3d, agenda stampata in 3d, agenda personalizzabile, planner 3d, uuuk'}
      structuredData
    />
  )
}
