import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'

const STATS = [
  { value: '64%', label: 'dei consumatori nel mondo preferisce brand eco-friendly', source: 'Nielsen, 2023' },
  { value: '100%', label: 'riciclabile: il PETG usato per le cover può tornare filamento', source: 'Materiale UUUK' },
  { value: '-40%', label: 'il costo delle stampanti 3D dal 2018, per una filiera più accessibile', source: 'Trend di mercato' },
]

const CYCLE = [
  { step: '01', title: 'Stampa in PETG riciclato', description: 'Le cover nascono da filamenti riciclati di marchi come Prusament, Formfutura e ProtoPasta, senza perdere qualità rispetto al materiale vergine.' },
  { step: '02', title: 'Uso quotidiano', description: 'Grazie alla resistenza chimica, agli UV e agli urti del PETG, ogni cover accompagna la tua routine a lungo, tra pioggia, vento e nuove avventure.' },
  { step: '03', title: 'Fine vita o reso', description: 'Quando vuoi cambiare grafica o il pezzo è a fine vita, può essere raccolto invece di diventare rifiuto.' },
  { step: '04', title: 'Nuovo filamento', description: 'L\'obiettivo è una filiera interna che trasforma scarti di produzione e resi in nuovo filamento, chiudendo il cerchio.' },
]

const CircularEconomy = () => {
  return (
    <Section id="circolarita" bgColor="bg-[#0b2a20]" shapeColor="text-white" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(27,181,127,0.3),transparent_36%),radial-gradient(circle_at_84%_80%,rgba(249,117,22,0.16),transparent_38%)]" />

      <div className="relative z-10 w-full max-w-6xl py-16 md:py-24">
        <ShowOnView className="!items-start !text-left" fadeIn="topDown">
          <span className="inline-flex rounded-full border border-[#8ee4c4]/45 bg-[#8ee4c4]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c8fff0]">
            Materiale &amp; impatto
          </span>
          <Typography variant="h2" render="div" className="!mb-6 mt-5 !text-white uppercase">
            <h2 className="text-3xl font-black leading-[0.95] md:text-6xl">Un&apos;agenda pensata per tornare</h2>
          </Typography>
          <p className="max-w-2xl text-base leading-relaxed text-[#dcf5ea] md:text-lg">
            Il PETG riciclato ci permette di garantire alta durabilità riducendo in modo sostanziale gli scarti
            rispetto agli standard del settore, senza compromessi su resistenza e qualità.
          </p>
        </ShowOnView>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3">
          {STATS.map((stat) => (
            <ShowOnView key={stat.label} className="!items-start !text-left h-full" fadeIn="bottomUp">
              <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                <span className="font-heading text-4xl text-[#8ee4c4] md:text-5xl">{stat.value}</span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#dcf5ea] md:text-base">{stat.label}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#8ee4c4]/70">{stat.source}</p>
              </article>
            </ShowOnView>
          ))}
        </div>

        <ShowOnView className="mt-14 !items-start !text-left md:mt-20" fadeIn="topDown">
          <h3 className="font-heading text-2xl uppercase text-white md:text-4xl">Il ciclo del materiale</h3>
        </ShowOnView>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-4">
          {CYCLE.map((item) => (
            <ShowOnView key={item.step} className="!items-start !text-left h-full" fadeIn="leftRight">
              <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-[#0f2a22]/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                <span className="font-heading text-3xl text-white/25">{item.step}</span>
                <h4 className="mt-3 font-heading text-base uppercase text-white md:text-lg">{item.title}</h4>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#dcf5ea]">{item.description}</p>
              </article>
            </ShowOnView>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default CircularEconomy
