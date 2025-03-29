import { Rotate3D } from 'lucide-react';
import React, { useState, useEffect, Suspense, lazy } from 'react'
import LanguagePicker from '../atoms/LanguagePicker';
import { useTranslation } from 'react-i18next';
import Overlay from '../atoms/Overlay';

const CustomizeCanvas = lazy(() => import('./CustomizeCanvas'));

const EnvironmentCustomize = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { t } = useTranslation()

  const customizeText = {
    "SideBarColor": t("SideBarColor"),
    "CoverColor": t("CoverColor")
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <h1 className='text-white/70 text-2xl w-screen text-left mt-4 pl-4'>Make your UUUK</h1>
      <div className="absolute top-4 right-4 z-50">
        <LanguagePicker white cursor />
      </div>
      <Overlay />
      {!isMounted ? <></> : (
        <Suspense fallback={null}>
          <CustomizeCanvas text={customizeText} />
        </Suspense>
      )}
      <div className='flex flex-col items-center justify-center text-white text-xl w-screen text-center fixed bottom-4 opacity-30'>
        <Rotate3D />
        <p>{t("DragToRotate")}</p>
      </div>
    </>
  )
}

export default EnvironmentCustomize