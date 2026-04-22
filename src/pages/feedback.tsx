
import React, { useState } from 'react';
import StarRating from '../components/atoms/StarRating';

const initialState = {
  email: '',
  orderExperience: 0,
  findProducts: 0,
  customizeArena: 0,
  completeOrder: 0,
  navigateCovers: 0,
  configureTexture: 0,
  priceClarity: 0,
  siteHighlight: '',
  siteChange: '',
};

const FeedbackPage: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleStar = (val: number) => setForm(f => ({ ...f, orderExperience: val }));
  const handleStar10 = (name: string, val: number) => setForm(f => ({ ...f, [name]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email) {
      setError('Email obbligatoria');
      return;
    }
    try {
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Errore invio');
      setSubmitted(true);
    } catch (err) {
      setError('Errore durante l\'invio. Riprova.');
    }
  };



  if (typeof window === 'undefined') {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_12px_36px_rgba(6,10,20,0.45)] text-center">
          <h2 className="text-2xl font-black mb-4 text-[#f6f8ff]">Grazie per il tuo feedback!</h2>
          <p className="text-[#b6c8f2]">Riceverai presto un codice sconto via email.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top_left,_#142a52_0%,_#070d1e_60%)] px-4 py-10 flex items-center justify-center">
      <div className="mx-auto w-full md:max-w-[80vw] rounded-2xl border border-white/10 bg-[#0f1b3c]/90 p-8 shadow-[0_12px_36px_rgba(6,10,20,0.45)]">
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-[#f6f8ff] tracking-tight uppercase">DICCI LA TUA 🙂</h1>
        <p className="mb-6 text-[#b6c8f2] leading-relaxed">
          Il tuo parere conta tantissimo per noi!<br />
          Bastano <b>meno di 45 secondi</b> per rispondere a qualche domanda:<br />
          <span className="block mt-2">⭐ Valuta la tua esperienza<br />
            📝 Dicci cosa ti è piaciuto (o meno)<br />
            🚀 Aiutaci a migliorare UUUUk per te e per tutti!</span><br />
          <span className="block mt-2">Grazie di cuore per il tempo che ci dedichi! 💛</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Email <span className="text-red">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="border border-white/10 rounded-lg px-3 py-2 w-full bg-[#101d3f] text-[#f6f8ff] placeholder-[#b6c8f2] focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="La tua email" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Come è stato ordinare su Uuuk? <span className="text-red">*</span></label>
            <StarRating value={form.orderExperience} onChange={handleStar} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato facile trovare i prodotti sul nostro sito? <span className="text-red">*</span></label>
            <StarRating value={form.findProducts} onChange={v => handleStar10('findProducts', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato facile personalizzare il tuo diario nell'Arena? <span className="text-red">*</span></label>
            <StarRating value={form.customizeArena} onChange={v => handleStar10('customizeArena', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato facile completare l'ordine fino al carrello? <span className="text-red">*</span></label>
            <StarRating value={form.completeOrder} onChange={v => handleStar10('completeOrder', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato facile navigare tra copertine/ricambi? <span className="text-red">*</span></label>
            <StarRating value={form.navigateCovers} onChange={v => handleStar10('navigateCovers', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato intuitivo configurare texture/nomi? <span className="text-red">*</span></label>
            <StarRating value={form.configureTexture} onChange={v => handleStar10('configureTexture', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Su scala 1-5, quanto è stato chiaro il prezzo finale + spedizione? <span className="text-red">*</span></label>
            <StarRating value={form.priceClarity} onChange={v => handleStar10('priceClarity', v)} max={5} className="mt-4 text-6xl gap-4 flex justify-evenly" />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Cosa ti ha colpito di più del sito?</label>
            <textarea name="siteHighlight" value={form.siteHighlight} onChange={handleChange} className="border border-white/10 rounded-lg px-3 py-2 w-full bg-[#101d3f] text-[#f6f8ff] placeholder-[#b6c8f2] focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Scrivi qui..." />
          </div>
          <div>
            <label className="block font-bold text-[#8ea2d0] mb-1">Cosa cambieresti per renderlo migliore?</label>
            <textarea name="siteChange" value={form.siteChange} onChange={handleChange} className="border border-white/10 rounded-lg px-3 py-2 w-full bg-[#101d3f] text-[#f6f8ff] placeholder-[#b6c8f2] focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Scrivi qui..." />
          </div>
          {error && <div className="text-red-600 font-bold text-center">{error}</div>}
          <button type="submit" className="w-full bg-yellow text-black font-black text-lg rounded-lg py-3 mt-2 shadow hover:bg-[#ffcf66]/90 transition">Invia</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
