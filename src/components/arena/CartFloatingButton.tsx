import React from 'react'
import { useCart } from '../../utilities/cartContext';
import { ShoppingCart } from 'lucide-react';

const CartFloatingButton = ({ setIsSidebarOpen }: { setIsSidebarOpen: (isOpen: boolean) => void }) => {
  const { totalItems } = useCart();

  return (
    <div
      onClick={() => setIsSidebarOpen(true)}
      className="fixed top-6 right-6 z-50 p-3.5 rounded-full border border-white/20 bg-[#0d1630]/90 text-[#f5f7ff] shadow-[0_10px_30px_rgba(6,10,20,0.45)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#f97316]/60 hover:text-[#f97316] cursor-pointer"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 ? (
        <div
          className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-[#f97316] px-1.5 text-[10px] font-bold text-white flex items-center justify-center"
          style={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}
        >
          {totalItems}
        </div>
      ) : null}
    </div>
  )
}

export default CartFloatingButton