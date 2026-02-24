import React, { useState } from 'react';
import { useCheckout, PaymentElement, ShippingAddressElement } from '@stripe/react-stripe-js/checkout';
import Button from '../atoms/Button';
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


  if (checkoutState.type === 'loading') return <div className="text-center py-10">Caricamento...</div>;
  if (checkoutState.type === 'error') return <div className="text-red-500 italic">Errore: {checkoutState.error.message}</div>;

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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Grid layout: 
        Mobile: Single column, tight spacing
        Desktop: Two columns to avoid long scrolling
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">

        {/* Section 0: Contact Info */}
        <section className="bg-white/5 p-4 rounded-lg border border-beige/20 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brown">Contatti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1 text-brown">Email *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="nome@esempio.com"
                className="w-full px-3 py-2 text-sm border border-beige/30 rounded bg-white/5 text-brown placeholder-gray-400 focus:outline-none focus:border-brown"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-brown">Telefono *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+39 333 1234567"
                className="w-full px-3 py-2 text-sm border border-beige/30 rounded bg-white/5 text-brown placeholder-gray-400 focus:outline-none focus:border-brown"
              />
            </div>
          </div>
        </section>

        {/* Section 1: Shipping */}
        <section className="bg-white/5 p-4 rounded-lg border border-beige/20">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brown">Spedizione</h3>
          <ShippingAddressElement />
        </section>

        {/* Section 2: Payment & Submit */}
        <section className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-beige/20">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brown">Pagamento</h3>
            <div className="mb-4 p-4 bg-beige/10 rounded-lg border border-beige/30 shadow-sm">
              <div className="space-y-2 text-sm text-brown">

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Importo</span>
                  <span className="font-medium">{checkoutState.checkout.total.subtotal.amount}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Spedizione</span>
                  <span className="font-medium">{checkoutState.checkout.total.shippingRate.amount}</span>
                </div>

                {/* Discount - Green text adds a positive "saving" feel */}
                {
                  discountApplied ?
                    <div className="flex justify-between text-green-700">
                      <span>Sconto</span>
                      <span className="font-medium">- {checkoutState.checkout.total.discount.amount}</span>
                    </div> : <></>
                }

                {/* Divider */}
                <div className="my-2 border-t border-beige/30 pt-2">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-brown-900">Totale</span>
                    <span className="text-lg font-extrabold text-brown-900">
                      {checkoutState.checkout.total.total.amount}
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Spedizione gratuita per ordini sopra {process.env.SHIPPING_THRESHOLD ? (parseInt(process.env.SHIPPING_THRESHOLD) / 100).toFixed(2) : '30.00'}€
            </p>
            {/* Discount Code Section */}
            <div className="mb-4 p-3 bg-beige/10 rounded border border-beige/30">
              <p onClick={() => setPromoCode('')} className="text-sm text-blue-600 hover:underline cursor-pointer">
                Hai un codice sconto?
              </p>
              {promoCode !== undefined && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-beige/30 rounded bg-white/5 text-brown placeholder-gray-400 focus:outline-none focus:border-brown"
                  />
                  <Button
                    onClick={discountApplied ? handleDiscountRemove : handleDiscountApply}
                    text={discountApplied ? "Rimuovi" : "Applica"}
                    small
                  />
                </div>
              )}
            </div>
            <PaymentElement options={paymentElementOptions} />
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="pt-2">
            <div className="w-full py-3 shadow-lg transform active:scale-95 transition-transform">
              <Button text="Paga ora" loading={loading} type="submit" />
            </div>
            <p className="text-[10px] text-center mt-3 opacity-50">
              Pagamento sicuro con Stripe. Non memorizziamo i dati della tua carta.
            </p>
          </div>
        </section>

      </div >
    </form >
  );
};

export default CheckoutForm;