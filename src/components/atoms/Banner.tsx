import React from 'react'
import Instagram from '../../assets/instagram.svg'

const Banner = () => {
  return (
    <div className='w-full h-40 md:h-52 bg-redBrick text-white font-bold flex flex-col items-center justify-center md:justify-center px-4 md:px-8 gap-4 md:gap-8'>
      <div className="w-full overflow-hidden relative">
        <>
          <span
            aria-hidden="true"
            className="absolute left-0 inset-y-0 w-10 pointer-events-none z-20 bg-gradient-to-r from-redBrick to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute right-0 inset-y-0 w-10 pointer-events-none z-20 bg-gradient-to-l from-redBrick to-transparent"
          />
        </>
        <div className="w-full overflow-hidden">

          {/* two identical copies for a seamless loop; starts fully visible (translateX(0)) */}
          <div className="marquee-track">
            <p className="marquee-item text-xl md:text-4xl uppercase whitespace-nowrap">
              Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀
            </p>
            <p className="marquee-item text-xl md:text-4xl uppercase whitespace-nowrap">
              Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀&nbsp; Seguici per scoprire le ultime novità! 👀
            </p>
          </div>
        </div>
      </div>
      <a title='Pagina Instagram' href="https://www.instagram.com/uuuk.notes/" target="_blank" rel="noopener noreferrer"
        className="md:ml-4 cursor-none px-4 md:px-8 py-3 md:text-lg font-medium rounded-lg text-white bg-transparent border border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-white transition duration-300 ease-in-out shadow-none hover:shadow-md transform hover:scale-105"
      >
        Dai un'occhiata
        <Instagram className="inline-block w-4 h-4 md:w-6 md:h-6 ml-2 -mt-1" fill="white" />
      </a>
    </div>
  )
}

export default Banner