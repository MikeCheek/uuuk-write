export type StepsType = {
  title: string
  description: string
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  mobile: {
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
  }
}[]

const steps = [
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: -0.05, y: -0.02, z: 0.8 },
    rotation: { x: Math.PI, y: Math.PI - Math.PI / 6, z: 0 }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 0.1, y: 0, z: 0.85 },
    rotation: {
      x: Math.PI - Math.PI / 4,
      y: Math.PI,
      z: Math.PI / 4
    }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 0, y: -0.02, z: 0.8 },
    rotation: {
      x: Math.PI / 2 + Math.PI / 60,
      y: Math.PI,
      z: Math.PI / 2 - Math.PI / 10
    }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 0.1, y: 0, z: 0.75 },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  {
    title: 'Broder',
    description: "Let's go",
    position: { x: 0.1, y: 0, z: 0.75 },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  }
].map(step => ({
  ...step,
  mobile: {
    position: {
      x: step.position.x,
      y: step.position.y,
      z: step.position.z
    }
  }
}))

export default steps
