import { Environment, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Overlay from '../atoms/Overlay'
import AnimatedAgendaComplete from '../atoms/AnimatedAgendaComplete'
import ScrollModel from './ScrollModel'

const ThreeCanvas = () => {
  return (
    <Canvas className='z-10 left-0 top-0 animate-fadeIn' style={{ height: '100vh', position: 'fixed' }}>
      {/* <Overlay /> */}
      <Environment preset='city' />

      <ambientLight intensity={1} />

      <spotLight position={[0, 0, 1.5]} intensity={1} />
      <spotLight position={[0, 0, -1.5]} intensity={1} />

      <PerspectiveCamera position={[0, 0, 1]} makeDefault fov={50} />
      <ScrollModel>
        <AnimatedAgendaComplete />
      </ScrollModel>
      {/* </ScrollControls> */}
    </Canvas>
  )
}

export default ThreeCanvas