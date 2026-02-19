import React from 'react'
import { getPresetImageFromId, Metadata } from '../../utilities/arenaSettings';
import Button from '../atoms/Button';
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
      name: item.name,
      image: getPresetImageFromId(item.id),
      id: item.id
    })
    navigate('/galleria')
  }


  return (
    <div className="space-y-4 text-gray-100">
      <p><strong>Formato:</strong> {item.format}</p>

      <div className="border-l-2 border-indigo-200 pl-3">
        <p><strong>Copertina Anteriore:</strong></p>
        <ul className="list-disc list-inside pl-4 text-sm space-y-1">
          <li>Colore: {item.frontCover.color.name}</li>
          <li>Collezione/Template: "{item.frontCover.collection}" / {item.frontCover.template}</li>
          {
            item.frontCover.text.trim() != '' ? (<>
              <li>Testo: "{item.frontCover.text}"</li>
              <li>Dimensione Testo: {item.frontCover.fontSize}</li>
              <li>Posizione Testo: {item.frontCover.position}</li>
            </>
            )
              :
              <li>Nessun testo aggiunto.</li>
          }

        </ul>
      </div>

      <div className="pl-4 border-l-2 border-gray-200 space-y-2">
        <p className="font-semibold">Sidebars ({item.modules.length}):</p>
        {item.modules.map((mod, index) => (
          <div key={mod.id} className="text-sm">
            <p><em>Sidebar {index + 1}:</em> Colore: {mod.sidebarColor.name}, Testo: "{mod.sidebarText}" | Pagine: {mod.pageInterior}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-rose-200 pl-3 mb-12">
        <p><strong>Copertina Posteriore:</strong></p>
        <ul className="list-disc list-inside pl-4 text-sm space-y-1">
          <li>Colore: {item.backCover.color.name}</li>
          {
            item.backCover.text.trim() !== '' ?
              <>
                <li>Testo: "{item.backCover.text}"</li>
                <li>Dimensione Testo: {item.backCover.fontSize}</li>
                <li>Posizione Testo: {item.backCover.position}</li>
              </> :
              <li>Nessun testo aggiunto.</li>
          }
        </ul>
      </div>

      <Button
        text="Aggiungi al carrello"
        onClick={handleAddToCart}
      />

    </div>
  )
}

export default Review