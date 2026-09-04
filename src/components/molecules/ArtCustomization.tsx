import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'
import { StaticImage } from 'gatsby-plugin-image'

const ArtCustomization = () => {
  return (
    <Section id="hueforge" bgColor="bg-[#101625]" shapeColor="text-white" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(249,117,22,0.24),transparent_36%),radial-gradient(circle_at_84%_80%,rgba(93,159,255,0.22),transparent_38%)]" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 py-16 md:grid-cols-12 md:py-24">
        <ShowOnView className="!items-start !text-left md:col-span-6" fadeIn="leftRight">
          <span className="inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]">
            Da una foto a una cover
          </span>

          <Typography variant="h2" render="div" className="!mb-6 mt-5 !text-white uppercase">
            <h2 className="text-3xl font-black leading-[0.95] md:text-5xl">Qualsiasi immagine, stampata in 3D</h2>
          </Typography>

          <p className="max-w-xl text-base leading-relaxed text-[#dce8ff] md:text-lg">
            Con il software Hueforge trasformiamo qualsiasi immagine in un file pronto per la stampa 3D, mantenendo
            colori e qualità grafica. Carica una tua foto o scegli una cover pronta: il risultato è sempre un pezzo
            unico, facilmente sostituibile ogni volta che vuoi rinnovare il look del tuo UUUK.
          </p>

          <div className="mt-8 rounded-2xl border border-white/15 bg-[#0f1e39]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] md:max-w-xl">
            <span className="inline-flex rounded-full border border-[#8ee4c4]/45 bg-[#8ee4c4]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c8fff0]">
              Collabora con noi
            </span>
            <p className="mt-4 text-sm leading-relaxed text-[#dce8ff] md:text-base">
              Sei un&apos;artista o un brand? Le nostre collezioni nascono da collaborazioni: valorizziamo il tuo
              lavoro con una percentuale sulle vendite, con bonus extra al raggiungimento di obiettivi.
            </p>
          </div>
        </ShowOnView>

        <ShowOnView className="relative md:col-span-6" fadeIn="rightLeft">
          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="pointer-events-none absolute -left-8 top-8 h-28 w-28 rounded-full bg-[#f97516]/25 blur-2xl" />
            <div className="pointer-events-none absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-[#8ee4c4]/20 blur-2xl" />

            <div className="rounded-[28px] border border-white/15 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
              <StaticImage
                src="../../images/triadics.png"
                alt="Cover UUUK personalizzabili"
                width={760}
                height={520}
                className="rounded-2xl"
                objectFit="contain"
                objectPosition="center"
                layout="constrained"
              />
            </div>
          </div>
        </ShowOnView>
      </div>
    </Section>
  )
}

export default ArtCustomization
