import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className='mx-auto mt-6 pt-20 w-full border-t border-white/10 bg-[#0b1122] text-[#c7d6f8]'>
      <div className='mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 mb-20 md:grid-cols-3 md:px-10'>
        <div className='space-y-3'>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#f2f5ff]'>UUUK</p>
          <StaticImage
            src="../../images/logo.png"
            alt="UUUK Logo"
            width={56}
            height={56}
            className="h-14 w-14"
            imgClassName="object-contain"
          />
          <p className='max-w-sm text-sm leading-6 text-[#aebddd]'>
            Agende personalizzabili stampate 3d per chi vuole un prodotto unico, progettato intorno a sé.
          </p>
          <p className='text-sm text-[#aebddd]'>Supporto: <a href='mailto:uuuk.thefuture@gmail.com' className='text-[#ffb170] hover:underline'>uuuk.thefuture@gmail.com</a></p>
        </div>

        <div className='space-y-3'>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#f2f5ff]'>Link utili</p>
          <nav className='flex flex-col gap-2 text-sm text-[#aebddd]'>
            <Link to='/' className='transition-colors hover:text-[#ffb170]'>Home</Link>
            <Link to='/galleria' className='transition-colors hover:text-[#ffb170]'>Galleria</Link>
            {/* <Link to='/carrello' className='transition-colors hover:text-[#ffb170]'>Carrello</Link>
            <Link to='/feedback' className='transition-colors hover:text-[#ffb170]'>Feedback</Link> */}
          </nav>
        </div>

        <div className='space-y-3'>
          <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#f2f5ff]'>Seguici</p>
          <div className='flex flex-col gap-2 text-sm text-[#aebddd]'>
            <a
              href='https://www.instagram.com/uuuk.notes/'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-[#ffb170]'
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10 px-6 py-4 text-center text-sm text-[#8fa0ca] md:px-10'>
        &copy; {year} UUUK. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer