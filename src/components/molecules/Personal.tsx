import React from 'react'
import Section from './Section'
import ShowOnView from './ShowOnView'
import { StaticImage } from 'gatsby-plugin-image'
import HighlightedText from '../atoms/HighlightedText'
import Typography from '../atoms/Typography'

const Personal = () => {
  return (
    <Section id={'section2_3'} bgColor='bg-[#0b1122]' shapeColor='text-white' preset='center'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_80%,rgba(249,117,22,0.28),transparent_36%),radial-gradient(circle_at_85%_14%,rgba(154,208,255,0.2),transparent_35%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_13px)]' />

      <div className='relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 py-14 md:grid-cols-12 md:py-20'>
        <ShowOnView className='relative md:col-span-7' fadeIn='leftRight'>
          <div className='relative mx-auto w-full max-w-[40rem]'>
            <div className='rounded-[28px] border border-white/20 p-4 shadow-[0_20px_44px_rgba(0,0,0,0.45)]'>
              <StaticImage
                src='../../images/triadics.png'
                alt='Triadics Cover Options'
                width={980}
                height={560}
                className='rounded-2xl'
                objectFit='contain'
                objectPosition='center'
                layout='constrained'
              />
            </div>

          </div>
        </ShowOnView>

        <ShowOnView className='!items-start !text-left md:col-span-5' fadeIn='rightLeft'>
          <span className='inline-flex rounded-full border border-[#ffb170]/40 bg-[#f97516]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffcb9b]'>
            Stile personale
          </span>

          <Typography variant='h2' render='div' className='[perspective:400px] !text-white mt-6 mb-6'>
            <h2 className='text-5xl md:text-7xl font-bold uppercase [transform:rotateY(-18deg)]'>Personale</h2>
          </Typography>

          <div className='rounded-2xl border border-white/20 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]'>
            <Typography variant='p' className='!mx-0 !max-w-none !mt-0 text-left !text-[#dbe7ff]'>
              Cambia la cover <HighlightedText text='Plug & Play' /> per rappresentare cio a cui tieni
              <br />
              L'occhio vuole la sua parte
            </Typography>
          </div>
        </ShowOnView>
      </div>
    </Section>
  )
}

export default Personal