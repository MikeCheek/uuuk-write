declare module '*.svg' {
  import React from 'react'
  const content: React.FunctionComponent<React.SVGProps<SVGElement>>
  export default content
}
