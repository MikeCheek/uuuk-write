import React from 'react';
import { ShoppingCart, X, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '../../utilities/cartContext';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import ProductCustomizationDetails from './ProductCustomizationDetails';

const CartDrawer = ({ isSidebarOpen, setIsSidebarOpen }:
  { isSidebarOpen: boolean, setIsSidebarOpen: (open: boolean) => void }
) => {
  const { cart, removeFromCart, totalItems } = useCart();

  return (
    <>
      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 z-[1001] h-full w-full max-w-[460px] transform border-l border-white/10 bg-gradient-to-b from-[#0b132a] to-[#0a1022] shadow-2xl transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <ShoppingCart size={22} className="text-[#f97316]" />
              Il Tuo Carrello
              <span className="ml-2 rounded-full border border-[#f97316]/40 bg-[#f97316]/10 px-2 py-1 text-xs text-[#ffb170]">
                {totalItems}
              </span>
            </h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 transition-colors hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 text-gray-400 italic">
                <p>Il carrello è vuoto</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="group relative mb-4 flex gap-4 rounded-xl border border-white/10 bg-[#101c3c]/70 p-3 transition-colors hover:border-[#f97316]/40">

                  {/* 1. Image */}
                  <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0a1022]">
                    {item.image && typeof item.image === 'object' && 'images' in item.image ? (
                      <GatsbyImage
                        image={item.image}
                        alt={item.name || 'Agenda Personalizzata'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.image || '/placeholder-agenda.png'}
                        alt={item.name || 'Agenda Personalizzata'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* 2. Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start pr-6">
                      <h4 className="truncate text-sm font-bold uppercase tracking-tight text-white">
                        {item.name || 'Agenda Personalizzata'}
                      </h4>
                    </div>

                    <p className="mt-1 text-[10px] font-bold uppercase text-gray-500">
                      Formato: <span className="font-normal text-gray-300">{item.format}</span>
                    </p>

                    <div className="flex justify-between items-end mt-2 gap-12">
                      <p className="text-xs font-medium text-[#9ad0ff]">
                        Q.tà: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-bold text-white">
                        €{item.price?.toFixed(2)}
                      </p>
                    </div>

                    <details className="mt-2 rounded-md border border-white/10 bg-[#0b1531]/70 p-1.5 text-[10px] text-[#cddcff]">
                      <summary className="cursor-pointer select-none text-[9px] font-bold uppercase tracking-wide text-[#8ea2d0]">
                        Dettagli personalizzazione
                      </summary>
                      <div className="mt-1.5">
                        <ProductCustomizationDetails
                          frontCover={item.frontCover}
                          backCover={item.backCover}
                          modules={item.modules}
                          cartId={item.cartId}
                          size="sm"
                        />
                      </div>
                    </details>
                  </div>

                  {/* 3. Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="absolute right-3 top-3 text-gray-600 transition-colors hover:text-[#f97316]"
                    aria-label="Rimuovi"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-white/10 pt-6">
            <Link
              onClick={() => setIsSidebarOpen(false)}
              to="/carrello"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#f97316]/40 bg-[#f97316] py-4 font-bold text-[#1f2937] transition-all hover:bg-[#fb8a35]"
            >
              Vai al carrello
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[1000] animate-in bg-black/70 backdrop-blur-sm fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default CartDrawer;