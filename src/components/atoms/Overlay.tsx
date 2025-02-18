import React, { useCallback, useEffect, useState } from 'react'
import { Scroll, useScroll } from '@react-three/drei'
import gsap from 'gsap'

const Overlay = () => {
  const scrollRef = useScroll();
  const [currentStep, setCurrentStep] = useState(0)

  const goToPage = useCallback(
    (page: number) => {
      const pageHeight = scrollRef.el.scrollHeight / scrollRef.pages;
      const targetScroll = pageHeight * page;

      gsap.to(scrollRef.el, {
        duration: 1,
        scrollTop: targetScroll,
        ease: 'ease-out',
      });

      setCurrentStep(page);
    },
    [scrollRef]
  )

  return (
    <Scroll html>

    </Scroll>
  )
}

export default Overlay