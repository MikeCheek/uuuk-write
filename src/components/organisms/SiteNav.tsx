import React, { useState } from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import Button from '../atoms/Button'

const NAV_LINKS: { to: string; label: string }[] = [
  { to: '/storia', label: 'Storia' },
  { to: '/prodotto', label: 'Prodotto' },
  { to: '/personalizzazione', label: 'Personalizza' },
  { to: '/sostenibilita', label: 'Sostenibilità' },
]

/**
 * Global top navigation used across the marketing pages (home, storia,
 * prodotto, personalizzazione, sostenibilita). Kept out of /galleria,
 * /arena and /carrello on purpose, those routes are untouched.
 */
const SiteNav = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-[100]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-4 md:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="UUUK — Home">
          <StaticImage
            src="../../images/logo.png"
            alt="UUUK"
            width={34}
            height={34}
            className="rounded-lg"
            imgStyle={{
              filter: 'invert(97%) sepia(18%) saturate(608%) hue-rotate(8deg) brightness(103%) contrast(91%)',
            }}
          />
          <span className="hidden font-heading text-sm tracking-[0.22em] text-[#f3f7ff] sm:inline">UUUK</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-[#0b1122]/70 px-2 py-1.5 backdrop-blur-md md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#dbe6ff] transition-colors hover:bg-white/10 hover:text-[#ffb170]"
              activeClassName="bg-[#f97516]/20 !text-[#ffb170]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/galleria" text="Galleria" variant="tertiary" small className="hidden sm:inline-flex" />
          <Button href="/galleria" text="Ordina ora" variant="primary" small />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0b1122]/70 text-[#f3f7ff] backdrop-blur-md md:hidden"
          >
            <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-4 mt-3 flex flex-col gap-1 rounded-2xl border border-white/15 bg-[#0b1122]/95 p-3 backdrop-blur-md md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-bold uppercase tracking-wide text-[#dbe6ff] hover:bg-white/10 hover:text-[#ffb170]">
            Home
          </Link>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-bold uppercase tracking-wide text-[#dbe6ff] hover:bg-white/10 hover:text-[#ffb170]"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/galleria" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-bold uppercase tracking-wide text-[#ffb170]">
            Galleria
          </Link>
        </nav>
      )}
    </header>
  )
}

export default SiteNav
