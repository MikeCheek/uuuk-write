import React, { useState } from 'react'
import Section from './Section'
import Typography from '../atoms/Typography'
import ShowOnView from './ShowOnView'
import { useTranslation } from 'react-i18next'
import Slider from 'react-slick'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero4 = () => {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0);

  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const isTablet = window.matchMedia('(max-width: 1024px)').matches

  const isActive = (index: number) =>
    isMobile ? activeSlide === index :
      isTablet ? activeSlide === index || activeSlide === index + 1 :
        activeSlide + 1 === index

  const data = useStaticQuery(graphql`
   query {
      allFile(
        filter: {
          extension: { regex: "/(jpg)|(jpeg)|(png)/" }
          name: { regex: "/cover/" }
        }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                layout: CONSTRAINED
              )
            }
          }
        }
      }
    }
  `)

  return (
    <Section id="section4" bgColor='bg-beige' shapeColor='text-black' preset='center'>
      <ShowOnView className='mb-20'>
        <Typography variant="p" className='text-center text-black' dangerouslySetInnerHTML>
          {t("Hero4Text")}
        </Typography>
      </ShowOnView>
      <div className='w-screen'>
        <Slider
          dots={false}
          lazyLoad='progressive'
          infinite
          centerMode
          speed={1000}
          slidesToShow={3}
          centerPadding="60px"
          pauseOnHover
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
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {data.allFile.edges.map(({ node }: { node: { childImageSharp: { gatsbyImageData: IGatsbyImageData } } }, index: number) => (
            <div className='!flex justify-center items-center' key={index}>
              <GatsbyImage
                className={`w-3/4 h-auto transition-transform duration-1000 ${isActive(index) ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'}`}
                image={node.childImageSharp.gatsbyImageData}
                alt={`Cover Image ${index + 1}`}
              /></div>
          ))}
        </Slider>
      </div>
    </Section>
  )
}

export default Hero4