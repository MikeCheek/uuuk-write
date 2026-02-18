import React, { useState } from 'react';
import { useCheckout, PaymentElement, ShippingAddressElement } from '@stripe/react-stripe-js/checkout';
import Button from '../atoms/Button';
import { StripeCheckoutPaymentElementOptions } from '@stripe/stripe-js';

const CheckoutForm = () => {
  const checkoutState = useCheckout();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const { checkout } = checkoutState;
    const result = await checkout.confirm({
      email: 'customer@example.com' // Ensure this is dynamically populated
    });

    if (result.type === 'error') {
      console.log(result.error.message);
    }
    setLoading(false);
  };

  if (checkoutState.type === 'loading') return <div className="text-center py-10">Caricamento...</div>;
  if (checkoutState.type === 'error') return <div className="text-red-500 italic">Errore: {checkoutState.error.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Grid layout: 
        Mobile: Single column, tight spacing
        Desktop: Two columns to avoid long scrolling
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">

        {/* Section 1: Shipping */}
        <section className="bg-white/5 p-4 rounded-lg border border-beige/20">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brown">Spedizione</h3>
          <ShippingAddressElement />
        </section>

        {/* Section 2: Payment & Submit */}
        <section className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-beige/20">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brown">Pagamento</h3>
            <div className="mb-4 p-3 bg-beige/10 rounded border border-beige/30">
              <p className="text-sm text-brown font-semibold">
                Importo: <span className="font-bold">{checkoutState.checkout.total.subtotal.amount}</span>
                <br />
                Spedizione: <span className="font-bold">{checkoutState.checkout.total.shippingRate.amount}</span>
                <br />
                <br />
                Totale: <span className="font-bold">{checkoutState.checkout.total.total.amount}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Spedizione gratuita per ordini sopra {process.env.SHIPPING_THRESHOLD ? (parseInt(process.env.SHIPPING_THRESHOLD) / 100).toFixed(2) : '30.00'}€
            </p>
            <PaymentElement options={paymentElementOptions} />
          </div>

          <div className="pt-2">
            <div className="w-full py-3 shadow-lg transform active:scale-95 transition-transform">
              <Button text="Paga ora" loading={loading} type="submit" />
            </div>
            <p className="text-[10px] text-center mt-3 opacity-50">
              Pagamento sicuro con Stripe. Non memorizziamo i dati della tua carta.
            </p>
          </div>
        </section>

      </div>
    </form>
  );
};

export default CheckoutForm;