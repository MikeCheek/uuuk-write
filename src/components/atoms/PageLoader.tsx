import { useProgress } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { useScrollBlock } from '../../utilities/scrollEdit'
import animationData from '../../assets/book_animation.json'
import Lottie from 'react-lottie'

const PageLoader = () => {
  const { progress } = useProgress()
  const [blockScroll, allowScroll] = useScrollBlock()
  const [show, setShow] = useState(true)

  useEffect(() => {
    blockScroll()
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        allowScroll()
        setShow(false)
      }, 1000)
    }
  }, [progress])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return show ? (
    <div
      className={`fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center text-2xl text-center text-white bg-redBrick z-50 duration-1000 transition-opacity 
                  ${progress === 100 ? "opacity-0" : "opacity-100"}`}
    >
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
      />
      Building the future...
    </div>
  ) : <></>
}

export default PageLoader