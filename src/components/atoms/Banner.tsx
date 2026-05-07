import React from 'react'
import Button from './Button'
import Instagram from '../../assets/instagram.svg'

const Banner = () => {
  return (
    <div className='w-full h-44 md:h-56 border-y border-white/10 bg-[#0b1122] text-white font-bold flex flex-col items-center justify-center md:justify-center px-4 md:px-8 gap-4 md:gap-8'>
      <div className="w-full overflow-hidden relative">
        <>
          <span
            aria-hidden="true"
            className="absolute left-0 inset-y-0 w-10 pointer-events-none z-20 bg-gradient-to-r from-[#0b1122] to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute right-0 inset-y-0 w-10 pointer-events-none z-20 bg-gradient-to-l from-[#0b1122] to-transparent"
          />
        </>
        <div className="w-full overflow-hidden">

          {/* two identical copies for a seamless loop; starts fully visible (translateX(0)) */}
          <div className="marquee-track">
            <p className="marquee-item text-xl md:text-4xl uppercase whitespace-nowrap tracking-wide">
              Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀
            </p>
            <p className="marquee-item text-xl md:text-4xl uppercase whitespace-nowrap tracking-wide">
              Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀
            </p>
          </div>
        </div>
      </div>
      <Button
        href="https://www.instagram.com/uuuk.notes/"
        text="Dai un'occhiata"
        icon={<Instagram className="h-4 w-4 md:h-6 md:w-6" fill="black" />}
        className="md:ml-4 cursor-none px-4 py-3 md:px-8 md:text-lg"
      />
    </div>
  )
}

export default Banner