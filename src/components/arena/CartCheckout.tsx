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
    <div className="min-h-screen bg-[#070d1e] p-6 text-[#eef2ff] lg:p-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setShowStripeCheckout(false)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101c3c] px-4 py-2 text-sm text-gray-300 transition-all hover:border-[#f97316]/50 hover:text-white"
        >
          <ChevronLeft size={20} /> Torna al riepilogo
        </button>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f1b3c] to-[#0a132d] p-8 shadow-[0_24px_80px_rgba(6,10,20,0.55)]">
          <h2 className="mb-1 text-2xl font-black uppercase tracking-tight text-white">Pagamento Sicuro</h2>
          <p className="mb-6 text-sm text-[#c4d4ff]">Controlla i dati e completa il pagamento con Stripe.</p>
          {/* Passing dummy metadata or cart data as needed by your Checkout component */}
          <Checkout items={cart} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#122850_0%,_#070d1e_55%)] p-6 text-[#eef2ff] lg:p-12">
      <button onClick={goBack} className="fixed left-4 top-4 rounded-full border border-white/15 bg-[#0f1a36]/80 p-4 text-gray-300 backdrop-blur-sm transition-all hover:border-[#f97316]/40 hover:text-white">
        <ArrowBigLeftIcon size={30} className="transition-colors" />
      </button>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">


        {/* Left Column: List of Items */}
        <div className="lg:col-span-2">
          <h1 className="mb-8 flex items-center gap-3 text-3xl font-black uppercase tracking-tight">
            <ShoppingBag className="text-[#f97316]" /> Il Tuo Carrello
          </h1>

          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-[#0f1a36]/70 p-20 text-center">
              <p className="text-lg text-gray-400">Il tuo carrello è attualmente vuoto.</p>
              <Link to="/galleria" className="mt-6 inline-block font-semibold text-[#f97316] hover:underline">Continua lo shopping</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                return (
                  <div key={item.cartId} className="mb-4 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#0f1a36]/85 p-6 transition-colors hover:border-[#f97316]/45 md:flex-row">

                    {/* 1. Image */}
                    <div className="h-36 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#0a1022]">
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
                          <h3 className="text-lg font-bold uppercase tracking-tight text-[#f6f8ff]">
                            {item.name || `${item.format} - ${item.frontCover.collection} - ${item.frontCover.template ?? 'Custom'}`}
                          </h3>

                          <div className="mt-3 grid grid-cols-3 gap-6 text-sm">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-[#8ea2d0]">Formato</p>
                              <p className="text-gray-100">{item.format}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase text-[#8ea2d0]">Prezzo</p>
                              <p className="text-gray-100">€{item.price?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase text-[#8ea2d0]">Quantità</p>
                              <p className="text-gray-100">{item.quantity || 1}</p>
                            </div>
                          </div>
                        </div>

                        {/* 3. Trash Icon / Remove Option */}
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="rounded-full p-2 text-gray-500 transition-all hover:bg-[#f97316]/20 hover:text-[#f8b27f]"
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
          <div className="sticky top-8 rounded-2xl border border-white/10 bg-gradient-to-b from-[#111f42] to-[#0b1430] p-8 shadow-[0_24px_60px_rgba(5,8,18,0.45)]">
            <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-black uppercase tracking-tight">Riepilogo Ordine</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[#9db2de]">
                <span>Subtotale</span>
                {/* Ensure your cart items have a price property */}
                <span className="text-white">€ {subtotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#9db2de]">
                <span>Spedizione</span>
                <span>Calcolata al checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-lg font-bold">Totale</span>
                <span className="text-2xl font-black text-white">
                  € {subtotalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => setShowStripeCheckout(true)}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#f97316]/35 bg-[#f97316] py-4 font-bold text-[#1e293b] shadow-xl shadow-[#f97316]/20 transition-all hover:bg-[#fb8a35] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-[#1f2d50] disabled:text-[#7f8dad]"
            >
              <CreditCard size={20} />
              Procedi al Pagamento
            </button>

            <p className="mt-6 text-center text-[10px] leading-relaxed text-[#8ea2d0]">
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