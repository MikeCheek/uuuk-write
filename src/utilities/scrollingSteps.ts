export type StepsType = {
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  mobile: {
    position?: { x: number; y: number; z: number }
    rotation?: { x: number; y: number; z: number }
  }
}[]

// { x: -0.05, y: -0.02, z: 0.8 }
// { x: -5, y: -1, z: -18 }

const steps = [
  {
    position: { x: -5, y: -2, z: -18 },
    rotation: { x: Math.PI, y: Math.PI - Math.PI / 6, z: 0 },
    mobile: {
      position: { x: 1, y: -10, z: -25 }
    }
  },
  {
    position: { x: 10, y: 1, z: -18 },
    rotation: {
      x: Math.PI - Math.PI / 4,
      y: Math.PI,
      z: Math.PI / 4
    },
    mobile: {
      position: { x: 0, y: 10, z: -40 },
      rotation: {
        x: Math.PI - Math.PI / 3,
        y: -Math.PI / 2.5 + Math.PI,
        z: Math.PI / 2
      }
    }
  },
  ...Array(3)
    .fill(null)
    .map((_, i) => ({
      position: { x: 0, y: 0, z: -30 },
      rotation: {
        x: Math.PI,
        y: i == 0 ? Math.PI : i == 1 ? -Math.PI - Math.PI / 2 : Math.PI,
        z: 0
      },
      mobile: {
        position: { x: 0, y: 0, z: -50 },
        rotation: {
          x: Math.PI,
          y: i == 0 ? Math.PI : i == 1 ? -Math.PI - Math.PI / 2 : Math.PI,
          z: 0
        }
      }
    })),
  {
    position: { x: 0, y: 15, z: -20 }, //{ x: 0.1, y: 0, z: 0.75 },
    rotation: {
      x: Math.PI / 2 + Math.PI / 30,
      y: Math.PI,
      z: Math.PI / 2 - Math.PI / 10
    },
    mobile: {
      position: { x: 0, y: 20, z: -30 } //{ x: 0.1, y: 0, z: 0.75 },
    }
  },
  {
    position: { x: 0, y: 15, z: -20 }, //{ x: 0.1, y: 0, z: 0.75 },
    rotation: {
      x: Math.PI / 2 + Math.PI / 60,
      y: Math.PI,
      z: Math.PI / 2 - Math.PI / 10
    }
  }
].map(step =>
  step.mobile
    ? step
    : {
        ...step,
        mobile: {
          position: {
            x: step.position.x,
            y: step.position.y,
            z: step.position.z - 1
          }
        }
      }
)

export default steps
