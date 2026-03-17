import React from 'react'
import { getPresetImageFromId, Metadata } from '../../utilities/arenaSettings';
import { useCart } from '../../utilities/cartContext';
import { navigate } from 'gatsby';

const Review = (
  { item }: { item: Metadata }
) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      ...item,
      price: item.price,
      priceId: item.priceId,
      name: item.name,
      image: item.image || getPresetImageFromId(item.id),
      id: item.id
    })
    navigate('/galleria')
  }


  return (
    <div className="space-y-6 text-[#d5e2ff]">
      <div className="rounded-xl border border-white/10 bg-[#101d3f] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8ea2d0]">Formato</p>
        <p className="mt-1 text-lg font-black text-white">{item.format}</p>
      </div>

      <div className="rounded-xl border border-[#9ad0ff]/20 bg-[#0b1531] p-4">
        <p className="mb-2 text-sm font-black uppercase tracking-wider text-[#9ad0ff]">Copertina Anteriore</p>
        <ul className="space-y-1 text-sm leading-relaxed">
          <li><span className="text-[#8ea2d0]">Colore:</span> <span className="text-white">{item.frontCover.color.name}</span></li>
          <li><span className="text-[#8ea2d0]">Collezione/Template:</span> <span className="text-white">{item.frontCover.collection} / {item.frontCover.template}</span></li>
          {
            item.frontCover.text.trim() !== '' ? (<>
              <li><span className="text-[#8ea2d0]">Testo:</span> <span className="text-white">"{item.frontCover.text}"</span></li>
              <li><span className="text-[#8ea2d0]">Dimensione Testo:</span> <span className="text-white">{item.frontCover.fontSize}</span></li>
              <li><span className="text-[#8ea2d0]">Posizione Testo:</span> <span className="text-white">{item.frontCover.position}</span></li>
            </>
            )
              :
              <li className="italic text-[#9fb1dc]">Nessun testo aggiunto.</li>
          }
        </ul>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0b1531] p-4">
        <p className="mb-3 text-sm font-black uppercase tracking-wider text-[#ffb170]">Sidebars ({item.modules.length})</p>
        <div className="space-y-2">
          {item.modules.map((mod, index) => (
            <div key={mod.id} className="rounded-lg border border-white/10 bg-[#101d3f] p-3 text-sm">
              <p className="font-semibold text-white">Sidebar {index + 1}</p>
              <p className="text-[#b6c8f2]">Colore: {mod.sidebarColor.name}</p>
              <p className="text-[#b6c8f2]">Testo: "{mod.sidebarText}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#f97316]/25 bg-[#0b1531] p-4">
        <p className="mb-2 text-sm font-black uppercase tracking-wider text-[#ffb170]">Copertina Posteriore</p>
        <ul className="space-y-1 text-sm leading-relaxed">
          <li><span className="text-[#8ea2d0]">Colore:</span> <span className="text-white">{item.backCover.color.name}</span></li>
          {
            item.backCover.text.trim() !== '' ?
              <>
                <li><span className="text-[#8ea2d0]">Testo:</span> <span className="text-white">"{item.backCover.text}"</span></li>
                <li><span className="text-[#8ea2d0]">Dimensione Testo:</span> <span className="text-white">{item.backCover.fontSize}</span></li>
                <li><span className="text-[#8ea2d0]">Posizione Testo:</span> <span className="text-white">{item.backCover.position}</span></li>
              </> :
              <li className="italic text-[#9fb1dc]">Nessun testo aggiunto.</li>
          }
        </ul>
      </div>

      <div className="pt-2">
        <button
          onClick={handleAddToCart}
          className="w-full rounded-xl border border-[#f97316]/35 bg-[#f97316] px-6 py-3 text-base font-black text-[#1e293b] transition-colors hover:bg-[#fb8a35]"
        >
          Aggiungi al carrello
        </button>
      </div>
    </div>
  )
}

export default Review