import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import gsap from 'gsap';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import CustomizeOverlay from './CustomizeOverlay';

type GLTFResult = GLTF & {
  nodes: {
    Front: THREE.Mesh;
    Back: THREE.Mesh;
    SidebarSmall: THREE.Mesh;
    SignDiario: THREE.Mesh;
    SignProgettoX: THREE.Mesh;
    SidebarBig: THREE.Mesh;
    JointUp: THREE.Mesh;
    JointDown: THREE.Mesh;
    LaceDL: THREE.Mesh;
    LaceUL: THREE.Mesh;
    RedCircle: THREE.Mesh;
    Stripes: THREE.Mesh;
    LaceUB: THREE.Mesh;
    LaceDB: THREE.Mesh;
  };
  materials: {
    ['3d texture bianco']: THREE.MeshStandardMaterial;
    ['3d texture rossa (1).001']: THREE.MeshStandardMaterial;
    ['3d texture rossa (2) (1).001']: THREE.MeshStandardMaterial;
    ['ABS (White)']: THREE.MeshStandardMaterial;
    ['3d texture rossa (2) (1)']: THREE.MeshStandardMaterial;
    ['Steel - Satin']: THREE.MeshStandardMaterial;
  };
  animations: any;
};

const AgendaCustomize = (props: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useGLTF('/models/agenda.glb') as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const pointerDownX = useRef(0);
  const { camera, size } = useThree();
  const draggingRef = useRef(false);
  const [colors, setColors] = useState({
    SidebarSmall: materials['3d texture rossa (1).001'].color.getStyle(),
    Front: materials['3d texture bianco'].color.getStyle(),
    Laces: materials['ABS (White)'].color.getStyle(),
  });

  let targetY = 0;
  if (Array.isArray(props.rotation)) {
    targetY = props.rotation[1];
  } else if (props.rotation instanceof THREE.Euler) {
    targetY = props.rotation.y;
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent | TouchEvent> | PointerEvent | TouchEvent) => {
    draggingRef.current = true;
    pointerDownX.current = "touches" in e ? e.touches[0].clientX : (e as ThreeEvent<PointerEvent>).clientX;
    if (e instanceof PointerEvent || e instanceof TouchEvent)
      e.stopPropagation()
    else
      e.nativeEvent.stopPropagation();
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent | TouchEvent> | PointerEvent | TouchEvent) => {
    if (!draggingRef.current || !groupRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : (e as ThreeEvent<PointerEvent>).clientX;
    const deltaX = clientX - pointerDownX.current;
    const sensitivity = "touches" in e ? 0.007 : 0.004
    const rotationY = deltaX * sensitivity; // Adjust sensitivity for touch

    groupRef.current.rotation.y = (targetY - rotationY) % (Math.PI * 2);

    if (e instanceof PointerEvent || e instanceof TouchEvent)
      e.preventDefault()
    else
      e.nativeEvent.preventDefault() // Prevents scrolling while dragging
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, { y: targetY, duration: 0.5 });
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false }); // Prevent scrolling

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [targetY]);

  const updateMaterial = (part: string, color: string) => {
    const targetColor = new THREE.Color(color);
    if (part === 'SidebarSmall') {
      gsap.to(materials['3d texture rossa (1).001'].color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.7,
      });
    }
    if (part === 'Front') {
      gsap.to(materials['3d texture bianco'].color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.7,
      });
    }
    if (part === 'LaceUL') {
      gsap.to(materials['ABS (White)'].color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.7,
      });
    }
    setColors((prev) => ({ ...prev, [part]: color }));
  };


  useFrame(() => { });

  return (
    <>
      <Html>
        <CustomizeOverlay onColorChange={updateMaterial} />
      </Html>
      <group
        ref={groupRef}
        {...props}
        dispose={null}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <mesh geometry={nodes.Front.geometry} material={materials['3d texture bianco']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.Back.geometry} material={materials['3d texture bianco']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.SidebarSmall.geometry} material={materials['3d texture rossa (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.SignDiario.geometry} material={materials['3d texture rossa (2) (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.SignProgettoX.geometry} material={materials['3d texture rossa (2) (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.SidebarBig.geometry} material={materials['3d texture rossa (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.JointUp.geometry} material={materials['ABS (White)']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.JointDown.geometry} material={materials['ABS (White)']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.LaceDL.geometry} material={materials['ABS (White)']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.LaceUL.geometry} material={materials['ABS (White)']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.RedCircle.geometry} material={materials['3d texture rossa (2) (1)']} position={[-0.003, 0, 0.001]} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.Stripes.geometry} material={materials['Steel - Satin']} position={[-0.003, 0, 0.001]} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.LaceUB.geometry} material={materials['3d texture rossa (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
        <mesh geometry={nodes.LaceDB.geometry} material={materials['3d texture rossa (1).001']} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
      </group>
    </>
  );
};

useGLTF.preload('/models/agenda.glb');

export default AgendaCustomize;
