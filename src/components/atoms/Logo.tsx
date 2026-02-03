import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'

const Logo = (
  { size, className }: { size?: number; className?: string }
) => {
  return (
    <div
      className={`fixed mix-blend-difference top-2 left-4 z-50 w-fit cursor-none ${className || ''}`}
      role="button"
      tabIndex={0}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <StaticImage
        src="../../images/logo.png"
        alt="UUUK Logo"
        width={size ?? 60}
        height={size ?? 60}
        imgStyle={{
          // approximate colorize filter to tint the white logo to #ecddbe
          filter:
            'invert(97%) sepia(18%) saturate(608%) hue-rotate(8deg) brightness(103%) contrast(91%)',
          WebkitFilter:
            'invert(97%) sepia(18%) saturate(608%) hue-rotate(8deg) brightness(103%) contrast(91%)',
        }}
      />
    </div>
  )
}

export default Logo