import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'
import { StaticImage } from 'gatsby-plugin-image'

const CollectionsShowcase = () => {
  return (
    <Section id="collezioni" bgColor="bg-[#efe5d4]" shapeColor="text-darkBrown" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(27,181,127,0.2),transparent_38%),radial-gradient(circle_at_88%_82%,rgba(249,117,22,0.18),transparent_36%)]" />

      <div className="relative z-10 w-full max-w-6xl py-16 md:py-24">
        <ShowOnView className="!items-start !text-left" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-[#16a36e]/40 bg-[#16a36e]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0b6b49]">
            Collezioni firmate
          </span>
          <Typography variant="h2" render="div" className="!mb-6 mt-5 !text-[#0b1122] uppercase">
            <h2 className="text-3xl font-black leading-[0.95] md:text-6xl">Arte da indossare, ogni giorno</h2>
          </Typography>
          <p className="max-w-2xl text-base leading-relaxed text-[#2f241c] md:text-lg">
            Ogni collezione nasce dalla collaborazione con artisti: cover a tiratura limitata pensate per accompagnare
            stati d&apos;animo, stili e occasioni diverse.
          </p>
        </ShowOnView>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2">
          <ShowOnView className="!items-start !text-left h-full" fadeIn="leftRight">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0b1122]/10 bg-white/60 p-6 shadow-[0_14px_34px_rgba(11,17,34,0.14)] md:p-7">
              <span className="inline-flex w-fit rounded-full border border-[#0b1122]/15 bg-[#0b1122]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e2e63]">
                Collezione
              </span>
              <h3 className="mt-3 font-heading text-2xl uppercase text-[#0b1122] md:text-3xl">Triadic</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2f241c] md:text-base">
                Forme geometriche essenziali, ispirate al balletto triadico: Flusso, Occhio, Punto.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <StaticImage src="../../images/collezioni/TRIADIC/A6/Flusso.png" alt="Cover Triadic Flusso" className="rounded-lg" placeholder="blurred" />
                <StaticImage src="../../images/collezioni/TRIADIC/A6/Occhio.png" alt="Cover Triadic Occhio" className="rounded-lg" placeholder="blurred" />
                <StaticImage src="../../images/collezioni/TRIADIC/A6/Punto.png" alt="Cover Triadic Punto" className="rounded-lg" placeholder="blurred" />
              </div>
            </article>
          </ShowOnView>

          <ShowOnView className="!items-start !text-left h-full" fadeIn="rightLeft">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#0b1122]/10 bg-white/60 p-6 shadow-[0_14px_34px_rgba(11,17,34,0.14)] md:p-7">
              <span className="inline-flex w-fit rounded-full border border-[#0b1122]/15 bg-[#0b1122]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e2e63]">
                Collezione
              </span>
              <h3 className="mt-3 font-heading text-2xl uppercase text-[#0b1122] md:text-3xl">M(O_O)D</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2f241c] md:text-base">
                Emoticon che raccontano lo stato d&apos;animo della giornata: felice, arrabbiato, sorpreso, annoiato.
              </p>
              <div className="mt-5 flex justify-center">
                <div className="w-32 rotate-[-4deg]">
                  <StaticImage src='../../images/collezioni/M(O_O)D/A6/(◣ _ ◢).png' alt="Cover M(O_O)D" className="rounded-lg" placeholder="blurred" />
                </div>
              </div>
            </article>
          </ShowOnView>
        </div>
      </div>
    </Section>
  )
}

export default CollectionsShowcase
