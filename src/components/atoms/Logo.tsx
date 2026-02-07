import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'

const Logo = (
  { className, onlyBlack = false }: { className?: string, onlyBlack?: boolean }
) => {
  return (
    <div
      className={`fixed ${onlyBlack ? 'cursor-auto' : 'mix-blend-difference cursor-none'} top-2 left-4 z-50 w-fit ${className || ''}`}
      role="button"
      tabIndex={0}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <StaticImage
        src="../../images/logo.png"
        alt="UUUK Logo"
        width={60}
        height={60}
        className={className || ''}
        imgStyle={!onlyBlack ? {
          // approximate colorize filter to tint the white logo to #ecddbe
          filter:
            'invert(97%) sepia(18%) saturate(608%) hue-rotate(8deg) brightness(103%) contrast(91%)',
          WebkitFilter:
            'invert(97%) sepia(18%) saturate(608%) hue-rotate(8deg) brightness(103%) contrast(91%)',
        } : {
          fill: '#000000',
          color: '#000000'
        }}
      />
    </div>
  )
}

export default Logo