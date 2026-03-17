import React, { ReactNode, useState } from 'react'
import { SectionProvider } from '../../utilities/SectionContext'
import Cursor from '../atoms/Cursor'
import { CartProvider } from '../../utilities/cartContext'
import CartDrawer from '../arena/CartDrawer'
import { SnackbarProvider } from '../../utilities/snackbarContext'
import CartFloatingButton from '../arena/CartFloatingButton'

const Layout = ({ children, showCustomCursor = true, shoppingCart = false }: { children: ReactNode, showCustomCursor?: boolean, shoppingCart?: boolean }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SnackbarProvider>
      <CartProvider>
        <SectionProvider>
          <div className={`font-helvetica relative min-h-screen ${showCustomCursor ? "cursor-none" : ""}`}>
            {
              showCustomCursor ? <Cursor /> : <></>
            }
            {/* <PageLoader /> */}
            {shoppingCart &&
              <>
                <CartFloatingButton setIsSidebarOpen={setIsSidebarOpen} />
                <CartDrawer isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              </>}
            {children}
          </div>
        </SectionProvider>
      </CartProvider>
    </SnackbarProvider>
  )
}

export default Layout