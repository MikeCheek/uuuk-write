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
  const initialPosition = scrollingSteps[0].position
  const initialRotation = scrollingSteps[0].rotation

  useLayoutEffect(() => {
    if (mesh.current) {
      const numSteps = scrollingSteps.length - 1
      // Total scroll distance equals one viewport height per transition
      const totalScrollDistance = window.innerHeight * numSteps

      // Define your sensitivity in pixels
      const offsetPx = 100
      // Convert offset to a fraction of 1 viewport unit
      const offsetFraction = offsetPx / window.innerHeight
      // The tween will last only for the middle portion of each section
      const tweenDuration = 1 - 2 * offsetFraction

      // Create a GSAP timeline with ScrollTrigger attached
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

      // Iterate through the steps (skipping the initial state)
      scrollingSteps.slice(1).forEach((step, i) => {
        // Tween for position
        timeline.to(
          mesh.current!.position,
          {
            duration: tweenDuration,
            ...step.position,
          },
          i + offsetFraction // starts after the offset into the section
        )
        // Tween for rotation
        timeline.to(
          mesh.current!.rotation,
          {
            duration: tweenDuration,
            ...step.rotation,
          },
          i + offsetFraction
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
