import React, { useLayoutEffect, useRef } from 'react'
import scrollingSteps from '../../utilities/scrollingSteps'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Group } from 'three'
import AnimatedAgendaComplete from '../atoms/AnimatedAgendaComplete'

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
    if (mesh.current && extraGroupRef.current) {
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
            const step3StartProgress = 2 / numSteps
            const step4StartProgress = 3 / numSteps
            const stepOffset = 0.05

            if (self.progress >= step3StartProgress && self.progress < step4StartProgress) {
              // Animate towards [0, 0, 0] during step 2
              const progress = (self.progress - step3StartProgress) / (step4StartProgress - step3StartProgress)
              gsap.to(extraGroupRef.current!.position, {
                x: -0.5 + 0.5 * progress,
                y: 0,
                z: 0,
                duration: 0.1, // Small duration to make it smooth
              })
            } else if (self.progress >= step4StartProgress + stepOffset) {
              // Animate back to [-0.5, 0, 0] during step 3
              const progress = (self.progress - (step4StartProgress + stepOffset)) / (1 - (step4StartProgress + stepOffset))
              gsap.to(extraGroupRef.current!.position, {
                x: 0 - 0.5 * progress,
                y: 0,
                z: 0,
                duration: 0.1, // Small duration to make it smooth
              })
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
            ...step.rotation,
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
      <group ref={extraGroupRef} position={[-0.5, 0, 0]} dispose={null}>
        <AnimatedAgendaComplete
          groupProps={{ position: [-0.2, -0.1, 0.6] }}
          animate={false}
        />
        <AnimatedAgendaComplete
          groupProps={{ position: [-0.1, -0.05, 0.65] }}
          animate={false}
        />
        <AnimatedAgendaComplete
          groupProps={{ position: [0, 0, 0.7] }}
          animate={false}
        />
      </group>
    </>
  )
}

export default ScrollModel