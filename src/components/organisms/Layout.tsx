import React, { ReactNode } from 'react'
import { SectionProvider } from '../../utilities/SectionContext'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SectionProvider>
        {children}
      </SectionProvider>
    </>
  )
}

export default Layout