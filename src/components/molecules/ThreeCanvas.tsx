import { Environment, OrbitControls, PerspectiveCamera, ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Overlay from '../atoms/Overlay'
import { Agenda } from '../atoms/Agenda'
import scrollingSteps from '../../utilities/scrollingSteps'

const ThreeCanvas = () => {
  return (
    <Canvas className='z-10 left-0 top-0 animate-fadeIn' style={{ height: '100vh', position: 'fixed' }}>
      {/* <ScrollControls pages={scrollingSteps.length} damping={0.05}> */}
      {/* <Overlay /> */}
      {/* <Environment preset='city' /> */}

      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 1, 1]} intensity={1} />

      <spotLight position={[0, 0, 300]} intensity={1} />

      <PerspectiveCamera position={[0, 0, 300]} makeDefault />
      <Agenda />
      {/* </ScrollControls> */}
    </Canvas>
  )
}

export default ThreeCanvas