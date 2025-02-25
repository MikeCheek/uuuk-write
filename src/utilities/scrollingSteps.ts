export type StepsType = {
  title: string
  description: string
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
}[]
//position={[0, -100, 100]} rotation={[Math.PI, Math.PI, 0]}
const steps = [
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 0, y: -100, z: 100 },
    rotation: { x: Math.PI, y: Math.PI, z: 0 }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 100, y: 0, z: 70 },
    rotation: { x: Math.PI, y: Math.PI - Math.PI / 10, z: 0 }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: -100, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
]

export default steps
