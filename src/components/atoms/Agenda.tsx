import React, { useLayoutEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import scrollingSteps from '../../utilities/scrollingSteps'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type GLTFResult = GLTF & {
  nodes: {
    comlete_uuuk: Mesh
  }
  materials: {
    FR4: MeshStandardMaterial
  }
}

export function Agenda(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/agenda.glb') as GLTFResult
  const mesh = useRef<Group>(null)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const initialPosition = isMobile ? scrollingSteps[0].mobile.position : scrollingSteps[0].position
  const initialRotation = scrollingSteps[0].rotation

  useLayoutEffect(() => {
    if (mesh.current) {
      const numSteps = scrollingSteps.length - 1
      // Total scroll distance equals one viewport height per transition
      const totalScrollDistance = window.innerHeight * numSteps

      // Define sensitivity in pixels for steps beyond the first tween
      const offsetPx = 100
      // Convert offset to a fraction of 1 viewport unit
      const offsetFraction = offsetPx / window.innerHeight
      // For tweens with offset applied, the tween lasts only the middle portion
      const tweenDuration = 1 - 2 * offsetFraction

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          scrub: true,
          // Optionally, enable snapping:
          // snap: 1 / numSteps,
        },
      })

      // Iterate through steps (skipping the initial state)
      scrollingSteps.slice(1).forEach((step, i) => {
        // For the first tween (i === 0), use no offset.
        // For subsequent tweens, add the offsetFraction.
        const startTime = i === 0 ? i : i + offsetFraction
        // For the first tween, let the duration be 1, otherwise use tweenDuration
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

      // Cleanup on unmount
      return () => {
        timeline.scrollTrigger?.kill()
      }
    }
  }, [])

  return (
    <group
      {...props}
      dispose={null}
      ref={mesh}
      position={[
        initialPosition.x,
        initialPosition.y,
        initialPosition.z,
      ]}
      rotation={[
        initialRotation.x,
        initialRotation.y,
        initialRotation.z,
      ]}
    >
      <mesh
        geometry={nodes.comlete_uuuk.geometry}
        material={materials.FR4}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('/models/agenda.glb')
