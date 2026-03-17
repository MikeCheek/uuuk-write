import React, { useState } from 'react';
import { useCheckout, PaymentElement, ShippingAddressElement } from '@stripe/react-stripe-js/checkout';
import { StripeCheckoutPaymentElementOptions } from '@stripe/stripe-js';

const CheckoutForm = () => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<string>();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Configuration for a tighter UI
  const paymentElementOptions = {
    layout: {
      type: 'accordion', // 'accordion' is much more compact than 'vertical'
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  } as StripeCheckoutPaymentElementOptions

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkoutState.type === 'loading' || checkoutState.type === 'error') return;

    const emailTrimmed = customerEmail.trim();
    const phoneTrimmed = customerPhone.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
      setError('Inserisci una email valida.');
      return;
    }

    if (phoneTrimmed.length < 6) {
      setError('Inserisci un numero di telefono valido.');
      return;
    }

    // if (!checkoutState.checkout.shippingAddress?.name) {
    //   console.log('Shipping address incomplete:', checkoutState.checkout);
    //   setError('Inserisci nome e indirizzo di spedizione completi.');
    //   return;
    // }

    setLoading(true);

    const { checkout } = checkoutState;
    const result = await checkout.confirm({
      email: emailTrimmed,
      phoneNumber: phoneTrimmed
    });

    if (result.type === 'error') {
      console.log(result.error.message);
      setError(result.error.message);
    }
    setLoading(false);
  };


  if (checkoutState.type === 'loading') return <div className="py-10 text-center text-[#c4d4ff]">Caricamento...</div>;
  if (checkoutState.type === 'error') return <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm italic text-red-200">Errore: {checkoutState.error.message}</div>;

  const handleDiscountApply = () => {
    if (!promoCode || promoCode.trim() === '') {
      setError('Inserisci un codice sconto valido.');
      return;
    }

    checkoutState.checkout.applyPromotionCode(promoCode).then(() => {
      setError(null);
    }).catch((err) => {
      setError(err.message);
    });
  }

  const handleDiscountRemove = () => {
    checkoutState.checkout.removePromotionCode().then(() => {
      setPromoCode('');
      setError(null);
    }).catch((err) => {
      setError(err.message);
    });
  }

  const discountApplied = checkoutState.checkout.total.discount.minorUnitsAmount > 0

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      {/* Grid layout: 
        Mobile: Single column, tight spacing
        Desktop: Two columns to avoid long scrolling
      */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-8">

        {/* Section 0: Contact Info */}
        <section className="rounded-2xl border border-white/10 bg-[#0b1531]/80 p-5 md:col-span-2">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#ffb170]">Contatti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-[#9db2de]">Email *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="nome@esempio.com"
                className="w-full rounded-lg border border-white/15 bg-[#101d3f] px-3 py-2 text-sm text-white placeholder-[#7d8fb8] focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#9db2de]">Telefono *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+39 333 1234567"
                className="w-full rounded-lg border border-white/15 bg-[#101d3f] px-3 py-2 text-sm text-white placeholder-[#7d8fb8] focus:border-[#f97316] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section 1: Shipping */}
        <section className="rounded-2xl border border-white/10 bg-[#0b1531]/80 p-5">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#ffb170]">Spedizione</h3>
          <ShippingAddressElement />
        </section>

        {/* Section 2: Payment & Submit */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b1531]/80 p-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#ffb170]">Pagamento</h3>
            <div className="mb-4 rounded-xl border border-white/10 bg-[#101d3f] p-4 shadow-sm">
              <div className="space-y-2 text-sm text-[#d2ddfb]">

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Importo</span>
                  <span className="font-semibold text-white">{checkoutState.checkout.total.subtotal.amount}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Spedizione</span>
                  <span className="font-semibold text-white">{checkoutState.checkout.total.shippingRate.amount}</span>
                </div>

                {/* Discount - Green text adds a positive "saving" feel */}
                {
                  discountApplied ?
                    <div className="flex justify-between text-emerald-300">
                      <span>Sconto</span>
                      <span className="font-semibold">- {checkoutState.checkout.total.discount.amount}</span>
                    </div> : <></>
                }

                {/* Divider */}
                <div className="my-2 border-t border-white/10 pt-2">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-white">Totale</span>
                    <span className="text-lg font-black text-[#ffb170]">
                      {checkoutState.checkout.total.total.amount}
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <p className="mb-2 text-xs text-[#8ea2d0]">
              Spedizione gratuita per ordini sopra {process.env.SHIPPING_THRESHOLD ? (parseInt(process.env.SHIPPING_THRESHOLD) / 100).toFixed(2) : '30.00'}€
            </p>
            {/* Discount Code Section */}
            <div className="mb-4 rounded-lg border border-white/10 bg-[#101d3f] p-3">
              <p onClick={() => setPromoCode('')} className="cursor-pointer text-sm text-[#9ad0ff] hover:underline">
                Hai un codice sconto?
              </p>
              {promoCode !== undefined && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full rounded border border-white/15 bg-[#0b1531] px-3 py-2 text-sm text-white placeholder-[#7d8fb8] focus:border-[#f97316] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={discountApplied ? handleDiscountRemove : handleDiscountApply}
                    className="rounded-md border border-[#f97316]/40 bg-[#f97316] px-4 py-2 text-sm font-bold text-[#1e293b] transition-colors hover:bg-[#fb8a35]"
                  >
                    {discountApplied ? 'Rimuovi' : 'Applica'}
                  </button>
                </div>
              )}
            </div>
            <PaymentElement options={paymentElementOptions} />
          </div>

          {error && <div className="mt-2 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

          <div className="pt-2">
            <div className="w-full py-3 shadow-lg transition-transform active:scale-95">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl border border-[#f97316]/40 bg-[#f97316] px-6 py-3 text-base font-black text-[#1e293b] transition-all hover:bg-[#fb8a35] disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-[#1f2d50] disabled:text-[#8292b8]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Paga ora
                  </span>
                ) : (
                  'Paga ora'
                )}
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-[#8ea2d0]">
              Pagamento sicuro con Stripe. Non memorizziamo i dati della tua carta.
            </p>
          </div>
        </section>

      </div >
    </form >
  );
};

export default CheckoutForm;