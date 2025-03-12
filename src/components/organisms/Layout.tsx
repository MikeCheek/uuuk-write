import React, { ReactNode } from 'react'
import { SectionProvider } from '../../utilities/SectionContext'
import Cursor from '../atoms/Cursor'
import PageLoader from '../atoms/PageLoader'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SectionProvider>
        <main className="relative cursor-none">
          <Cursor />
          <PageLoader />
          {children}
        </main>
      </SectionProvider>
    </>
  )
}

export default Layout