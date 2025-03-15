import React, { useLayoutEffect, useRef } from 'react'
import scrollingSteps from '../../utilities/scrollingSteps'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Group } from 'three'
import { StaticImage } from 'gatsby-plugin-image'
import { Html } from '@react-three/drei'
import Typography from '../atoms/Typography'

gsap.registerPlugin(ScrollTrigger)

const ScrollModel = ({ children }: { children: React.ReactNode }) => {
  const mesh = useRef<Group>(null)
  const extraGroupRef = useRef<Group>(null)
  const isMobile = window.matchMedia('(max-width: 768px)').matches

  const numSteps = scrollingSteps.length - 1
  const totalScrollDistance = numSteps * window.innerHeight

  const initialPosition = isMobile
    ? scrollingSteps[0].mobile.position
    : scrollingSteps[0].position
  const initialRotation = scrollingSteps[0].rotation

  useLayoutEffect(() => {
    if (mesh.current) {
      const offsetPx = 100
      const offsetFraction = offsetPx / window.innerHeight
      const tweenDuration = 1 - 2 * offsetFraction

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          scrub: true,
          onUpdate: self => {
            if (extraGroupRef.current) {
              const step3StartProgress = 2 / numSteps
              const step4StartProgress = 3 / numSteps
              const stepOffset = 0.05

              if (self.progress >= step3StartProgress && self.progress < step4StartProgress) {
                const progress = (self.progress - step3StartProgress) / (step4StartProgress - step3StartProgress)
                gsap.to(extraGroupRef.current.position, {
                  x: -0.5 + 0.5 * progress, // Moves from left (-0.5) to center (0)
                  y: 0,
                  z: 0,
                  duration: 0.1,
                })
                // } else if (self.progress >= step4StartProgress + stepOffset) {
                //   const progress = (self.progress - (step4StartProgress + stepOffset)) / (1 - (step4StartProgress + stepOffset))
              } else if (self.progress >= step4StartProgress) {
                const progress = (self.progress - (step4StartProgress)) / (1 - (step4StartProgress))
                gsap.to(extraGroupRef.current.position, {
                  x: 0 + 0.5 * progress, // Now moves from center (0) to right (0.8)
                  y: 0,
                  z: 0,
                  duration: 0.1,
                })
              }
            }
          },
        },
      })

      scrollingSteps.slice(1).forEach((step, i) => {
        const startTime = i === 0 ? i : i + offsetFraction
        const duration = i === 0 ? 1 : tweenDuration

        timeline.to(
          mesh.current!.position,
          {
            duration,
            ...(isMobile ? step.mobile.position : step.position),
          },
          startTime
        )
        timeline.to(
          mesh.current!.rotation,
          {
            duration,
            ...(isMobile && step.mobile.rotation ? step.mobile.rotation : step.rotation),
          },
          startTime
        )
      })

      return () => {
        timeline.scrollTrigger?.kill()
      }
    }
  }, [isMobile, numSteps, totalScrollDistance])

  return (
    <>
      <group
        ref={mesh}
        position={[initialPosition.x, initialPosition.y, initialPosition.z]}
        rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}
      >
        {children}
      </group>
      {/* <group ref={extraGroupRef} position={[-0.5, 0, 0]} dispose={null}>
        <Html position={[-0.15, 0.03, 0.8]}> 
          <StaticImage height={500} src="../../images/cover1.png" alt="Cover 1" layout="fixed" />
        </Html>
        <Html position={[-0.05, 0.03, 0.8]}> 
          <StaticImage height={500} src="../../images/cover2.png" alt="Cover 2" layout='fixed' />
        </Html>
        <Html position={[0.05, 0.03, 0.8]}> 
          <StaticImage height={500} src="../../images/cover3.png" alt="Cover 3" layout='fixed' />
        </Html>
      </group> 
      */}
    </>
  )
}

export default ScrollModel
