import { ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Overlay from '../atoms/Overlay'

const steps = []

const ThreeCanvas = () => {
  return (
    <Canvas>
      <ScrollControls pages={steps.length} damping={0.25}>
        <Overlay />
      </ScrollControls>
    </Canvas>
  )
}

export default ThreeCanvas