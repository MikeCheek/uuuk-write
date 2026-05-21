import React, { useMemo } from 'react'

// @ts-ignore
import 'slick-carousel/slick/slick.css'
// @ts-ignore
import 'slick-carousel/slick/slick-theme.css'

import Slider from 'react-slick'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'

interface SparePartImageSliderProps {
  images: IGatsbyImageData[]
  alt: string
  className?: string
  imageClassName?: string
  arrowsClassName?: string
}

const SparePartImageSlider = ({
  images,
  alt,
  className = '',
  imageClassName = '',
  arrowsClassName = '',
}: SparePartImageSliderProps) => {
  const hasMultipleImages = images.length > 1

  const sliderSettings = useMemo(() => ({
    dots: false,
    arrows: hasMultipleImages,
    infinite: hasMultipleImages,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    lazyLoad: 'progressive' as const,
    speed: 350,
    cssEase: 'ease-out' as const,
    className: 'w-full',
  }), [hasMultipleImages])

  const ArrowButton = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick?: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Immagine precedente' : 'Immagine successiva'}
      className={`absolute top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0b1122]/90 text-white shadow-lg transition-transform hover:scale-105 ${direction === 'prev' ? 'left-3' : 'right-3'} ${arrowsClassName}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={direction === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  )

  if (!images.length) return null

  if (!hasMultipleImages) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
        <GatsbyImage
          image={images[0]}
          alt={alt}
          className={`h-full w-full object-contain ${imageClassName}`}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Slider prevArrow={<ArrowButton direction="prev" />} nextArrow={<ArrowButton direction="next" />} {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} className="!flex h-full items-center justify-center">
            <GatsbyImage
              image={image}
              alt={`${alt} ${index + 1}`}
              className={`h-full w-full object-contain ${imageClassName}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default SparePartImageSlider