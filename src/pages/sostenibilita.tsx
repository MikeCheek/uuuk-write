import React from 'react';
import { HeadProps } from 'gatsby';
import Seo from '../components/atoms/Seo';
import Layout from '../components/organisms/Layout';
import SiteNav from '../components/organisms/SiteNav';
import Section from '../components/molecules/Section';
import ShowOnView from '../components/molecules/ShowOnView';
import Button from '../components/atoms/Button';
import Footer from '../components/molecules/Footer';
import CircularEconomy from '../components/molecules/CircularEconomy';

const SostenibilitaPage = () => {
  return (
    <Layout>
      <SiteNav />

      <Section id="sostenibilita-hero" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="left">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(27,181,127,0.28),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(249,117,22,0.16),transparent_38%)]" />

        <div className="relative z-10 w-full max-w-4xl pt-28 pb-14 md:pt-16 md:pb-20">
          <ShowOnView className="!items-start !text-left" fadeIn="topDown">
            <span className="inline-flex rounded-full border border-[#16a36e]/45 bg-[#16a36e]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c8ffe6]">
              Sostenibilità
            </span>
            <h1 className="mt-6 font-heading text-4xl uppercase leading-[0.95] text-[#f3f7ff] md:text-6xl">
              Sostenibile e circolare, <span className="text-[#1bb57f]">per scelta</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
              La sostenibilità ambientale e la circolarità del prodotto sono uno dei punti di forza di UUUK: usiamo
              tecnologie di stampa 3D all&apos;avanguardia per garantire alta durabilità e ridurre gli scarti
              rispetto agli standard del settore della cancelleria.
            </p>
          </ShowOnView>
        </div>
      </Section>

      <CircularEconomy />

      <Section id="sostenibilita-cta" bgColor="bg-[#efe5d4]" shapeColor="text-darkBrown" preset="center">
        <ShowOnView className="relative z-10 w-full max-w-3xl py-16 text-center md:py-20" fadeIn="bottomUp">
          <h2 className="font-heading text-3xl uppercase leading-[0.95] text-[#0b1122] md:text-5xl">
            Un impatto positivo, un design che dura
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#2f241c] md:text-lg">
            Scopri il sistema modulare che rende possibile tutto questo, o passa direttamente alla galleria per
            scegliere il tuo UUUK.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/prodotto" text="Scopri il sistema" />
            <Button href="/galleria" text="Vai alla galleria" variant="tertiary" />
          </div>
        </ShowOnView>
      </Section>

      <Footer />
    </Layout>
  );
};

export default SostenibilitaPage;

export const Head = ({ location }: HeadProps) => {
  return (
    <Seo
      lang="it"
      title="Sostenibilità e circolarità"
      pathname={location.pathname}
      description="PETG riciclato, filiera circolare e riduzione degli scarti: scopri l'impegno ambientale di UUUK, l'agenda modulare stampata in 3D."
      keywords="uuuk, sostenibilità, petg riciclato, economia circolare, stampa 3d ecologica"
      structuredData
    />
  );
};
