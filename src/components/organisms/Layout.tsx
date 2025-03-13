import React, { ReactNode } from 'react'
import { SectionProvider } from '../../utilities/SectionContext'
import Cursor from '../atoms/Cursor'
import PageLoader from '../atoms/PageLoader'

const Layout = ({ children }: { children: ReactNode }) => {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const noCustomCursorPaths = ["customize"]

  const showCustomCursor = !noCustomCursorPaths.some((path) => currentPath.includes(path))

  return (
    <>
      <SectionProvider>
        <main className={`relative ${showCustomCursor ? "cursor-none" : ""}`}>
          {
            showCustomCursor ? <Cursor /> : <></>
          }
          <PageLoader />
          {children}
        </main>
      </SectionProvider>
    </>
  )
}

export default Layout