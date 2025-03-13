import { Rotate3D } from 'lucide-react';
import React, { useState, useEffect, Suspense, lazy } from 'react'

const CustomizeCanvas = lazy(() => import('../molecules/CustomizeCanvas'));

const EnvironmentCustomize = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <h1 className='text-white/70 text-3xl w-screen text-center mt-4'>Build your UUUK</h1>
      {!isMounted ? <></> : (
        <Suspense fallback={null}>
          <CustomizeCanvas />
        </Suspense>
      )}
      <div className='flex flex-col items-center justify-center text-white text-xl w-screen text-center fixed bottom-4 opacity-30'>
        <Rotate3D />
        <p>Drag to rotate</p>
      </div>
    </>
  )
}

export default EnvironmentCustomize