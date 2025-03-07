import * as THREE from 'three'
import React, { memo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useSpring, a } from '@react-spring/three'

type GLTFResult = GLTF & {
  nodes: {
    Front: THREE.Mesh
    Back: THREE.Mesh
    SidebarSmall: THREE.Mesh
    SignDiario: THREE.Mesh
    SignProgettoX: THREE.Mesh
    SidebarBig: THREE.Mesh
    JointUp: THREE.Mesh
    JointDown: THREE.Mesh
    LaceDL: THREE.Mesh
    LaceUL: THREE.Mesh
    RedCircle: THREE.Mesh
    Stripes: THREE.Mesh
    LaceUB: THREE.Mesh
    LaceDB: THREE.Mesh
  }
  materials: {
    ['3d texture bianco']: THREE.MeshStandardMaterial
    ['3d texture rossa (1).001']: THREE.MeshStandardMaterial
    ['3d texture rossa (2) (1).001']: THREE.MeshStandardMaterial
    ['ABS (White)']: THREE.MeshStandardMaterial
    ['3d texture rossa (2) (1)']: THREE.MeshStandardMaterial
    ['Steel - Satin']: THREE.MeshStandardMaterial
  }
  animations: any
}

// const getRandomOffset = () => [
//   Math.random() * 0.5 - 0.5,
//   Math.random() * 0.5 - 0.5,
//   Math.random() * 0.5 - 0.5,
// ]

const AnimatedMesh = ({
  geometry,
  material,
  animationConfig,
  animate
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  animationConfig: any,
  animate: boolean
}) => {
  const spring = useSpring({ ...animationConfig, immediate: !animate })

  return (
    <a.mesh
      geometry={geometry}
      material={material}
      rotation={[Math.PI / 2, 0, 0]}
      scale={0.01}
      position={spring.position.to((x: number, y: number, z: number) => [x, y, z])}
    />
  )
}

const AnimatedAgendaComplete = memo((
  { groupProps, animate = true }: { groupProps?: JSX.IntrinsicElements['group'], animate?: boolean }
) => {
  const { nodes } = useGLTF('/models/agenda.glb') as GLTFResult

  const animationConfigs: Record<string, any> = {
    Front: {
      from: { position: [0, 0, 0.5] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    Back: {
      from: { position: [0, 0, -0.1] },
      to: { position: [0, 0, 0] },
      config: { duration: 1500 },
    },
    SidebarSmall: {
      from: { position: [0.2, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    SignDiario: {
      from: { position: [0.2, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    SignProgettoX: {
      from: { position: [0.2, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    SidebarBig: {
      from: { position: [0.2, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    JointUp: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    JointDown: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    LaceDL: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    LaceUL: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    RedCircle: {
      from: { position: [0, 0, 0.551] },
      to: { position: [-0.003, 0, 0.001] },
      config: { duration: 2000 },
    },
    Stripes: {
      from: { position: [0, 0, 0.551] },
      to: { position: [-0.003, 0, 0.001] },
      config: { duration: 2000 },
    },
    LaceUB: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
    LaceDB: {
      from: { position: [0, 0, 0] },
      to: { position: [0, 0, 0] },
      config: { duration: 2000 },
    },
  }

  return (
    <group {...groupProps} dispose={null}>
      {Object.keys(animationConfigs).map((key) => (
        <AnimatedMesh
          key={key}
          animate={animate}
          geometry={(nodes as any)[key].geometry}
          material={(nodes as any)[key].material}
          animationConfig={animationConfigs[key]}
        />
      ))}
    </group>
  )
})

useGLTF.preload('/models/agenda.glb')

export default AnimatedAgendaComplete