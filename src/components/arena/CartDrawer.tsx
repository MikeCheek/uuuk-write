import React from 'react';
import { ShoppingCart, X, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '../../utilities/cartContext';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const CartDrawer = ({ isSidebarOpen, setIsSidebarOpen }:
  { isSidebarOpen: boolean, setIsSidebarOpen: (open: boolean) => void }
) => {
  const { cart, removeFromCart, totalItems } = useCart();

  return (
    <>
      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full min-w-[30vw] bg-gray-900 z-[1001] shadow-2xl transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart size={22} className="text-indigo-400" />
              Il Tuo Carrello
              <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                {totalItems}
              </span>
            </h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-gray-500 italic">
                <p>Il carrello è vuoto</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="mb-4 flex gap-4 bg-gray-800/40 p-3 rounded-xl border border-gray-800 relative group">

                  {/* 1. Image */}
                  <div className="w-12 h-16 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
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
                      <h4 className="text-white font-bold text-sm truncate uppercase tracking-tight">
                        {item.name || 'Agenda Personalizzata'}
                      </h4>
                    </div>

                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                      Formato: <span className="text-gray-300 font-normal">{item.format}</span>
                    </p>

                    <div className="flex justify-between items-end mt-2 gap-12">
                      <p className="text-xs text-indigo-300 font-medium">
                        Q.tà: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-bold text-white">
                        €{item.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* 3. Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors"
                    aria-label="Rimuovi"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t border-gray-800">
            <Link
              onClick={() => setIsSidebarOpen(false)}
              to="/carrello"
              className="group w-full py-4 bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default CartDrawer;