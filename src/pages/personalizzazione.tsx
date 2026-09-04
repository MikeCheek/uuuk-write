import React from 'react';
import { HeadProps } from 'gatsby';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import SiteNav from '../components/organisms/SiteNav';
import Section from '../components/molecules/Section';
import ShowOnView from '../components/molecules/ShowOnView';
import Button from '../components/atoms/Button';
import Footer from '../components/molecules/Footer';
import ArtCustomization from '../components/molecules/ArtCustomization';
import CollectionsShowcase from '../components/molecules/CollectionsShowcase';
import AccessoriesGrid from '../components/molecules/AccessoriesGrid';

const PersonalizzazionePage = () => {
  return (
    <Layout>
      <SiteNav />

      <Section id="personalizzazione-hero" bgColor="bg-[#101625]" shapeColor="text-white" preset="left">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(142,228,196,0.22),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(249,117,22,0.2),transparent_38%)]" />

        <div className="relative z-10 w-full max-w-4xl pt-28 pb-14 md:pt-16 md:pb-20">
          <ShowOnView className="!items-start !text-left" fadeIn="topDown">
            <span className="inline-flex rounded-full border border-[#8ee4c4]/45 bg-[#8ee4c4]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c8fff0]">
              Personalizzazione
            </span>
            <h1 className="mt-6 font-heading text-4xl uppercase leading-[0.95] text-[#f3f7ff] md:text-6xl">
              L&apos;occhio vuole <span className="text-[#f97516]">la sua parte</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
              Colore, testo e forma: dalle sidebar fino alla copertina, passando per la rilegatura, ogni dettaglio
              di UUUK è pensato per definire la tua agenda.
            </p>
          </ShowOnView>
        </div>
      </Section>

      <ArtCustomization />
      <CollectionsShowcase />
      <AccessoriesGrid />

      <Section id="personalizzazione-cta" bgColor="bg-[#f3ebde]" shapeColor="text-darkBrown" preset="center">
        <ShowOnView className="relative z-10 w-full max-w-3xl py-16 text-center md:py-20" fadeIn="bottomUp">
          <h2 className="font-heading text-3xl uppercase leading-[0.95] text-[#0b1122] md:text-5xl">
            Costruisci il tuo UUUK
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#2f241c] md:text-lg">
            Scegli cover, sidebar e accessori nella galleria, oppure scopri prima l&apos;impatto ambientale del
            materiale che usiamo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/galleria" text="Vai alla galleria" />
            <Button href="/sostenibilita" text="Scopri la sostenibilità" variant="tertiary" />
          </div>
        </ShowOnView>
      </Section>

      <Footer />
    </Layout>
  );
};

export default PersonalizzazionePage;

export const Head = ({ location }: HeadProps) => {
  return (
    <Seo
      lang="it"
      title="Personalizzazione, arte e accessori"
      pathname={location.pathname}
      description="Collezioni firmate da artisti, cover generate con Hueforge da qualsiasi immagine e accessori modulari per il tuo UUUK."
      keywords="uuuk, personalizzazione, hueforge, collezioni, cover agenda, accessori"
      structuredData
    />
  );
};
