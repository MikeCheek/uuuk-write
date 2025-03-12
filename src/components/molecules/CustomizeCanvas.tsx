import { Environment, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import AgendaCustomize from './AgendaCustomize'

const CustomizeCanvas = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  return (
    <Canvas className='z-10 left-0 top-0 animate-fadeIn' style={{ height: '100vh', position: 'fixed' }}>
      {/* <Overlay /> */}
      <Environment preset='city' />

      <ambientLight intensity={1} />

      <spotLight position={[0, 0, 1.5]} intensity={1} />
      <spotLight position={[0, 0, -1.5]} intensity={1} />

      <PerspectiveCamera position={[0, 0, 1]} makeDefault fov={50} />
      <AgendaCustomize position={[0, 0, isMobile ? 0.5 : 0.75]} rotation={[Math.PI, Math.PI - Math.PI / 4, 0]} />
    </Canvas>
  )
}

export default CustomizeCanvas