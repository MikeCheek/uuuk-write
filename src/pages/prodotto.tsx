import React from 'react';
import { HeadProps } from 'gatsby';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import SiteNav from '../components/organisms/SiteNav';
import Section from '../components/molecules/Section';
import ShowOnView from '../components/molecules/ShowOnView';
import Button from '../components/atoms/Button';
import Footer from '../components/molecules/Footer';
import HowItWorks from '../components/molecules/HowItWorks';
import UUUKForever from '../components/molecules/UUUKForever';
import Personal from '../components/molecules/Personal';
import Infinite from '../components/molecules/Infinite';

const ProdottoPage = () => {
  return (
    <Layout>
      <SiteNav />

      <Section id="prodotto-hero" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="left">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(249,117,22,0.24),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(142,228,196,0.18),transparent_38%)]" />

        <div className="relative z-10 w-full max-w-4xl pt-28 pb-14 md:pt-16 md:pb-20">
          <ShowOnView className="!items-start !text-left" fadeIn="topDown">
            <span className="inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]">
              Prodotto
            </span>
            <h1 className="mt-6 font-heading text-4xl uppercase leading-[0.95] text-[#f3f7ff] md:text-6xl">
              La prima agenda <span className="text-[#f97516]">stampata in 3D</span><br />
              che non si esaurisce mai.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
              Rilegatura modulare, cover sostituibili, fascicoli ricaricabili. UUUK è progettato per crescere ed
              adattarsi ai tuoi impegni, non il contrario.
            </p>
          </ShowOnView>
        </div>
      </Section>

      <HowItWorks />
      <UUUKForever />
      <Personal />
      <Infinite />

      <Section id="prodotto-cta" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="center">
        <ShowOnView className="relative z-10 w-full max-w-3xl py-16 text-center md:py-20" fadeIn="bottomUp">
          <h2 className="font-heading text-3xl uppercase leading-[0.95] text-white md:text-5xl">
            Ogni dettaglio, deciso da te
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#dce8ff] md:text-lg">
            Colori, texture e collaborazioni con artisti: scopri come personalizzare cover e accessori del tuo UUUK.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/personalizzazione" text="Vai alla personalizzazione" />
            <Button href="/galleria" text="Configuralo ora" variant="tertiary" />
          </div>
        </ShowOnView>
      </Section>

      <Footer />
    </Layout>
  );
};

export default ProdottoPage;

export const Head = ({ location }: HeadProps) => {
  return (
    <Seo
      lang="it"
      title="Come funziona UUUK"
      pathname={location.pathname}
      description="Binder in TPU, sidebar modulari e cover intercambiabili in formato A5, A6 e tascabile A7: scopri il sistema alla base di UUUK."
      keywords="uuuk, agenda modulare, sidebar, binder, formato a5, formato a6, come funziona"
      structuredData
    />
  );
};
