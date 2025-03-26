import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.MeshStandardMaterial>
}

type ModelProps = JSX.IntrinsicElements['group'] & {
  filePath: string
}

const Model = ({ filePath, ...props }: ModelProps) => {
  const { nodes, materials } = useGLTF(filePath) as GLTFResult
  const groupRef = useRef<THREE.Group>(null)
  const floatingRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (hovered) {
      floatingRef.current = Math.min(floatingRef.current + 0.002, 0.01)
    } else {
      floatingRef.current = Math.max(floatingRef.current - 0.001, 0)
    }

    if (groupRef.current) {
      //@ts-ignore
      groupRef.current.position.y = props.position[1] + floatingRef.current
    }
  })

  return (
    <group
      {...props}
      ref={groupRef}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
      }}
    >
      <group rotation={[-Math.PI / 2, 0, Math.PI]} scale={0.001}>
        {Object.entries(nodes).map(([nodeName, node]) => (
          <mesh
            key={nodeName}
            geometry={node.geometry}
            material={
              node.material && !Array.isArray(node.material) && node.material.name
                ? materials[node.material.name]
                : undefined
            }
            scale={10}
            material-opacity={hovered ? 1 : 0.6} // Opacity change on hover
            material-transparent // Ensure transparency is enabled
          />
        ))}
      </group>
    </group>
  )
}

export default Model
