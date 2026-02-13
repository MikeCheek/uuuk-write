import React, { useState } from 'react'
import Slider from 'react-slick'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OrderNow from '../atoms/Button';

const Showcase = ({ data, opened, openModal }: { data: any[], opened: boolean, openModal: () => void }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleBeforeChange = React.useCallback((_: any, next: number) => {
    setActiveSlide(next)
  }, [])

  const sliderSettings = React.useMemo(() => ({
    dots: false,
    arrows: true,
    lazyLoad: 'progressive' as const,
    infinite: true,
    centerMode: true,
    speed: opened ? 200 : 3000,
    slidesToShow: 3,
    centerPadding: "60px",
    pauseOnHover: true,
    waitForAnimate: false,
    slidesToScroll: 1,
    autoplay: !opened,
    autoplaySpeed: 3000,
    cssEase: 'linear' as const,
    swipeToSlide: false,
    className: 'h-fit relative overflow-x-hidden',
    beforeChange: handleBeforeChange,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: opened,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }), [opened, handleBeforeChange])

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <button
        type="button"
        className={`top-1/2 -translate-y-1/2 absolute flex items-center justify-center w-10 h-10 rounded-full bg-black text-beige ring-2 ring-beige transition-all hover:scale-105 ${opened ? 'opacity-100' : 'opacity-0'}`}
        style={{ ...style, display: "flex", right: opened ? "20px" : "-50px", zIndex: 20 }}
        onClick={onClick}
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    );
  }

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <button
        type="button"
        className={`top-1/2 -translate-y-1/2 absolute flex items-center justify-center w-10 h-10 rounded-full bg-black text-beige ring-2 ring-beige transition-all hover:scale-105 ${opened ? 'opacity-100' : 'opacity-0'}`}
        style={{ ...style, display: "flex", left: opened ? "20px" : "-50px", zIndex: 20 }}
        onClick={onClick}
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <div className='w-screen relative'>
        {/* left/right gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none z-10">
          <div className="h-full bg-gradient-to-r from-black to-transparent" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10">
          <div className="h-full bg-gradient-to-l from-black to-transparent" />
        </div>

        <Slider nextArrow={<NextArrow />} prevArrow={<PrevArrow />} {...sliderSettings}>
          {data.map(({ node, format, collection }: { format: string, collection: string, node: { name: string, relativePath?: string, childImageSharp: { gatsbyImageData: IGatsbyImageData } } }, index: number) => (
            <div className='!flex flex-col justify-center items-center' key={node.relativePath ?? node.name ?? index}>
              <div
                className={`w-3/4 h-auto transition-transform duration-1000 ${opened ? `scale-70 translate-y-0` : `scale-90 -translate-y-5`}`}
              >
                <GatsbyImage
                  image={node.childImageSharp.gatsbyImageData}
                  className={`${format === 'A5' ? `!scale-[0.9]` : format === 'A6' ? `!scale-[0.7]` : `!scale-[0.4]`}`}
                  alt={`Cover Image ${index + 1}`}
                />
              </div>
              <p className={`text-beige text-xl font-bold transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0'}`}>{node.name}</p>
              <div className={`flex gap-2 mt-2 transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-sm bg-black text-beige px-3 border-2 border-beige py-1 rounded-full uppercase tracking-wide">{collection}</span>
                <span className="text-sm bg-black text-beige px-3 border-2 border-beige py-1 rounded-full uppercase tracking-wide">{format}</span>
              </div>
            </div>
          ))}
        </Slider>

      </div>
      {opened ? <div className='mt-4 absolute bottom-12 md:bottom-8 left-1/2 -translate-x-1/2'><OrderNow onClick={openModal} small /></div> : <></>}
    </>
  )
}

export default React.memo(Showcase, (prev, next) =>
  prev.opened === next.opened && prev.data === next.data
)

// export default Showcase