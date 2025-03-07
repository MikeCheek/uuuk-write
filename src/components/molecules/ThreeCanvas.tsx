import { Environment, OrbitControls, PerspectiveCamera, ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Overlay from '../atoms/Overlay'
import { AgendaComplete } from '../atoms/AgendaComplete'
import ScrollModel from '../atoms/ScrollModel'

const ThreeCanvas = () => {
  return (
    <Canvas className='z-10 left-0 top-0 animate-fadeIn' style={{ height: '100vh', position: 'fixed' }}>
      {/* <ScrollControls pages={scrollingSteps.length} damping={0.05}> */}
      {/* <Overlay /> */}
      {/* <Environment preset='city' /> */}

      <ambientLight intensity={0.2} />

      <spotLight position={[0, 0, 1]} intensity={0.4} />

      <PerspectiveCamera position={[0, 0, 1]} makeDefault fov={50} />
      <ScrollModel>
        <AgendaComplete />
      </ScrollModel>
      {/* </ScrollControls> */}
    </Canvas>
  )
}

export default ThreeCanvas