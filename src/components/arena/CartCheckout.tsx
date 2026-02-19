import React, { useState } from 'react';
import { ArrowBigLeftIcon, ChevronLeft, CreditCard, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, navigate } from 'gatsby';
import { useCart } from '../../utilities/cartContext';
import Checkout from './Checkout';
import { GatsbyImage } from 'gatsby-plugin-image';

const CartCheckout = () => {
  const { cart, removeFromCart, subtotalPrice } = useCart();
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  const goBack = () => {
    if (showStripeCheckout) {
      setShowStripeCheckout(false);
    } else {
      navigate(-1);
    }
  }

  if (showStripeCheckout) return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowStripeCheckout(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Torna al riepilogo
        </button>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Pagamento Sicuro</h2>
          {/* Passing dummy metadata or cart data as needed by your Checkout component */}
          <Checkout items={cart} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-12">
      <button onClick={goBack} className="fixed top-4 left-4 rounded-full text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-900 transition-colors p-4">
        <ArrowBigLeftIcon size={30} className="transition-colors" />
      </button>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">


        {/* Left Column: List of Items */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
            <ShoppingBag className="text-indigo-500" /> Il Tuo Carrello
          </h1>

          {cart.length === 0 ? (
            <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-20 text-center">
              <p className="text-gray-500 text-lg">Il tuo carrello è attualmente vuoto.</p>
              <Link to="/galleria" className="inline-block mt-6 text-indigo-400 hover:underline">Continua lo shopping</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                return (
                  <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl mb-4 hover:border-indigo-500/50 transition-colors">

                    {/* 1. Image */}
                    <div className="w-24 h-36 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                      {item.image && typeof item.image === 'object' && 'images' in item.image ? (
                        <GatsbyImage
                          image={item.image}
                          alt={item.name ?? 'Agenda Personalizzata'}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={item.image || '/placeholder-agenda.png'}
                          alt={item.name ?? 'Agenda Personalizzata'}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    {/* 2. Main Content (Name, Format, Price, Quantity) */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-indigo-400 uppercase tracking-tight">
                            {item.name || 'Agenda Personalizzata'}
                          </h3>

                          <div className="grid grid-cols-3 gap-6 mt-3 text-sm">
                            <div>
                              <p className="text-gray-500 uppercase text-[10px] font-bold">Formato</p>
                              <p className="text-gray-200">{item.format}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 uppercase text-[10px] font-bold">Prezzo</p>
                              <p className="text-gray-200">€{item.price?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 uppercase text-[10px] font-bold">Quantità</p>
                              <p className="text-gray-200">{item.quantity || 1}</p>
                            </div>
                          </div>
                        </div>

                        {/* 3. Trash Icon / Remove Option */}
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-gray-600 hover:text-white hover:bg-red rounded-full transition-all"
                          aria-label="Rimuovi"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Riepilogo Ordine</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotale</span>
                {/* Ensure your cart items have a price property */}
                <span className="text-white">€ {subtotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Spedizione</span>
                <span>Calcolata al checkout</span>
              </div>
              <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Totale</span>
                <span className="text-2xl font-black text-white italic">
                  € {subtotalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => setShowStripeCheckout(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
            >
              <CreditCard size={20} />
              Procedi al Pagamento
            </button>

            <p className="text-[10px] text-gray-500 mt-6 text-center leading-relaxed">
              Pagamenti sicuri crittografati tramite Stripe. <br />
              Diritto di recesso disponibile entro 14 giorni.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
};

export default CartCheckout;