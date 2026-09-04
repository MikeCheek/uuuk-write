import React from 'react'
import { Link } from 'gatsby'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Button from '../atoms/Button'

type Pillar = {
  href: string
  tag: string
  tagColor: string
  title: string
  description: string
  cta: string
}

const PILLARS: Pillar[] = [
  {
    href: '/storia',
    tag: 'Storia',
    tagColor: 'border-[#9ad0ff]/45 bg-[#9ad0ff]/15 text-[#cfe5ff]',
    title: 'Vision, Missione & Manifesto',
    description: 'Perché nasce UUUK: la scrittura come strumento per lasciare un segno, un\'agenda pensata per ispirare ogni giornata.',
    cta: 'Scopri la storia',
  },
  {
    href: '/prodotto',
    tag: 'Prodotto',
    tagColor: 'border-[#ffb170]/40 bg-[#f97516]/15 text-[#ffcb9b]',
    title: 'Come funziona UUUK',
    description: 'Binder, sidebar e cover intercambiabili: il sistema modulare stampato in 3D che si adatta a te, in A5, A6 e tascabile.',
    cta: 'Scopri il sistema',
  },
  {
    href: '/personalizzazione',
    tag: 'Personalizza',
    tagColor: 'border-[#8ee4c4]/45 bg-[#8ee4c4]/15 text-[#c8fff0]',
    title: 'Arte, cover e accessori',
    description: 'Collezioni firmate da artisti, foto trasformate in grafiche con Hueforge e accessori pensati per la tua quotidianità.',
    cta: 'Personalizza il tuo UUUK',
  },
  {
    href: '/sostenibilita',
    tag: 'Sostenibilità',
    tagColor: 'border-[#16a36e]/45 bg-[#16a36e]/15 text-[#c8ffe6]',
    title: 'Circolare per natura',
    description: 'Stampato in PETG riciclato, pensato per essere riciclato di nuovo: nessun compromesso tra design e impatto ambientale.',
    cta: 'Scopri l\'impatto',
  },
]

const ExplorePillars = () => {
  return (
    <Section id="explore-pillars" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(249,117,22,0.16),transparent_36%),radial-gradient(circle_at_84%_82%,rgba(154,208,255,0.14),transparent_38%)]" />

      <div className="relative z-10 w-full max-w-6xl py-16 md:py-24">
        <ShowOnView className="!items-start !text-left" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#dbe6ff]">
            Esplora UUUK
          </span>
          <h2 className="mt-5 max-w-2xl font-heading text-3xl uppercase leading-[0.95] text-[#f3f7ff] md:text-5xl">
            Un prodotto, quattro storie da scoprire
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
            Ogni UUUK racchiude una filosofia, un sistema tecnico, un gesto artistico e una scelta responsabile.
            Scegli da dove iniziare.
          </p>
        </ShowOnView>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {PILLARS.map((pillar, i) => (
            <ShowOnView key={pillar.href} className="!items-stretch !text-left h-full" fadeIn={i % 2 === 0 ? 'leftRight' : 'rightLeft'}>
              <Link
                to={pillar.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0f1e39]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 md:p-8"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f97516]/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${pillar.tagColor}`}>
                  {pillar.tag}
                </span>
                <h3 className="mt-4 font-heading text-xl uppercase text-white md:text-2xl">{pillar.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#dce8ff] md:text-base">{pillar.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#ffb170]">
                  {pillar.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </ShowOnView>
          ))}
        </div>

        <ShowOnView className="mt-12 md:mt-16" fadeIn="bottomUp">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-gradient-to-br from-[#132447]/85 to-[#0f1e39]/80 p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.35)] md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="font-heading text-xl uppercase text-white md:text-2xl">Pronto a montare il tuo UUUK?</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#dce8ff] md:text-base">
                Sfoglia le collezioni disponibili e configura formato, sidebar e cover nella galleria.
              </p>
            </div>
            <Button href="/galleria" text="Vai alla galleria" />
          </div>
        </ShowOnView>
      </div>
    </Section>
  )
}

export default ExplorePillars
