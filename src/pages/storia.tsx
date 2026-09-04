import React from 'react';
import { HeadProps } from 'gatsby';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import SiteNav from '../components/organisms/SiteNav';
import Section from '../components/molecules/Section';
import ShowOnView from '../components/molecules/ShowOnView';
import Button from '../components/atoms/Button';
import Footer from '../components/molecules/Footer';
import ProjectIdentity from '../components/molecules/ProjectIdentity';

const StoriaPage = () => {
  return (
    <Layout>
      <SiteNav />

      {/* Intro hero: chi siamo */}
      <Section id="storia-hero" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="left">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(249,117,22,0.24),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(154,208,255,0.2),transparent_38%)]" />

        <div className="relative z-10 w-full max-w-4xl pt-28 pb-14 md:pt-16 md:pb-20">
          <ShowOnView className="!items-start !text-left" fadeIn="topDown">
            <span className="inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]">
              Chi siamo
            </span>
            <h1 className="mt-6 font-heading text-4xl uppercase leading-[0.95] text-[#f3f7ff] md:text-6xl">
              Ogni persona ha una storia.<br />
              <span className="text-[#f97516]">UUUK</span> ti dà lo strumento per scriverla.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
              Nasciamo per riportare al centro il valore della scrittura, della modularità e dell&apos;ispirazione
              quotidiana, in un&apos;epoca che corre veloce e distrae. UUUK unisce sostenibilità, arte e stampa 3D
              per un&apos;agenda che non si esaurisce mai.
            </p>
          </ShowOnView>
        </div>
      </Section>

      {/* Reuses the existing Vision / Mission / Manifesto cards */}
      <ProjectIdentity />

      {/* Closing CTA */}
      <Section id="storia-cta" bgColor="bg-[#f3ebde]" shapeColor="text-darkBrown" preset="center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,117,22,0.2),transparent_36%)]" />
        <ShowOnView className="relative z-10 w-full max-w-3xl py-16 text-center md:py-20" fadeIn="bottomUp">
          <h2 className="font-heading text-3xl uppercase leading-[0.95] text-[#0b1122] md:text-5xl">
            Dalla visione al prodotto
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#2f241c] md:text-lg">
            Scopri come questi principi diventano un sistema modulare reale: binder, sidebar e cover pensati per
            durare per sempre.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/prodotto" text="Scopri il prodotto" />
            <Button href="/personalizzazione" text="Vedi le collezioni" variant="tertiary" />
          </div>
        </ShowOnView>
      </Section>

      <Footer />
    </Layout>
  );
};

export default StoriaPage;

export const Head = ({ location }: HeadProps) => {
  return (
    <Seo
      lang="it"
      title="Vision, Missione e Manifesto"
      pathname={location.pathname}
      description="Scopri perché nasce UUUK: la visione, la missione e il manifesto dietro la prima agenda modulare stampata in 3D."
      keywords="uuuk, vision, missione, manifesto, agenda stampata 3d, storia del brand"
      structuredData
    />
  );
};
