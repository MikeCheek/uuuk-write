import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import Typography from '../atoms/Typography'
import { StaticImage } from 'gatsby-plugin-image'

const ProjectIdentity = () => {
  return (
    <Section id='section_vision_mission_manifesto' bgColor='bg-[#101625]' shapeColor='text-white' preset='center'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_16%,rgba(249,117,22,0.26),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(93,159,255,0.25),transparent_36%),radial-gradient(circle_at_50%_86%,rgba(142,228,196,0.16),transparent_40%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(244,248,255,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(244,248,255,0.13)_1px,transparent_1px)] [background-size:30px_30px]' />

      <div className='relative z-10 w-full max-w-6xl py-16 md:py-24'>
        <ShowOnView className='!items-start !text-left w-full' fadeIn='topDown'>
          <div className='inline-flex items-center gap-2 rounded-full border border-[#ffb170]/40 bg-[#f97516]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]'>
            Identita UUUK
          </div>

          <Typography variant='h2' render='div' className='!text-white !mb-6 mt-5 uppercase [perspective:500px] max-w-4xl'>
            <h2 className='text-4xl md:text-6xl font-black leading-[0.9] [transform:rotateY(-10deg)]'>
              Visione
            </h2>
            <h2 className='text-4xl md:text-6xl font-black leading-[0.9] text-[#9ad0ff] ml-6 md:ml-14'>
              Missione
            </h2>
            <h2 className='text-4xl md:text-6xl font-black leading-[0.9] text-[#8ee4c4] ml-12 md:ml-24'>
              Manifesto
            </h2>
          </Typography>

          <p className='text-base md:text-lg leading-relaxed text-[#dce8ff] max-w-3xl'>
            UUUK nasce per riportare al centro il valore della scrittura, della modularita e dell&apos;ispirazione quotidiana.
          </p>
        </ShowOnView>

        <ShowOnView className='mt-10 md:mt-12 !items-center w-full' fadeIn='bottomUp'>
          <div className='relative w-full max-w-4xl h-[180px] md:h-[260px]'>
            <div className='absolute left-4 top-2 md:left-10 md:top-4 w-[130px] md:w-[210px] rotate-[-9deg]'>
              <StaticImage
                src='../../images/collezioni/M(O_O)D/A6/(◣ _ ◢).png'
                alt='Cover UUUK Triadic Flusso'
                className='rounded-xl shadow-[0_16px_34px_rgba(0,0,0,0.45)]'
                placeholder='blurred'
                loading='eager'
              />
            </div>

            <div className='absolute left-1/2 top-0 -translate-x-1/2 w-[140px] md:w-[230px] rotate-[3deg] z-10'>
              <StaticImage
                src='../../images/collezioni/TRIADIC/A6/Occhio.png'
                alt='Cover UUUK Triadic Occhio'
                className='rounded-xl shadow-[0_18px_42px_rgba(0,0,0,0.48)]'
                placeholder='blurred'
                loading='eager'
              />
            </div>

            <div className='absolute right-4 top-3 md:right-10 md:top-6 w-[130px] md:w-[210px] rotate-[10deg]'>
              <StaticImage
                src='../../images/collezioni/TRIADIC/A7/Punto.png'
                alt='Cover UUUK Triadic Punto'
                className='rounded-xl shadow-[0_16px_34px_rgba(0,0,0,0.45)]'
                placeholder='blurred'
                loading='eager'
              />
            </div>
          </div>
        </ShowOnView>

        <div className='mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-7'>
          <ShowOnView className='!items-start !text-left h-full md:col-span-4' fadeIn='leftRight'>
            <article className='group relative h-full overflow-hidden rounded-2xl border border-white/15 bg-[#0f1e39]/80 p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
              <div className='pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f97516]/35 blur-2xl transition-transform duration-500 group-hover:scale-125' />
              <span className='inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ffcb9b]'>
                Vision
              </span>
              <h3 className='mt-4 font-heading text-2xl md:text-3xl text-white uppercase'>Accessibile</h3>
              <p className='mt-4 text-[#dce8ff] text-base md:text-lg leading-relaxed'>
                UUUK vuole rendere alla portata di tutti i vantaggi che derivano dal possedere un&apos;agenda multifunzionale e modulare.
              </p>
            </article>
          </ShowOnView>

          <ShowOnView className='!items-start !text-left h-full md:col-span-8' fadeIn='topDown'>
            <article className='group relative h-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#132447]/85 to-[#0f1e39]/80 p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
              <div className='pointer-events-none absolute right-0 top-0 h-24 w-24 border-r border-t border-[#9ad0ff]/30 rounded-tr-2xl' />
              <span className='inline-flex rounded-full border border-[#9ad0ff]/45 bg-[#9ad0ff]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#cfe5ff]'>
                Mission
              </span>
              <h3 className='mt-4 font-heading text-2xl md:text-3xl text-white uppercase'>Modularita che ispira</h3>
              <p className='mt-4 text-[#dce8ff] text-base md:text-lg leading-relaxed'>
                La nostra missione e quella di unire i benefici della modularita per organizzare al meglio i propri impegni, con grafiche ed opere d&apos;arte in modo da ispirare le tue giornate. UUUK si propone come lo strumento alla portata di tutti coloro che vogliono il meglio della loro quotidianita, e che vogliono lasciare un&apos;impronta della loro vita scrivendola.
              </p>
            </article>
          </ShowOnView>

          <ShowOnView className='!items-start !text-left h-full md:col-span-12' fadeIn='rightLeft'>
            <article className='relative overflow-hidden rounded-2xl border border-white/15 bg-[#0f1e39]/85 p-6 md:p-9 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
              <div className='pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#f97516] via-[#9ad0ff] to-[#8ee4c4]' />
              <div className='pointer-events-none absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-[#8ee4c4]/30 blur-2xl' />
              <span className='inline-flex rounded-full border border-[#8ee4c4]/45 bg-[#8ee4c4]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c8fff0]'>
                Manifesto
              </span>
              <p className='mt-4 text-[#eaf2ff] text-base md:text-lg leading-relaxed md:columns-2 md:gap-10'>
                UUUK crede che dietro ogni persona ci sia una storia unica che aspetta solo di essere raccontata, ricca di emozioni e di avvenimenti memorabili. Dentro le persone si nasconde un enorme potenziale inespresso e l&apos;unico modo per innescarlo e attraverso l&apos;atto della scrittura. Crediamo che l&apos;arte e l&apos;espressione attraverso ogni forma artistica sia di fondamentale importanza per continuare ad ispirare ogni giorno. In un&apos;era dove tutto procede velocemente e piena di distrazioni vogliamo riportare indietro questo strumento e cercare di riportare chiarezza dentro di noi.
              </p>
            </article>
          </ShowOnView>
        </div>
      </div>
    </Section>
  )
}

export default ProjectIdentity
