import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Slider from 'react-slick'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { isMobile, isTablet } from '../../utilities/mediaQueries'

const Hero3 = ({ data, opened }: { data: any[], opened: boolean }) => {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0);

  // const isActive = (index: number) =>
  //   isMobile ? activeSlide === index :
  //     isTablet ? activeSlide === index || activeSlide === (index + 1) % data.allFile.edges.length :
  //       (activeSlide + 1) % data.allFile.edges.length === index

  return (
    <>
      {/* <Section id="section3" bgColor='bg-beige' shapeColor='text-black' preset='center'> */}
      {/* <ShowOnView className='mb-20'>
        <Typography variant="p" className='text-center text-black' dangerouslySetInnerHTML>
          {renderText(t("Hero4Text"))}
        </Typography>
      </ShowOnView> */}
      <div className='w-screen'>
        <Slider
          dots={false}
          arrows={false}
          lazyLoad='progressive'
          infinite
          centerMode
          speed={opened ? 200 : 3000}
          slidesToShow={3}
          centerPadding="60px"
          pauseOnHover
          waitForAnimate={false}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={3000}
          cssEase='linear'
          swipeToSlide={false}
          className='h-fit relative'
          beforeChange={(_, next) => {
            setActiveSlide(next);
          }}
          responsive={[
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
                // dots: true,
              },
            },
          ]}
        >
          {data.map(({ node, format, collection }: { format: string, collection: string, node: { name: string, relativePath: string, childImageSharp: { gatsbyImageData: IGatsbyImageData } } }, index: number) => (
            <div className='!flex flex-col justify-center items-center' key={index}>
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
      {/* </Section> */}
    </>
  )
}

export default Hero3