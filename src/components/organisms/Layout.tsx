import React, { ReactNode } from 'react'
import { SectionProvider } from '../../utilities/SectionContext'
import Cursor from '../atoms/Cursor'

const Layout = ({ children, showCustomCursor = true }: { children: ReactNode, showCustomCursor?: boolean }) => {
  return (
    <main>
      <SectionProvider>
        <div className={`font-helvetica relative h-screen max-h-screen ${showCustomCursor ? "cursor-none" : ""}`}>
          {
            showCustomCursor ? <Cursor /> : <></>
          }
          {/* <PageLoader /> */}
          {children}
        </div>
      </SectionProvider>
    </main>
  )
}

export default Layout