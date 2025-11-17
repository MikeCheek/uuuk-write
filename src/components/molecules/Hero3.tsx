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
          arrows={false}
          className='h-fit'
          beforeChange={(_, next) => {
            setActiveSlide(next);
          }}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: opened,
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
          {data.map(({ node }: { node: { name: string, relativePath: string, childImageSharp: { gatsbyImageData: IGatsbyImageData } } }, index: number) => (
            <div className='!flex flex-col justify-center items-center' key={index}>
              <GatsbyImage
                className={`w-3/4 h-auto transition-transform duration-1000 ${opened ? 'scale-100 translate-y-0' : 'scale-80 -translate-y-5'}`}
                // ${isActive(index) ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'}
                image={node.childImageSharp.gatsbyImageData}
                alt={`Cover Image ${index + 1}`}
              />
              <p className={`text-beige transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0'}`}>{node.name}</p>
            </div>
          ))}
        </Slider>
      </div>
      {/* </Section> */}
    </>
  )
}

export default Hero3