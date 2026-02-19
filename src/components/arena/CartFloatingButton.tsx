import React from 'react'
import { useCart } from '../../utilities/cartContext';
import { ShoppingCart } from 'lucide-react';

const CartFloatingButton = ({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void }) => {
  const { totalItems } = useCart();

  return (
    <div
      onClick={() => setIsSidebarOpen(true)}
      className="fixed top-6 right-6 z-50 p-3 bg-yellow rounded-full shadow-strong hover:scale-110 transition-transform text-black cursor-pointer"
    >
      <ShoppingCart size={24} />
      {
        typeof window !== 'undefined' ? (
          <div className="absolute -top-1 -right-1 bg-red text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
            style={{ opacity: totalItems > 0 ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
          >
            {totalItems}
          </div>
        ) : <></>
      }
    </div>
  )
}

export default CartFloatingButton