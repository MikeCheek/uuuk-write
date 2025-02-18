import { Canvas } from '@react-three/fiber'
import React from 'react'

const ThreeCanvas = () => {
  return (
    <Canvas>
      <mesh scale={[50, 50, 1]}>
        <meshBasicMaterial color='red' />
        <planeGeometry />
      </mesh>
    </Canvas>
  )
}

export default ThreeCanvas