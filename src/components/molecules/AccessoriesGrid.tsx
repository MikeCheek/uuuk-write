import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'

const iconProps = {
  className: 'h-8 w-8',
  strokeWidth: 1.6,
  stroke: 'currentColor',
  fill: 'none',
  viewBox: '0 0 24 24',
}

const ClipIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4a4 4 0 0 1 8 0v10a2 2 0 1 1-4 0V7" />
    <rect x="6" y="3" width="12" height="4" rx="1.4" />
  </svg>
)

const PenIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 4.5 5 5L8 21H3v-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m12.5 6.5 5 5" />
  </svg>
)

const CardIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path strokeLinecap="round" d="M3 10h18M7 14h4" />
  </svg>
)

const BookmarkIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v18l-6-4-6 4z" />
  </svg>
)

const ACCESSORIES = [
  { icon: ClipIcon, name: 'Clip fermapagina', description: 'Tiene ferme le pagine mentre scrivi, in mobilità o al tavolo.' },
  { icon: PenIcon, name: 'Porta penne', description: 'Aggancio modulare per non separarti mai dalla tua penna preferita.' },
  { icon: CardIcon, name: 'Borsello porta carte', description: 'Uno spazio interno per carte, biglietti da visita e piccoli documenti.' },
  { icon: BookmarkIcon, name: 'Segnalibri', description: 'Personalizzabili, per ritrovare subito il punto in cui eri rimasto.' },
]

const AccessoriesGrid = () => {
  return (
    <Section id="accessori" bgColor="bg-[#0b1122]" shapeColor="text-white" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_80%,rgba(249,117,22,0.2),transparent_36%),radial-gradient(circle_at_82%_16%,rgba(154,208,255,0.18),transparent_36%)]" />

      <div className="relative z-10 w-full max-w-6xl py-16 md:py-24">
        <ShowOnView className="!items-start !text-left" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#dbe6ff]">
            Accessori
          </span>
          <Typography variant="h2" render="div" className="!mb-6 mt-5 !text-white uppercase">
            <h2 className="text-3xl font-black leading-[0.95] md:text-5xl">Pensati per il tuo quotidiano</h2>
          </Typography>
          <p className="max-w-2xl text-base leading-relaxed text-[#b8c5e6] md:text-lg">
            Ogni accessorio è stampato in 3D con lo stesso spirito modulare di UUUK: si aggancia, si sostituisce, si
            personalizza.
          </p>
        </ShowOnView>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-4">
          {ACCESSORIES.map(({ icon: Icon, name, description }) => (
            <ShowOnView key={name} className="!items-start !text-left h-full" fadeIn="bottomUp">
              <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-[#0f1e39]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#ffb170]/40 bg-[#f97516]/15 text-[#ffcb9b]">
                  <Icon />
                </span>
                <h3 className="mt-4 font-heading text-lg uppercase text-white">{name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#dce8ff]">{description}</p>
              </article>
            </ShowOnView>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default AccessoriesGrid
