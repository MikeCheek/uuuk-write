import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'
import { StaticImage } from 'gatsby-plugin-image'

const STEPS = [
  {
    number: '01',
    title: 'Binder',
    accent: 'border-[#ffb170]/40 bg-[#f97516]/15 text-[#ffcb9b]',
    description: 'La fibbia in TPU aggancia cover anteriore e posteriore: elastica, resistente a urti, raggi UV e sostanze chimiche. Anche il binder si personalizza nel colore.',
  },
  {
    number: '02',
    title: 'Sidebar',
    accent: 'border-[#9ad0ff]/45 bg-[#9ad0ff]/15 text-[#cfe5ff]',
    description: 'I fascicoli modulari da 32 a 64/80 pagine si inseriscono nella sidebar: fino a 6/7 fascicoli per agenda, diario o bullet journal, combinabili come vuoi.',
  },
  {
    number: '03',
    title: 'Cover',
    accent: 'border-[#8ee4c4]/45 bg-[#8ee4c4]/15 text-[#c8fff0]',
    description: 'Scegli o carica una grafica: con Hueforge ogni immagine diventa una cover stampata in 3D. Si sostituisce in un istante, senza attrezzi.',
  },
]

const FORMATS = [
  { name: 'A5', tagline: 'Il formato base', detail: 'Massimo spazio per scrivere, disegnare e organizzare progetti importanti.' },
  { name: 'A6', tagline: 'Compatto e agile', detail: 'Perfetto da portare sempre con te, tra zaino, borsa e scrivania.' },
  { name: 'A7 tascabile', tagline: 'Sempre in tasca', detail: 'La versione tascabile per appunti veloci, ovunque tu sia.' },
]

const HowItWorks = () => {
  return (
    <Section id="how-it-works" bgColor="bg-[#101625]" shapeColor="text-white" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(249,117,22,0.22),transparent_36%),radial-gradient(circle_at_86%_18%,rgba(93,159,255,0.22),transparent_36%)]" />

      <div className="relative z-10 w-full max-w-6xl py-16 md:py-24">
        <ShowOnView className="!items-start !text-left" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]">
            Il sistema
          </span>
          <Typography variant="h2" render="div" className="!mb-6 mt-5 !text-white uppercase">
            <h2 className="text-3xl font-black leading-[0.95] md:text-6xl">3 pezzi, infinite combinazioni</h2>
          </Typography>
          <p className="max-w-2xl text-base leading-relaxed text-[#dce8ff] md:text-lg">
            Nessun compromesso tra funzionalità e resistenza: ogni UUUK nasce da tre elementi che non limitano mai
            l&apos;uso del prodotto.
          </p>
        </ShowOnView>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3">
          {STEPS.map((step) => (
            <ShowOnView key={step.number} className="!items-start !text-left h-full" fadeIn="bottomUp">
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0f1e39]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] md:p-7">
                <span className="font-heading text-4xl text-white/15">{step.number}</span>
                <span className={`mt-3 inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${step.accent}`}>
                  {step.title}
                </span>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#dce8ff] md:text-base">{step.description}</p>
              </article>
            </ShowOnView>
          ))}
        </div>

        <ShowOnView className="mt-10 md:mt-14" fadeIn="bottomUp">
          <div className="relative mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div className="col-span-2 overflow-hidden rounded-2xl border border-white/15 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.35)] md:col-span-2">
              <StaticImage src="../../images/sidebar.png" alt="Sistema sidebar UUUK" className="rounded-xl" placeholder="blurred" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.35)]">
              <StaticImage src="../../images/spareParts/binders/1.png" alt="Binder in TPU" className="rounded-xl" placeholder="blurred" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.35)]">
              <StaticImage src="../../images/spareParts/sidebar-a5/1.png" alt="Sidebar formato A5" className="rounded-xl" placeholder="blurred" />
            </div>
          </div>
        </ShowOnView>

        <ShowOnView className="mt-14 !items-start !text-left md:mt-20" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-[#9ad0ff]/45 bg-[#9ad0ff]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#cfe5ff]">
            Formati
          </span>
          <h3 className="mt-5 font-heading text-2xl uppercase text-white md:text-4xl">Un formato per ogni giornata</h3>
        </ShowOnView>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {FORMATS.map((format) => (
            <ShowOnView key={format.name} className="!items-start !text-left h-full" fadeIn="leftRight">
              <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-gradient-to-br from-[#132447]/85 to-[#0f1e39]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <h4 className="font-heading text-3xl uppercase text-white">{format.name}</h4>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#ffb170]">{format.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#dce8ff] md:text-base">{format.detail}</p>
              </article>
            </ShowOnView>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default HowItWorks
