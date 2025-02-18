import React, { useState, useEffect, Suspense, lazy } from 'react'

const ThreeCanvas = lazy(() => import('../molecules/ThreeCanvas'));

const Environment = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {!isMounted ? <></> : (
        <Suspense fallback={null}>
          <ThreeCanvas />
        </Suspense>
      )}
    </>
  )
}

export default Environment