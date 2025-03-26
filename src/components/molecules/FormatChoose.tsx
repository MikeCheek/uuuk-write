import React from 'react'
import Agenda from '../3Dmodels/Agenda'
import { useGLTF } from '@react-three/drei'
import A6_v3 from '../3Dmodels/A6_v3'

useGLTF.preload('/models/tascabile/tascabile_v1.glb')
useGLTF.preload('/models/a5/a5_v2.glb')

const FormatChoose = () => {
  return (<>
    <A6_v3 position={[-0.05, 0, 0.7]} scale={1.2} rotation={[0, Math.PI / 16, 0]} />
    <Agenda filePath='/models/a5/a5_v2.glb' position={[0.05, -0.015, 0.725]} rotation={[0, -Math.PI / 16, Math.PI]} scale={0.6} />
    <Agenda filePath='/models/tascabile/tascabile_v1.glb' position={[0.01, -0.05, 0.75]} rotation={[0, 0, Math.PI / 2]} scale={0.9} />
  </>)
}

export default FormatChoose