import React, { useState, useEffect, Suspense, lazy } from 'react'

const CustomizeCanvas = lazy(() => import('../molecules/CustomizeCanvas'));

const EnvironmentCustomize = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {!isMounted ? <></> : (
        <Suspense fallback={null}>
          <CustomizeCanvas />
        </Suspense>
      )}
    </>
  )
}

export default EnvironmentCustomize