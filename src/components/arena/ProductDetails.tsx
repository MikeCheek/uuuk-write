import React, { useMemo, useState } from 'react'
import { StripeProduct } from '../../utilities/stripeHelper'
import { Link } from 'gatsby'
import { getCoverTemplateImagePath } from '../../utilities/arenaHelpers'
import { useCart } from '../../utilities/cartContext'
import { useSnackbar } from '../../utilities/snackbarContext'
import Preview3DWrapper from './Preview3DWrapper'
import Switch from './Switch'
import { Metadata } from '../../utilities/arenaSettings'

const ProductDetails = ({ preset, presetName, stripeData }: {
  presetName: string
  preset: Metadata
  stripeData: StripeProduct
}) => {
  const [mode, setMode] = useState<'flat' | '3D'>('flat')
  const { addToCart } = useCart()
  const { showSnackbar } = useSnackbar()

  const name = presetName ?? stripeData.name ?? `${preset.format} - ${preset.frontCover.collection} - ${preset.frontCover.template}`
  const originalImage = stripeData?.images?.[0] || getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)

  const priceValue = stripeData?.default_price?.unit_amount
    ? Number(stripeData.default_price.unit_amount) / 100
    : undefined

  const linkProduct = stripeData
    ? `/arena?preset_id=${preset.id}&pid=${stripeData.id}&price_id=${stripeData.default_price.id}&pname=${encodeURIComponent(name)}${priceValue !== undefined ? `&pprice=${priceValue}` : ''}${originalImage ? `&pimage=${encodeURIComponent(originalImage)}` : ''}`
    : `/arena?preset_id=${preset.id}`

  const handleAddToCart = () => {
    if (!stripeData) {
      showSnackbar("Spiacenti, non possiamo aggiungere questo prodotto al carrello al momento.", "error")
      return;
    }

    addToCart({
      ...preset,
      price: stripeData.default_price.unit_amount ? Number((stripeData.default_price.unit_amount / 100)) : undefined,
      productId: stripeData.id,
      priceId: stripeData.default_price.id,
      name: name,
      image: stripeData.images[0] || getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template),
      id: preset.id
    })
  }

  // The price is already here! No fetching required.
  const formattedPrice = useMemo(() => {
    if (!stripeData || !stripeData.default_price.unit_amount) return "Prezzo su richiesta"
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: stripeData.default_price.currency.toUpperCase(),
    }).format(stripeData.default_price.unit_amount / 100)
  }, [stripeData])

  return (
    <div className="min-h-screen bg-[#070d1e] bg-[radial-gradient(circle_at_top,_#132a52_0%,_#070d1e_60%)] p-4 md:p-12">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f1b3c]/90 shadow-[0_24px_70px_rgba(6,10,20,0.55)]">

        {/* Breadcrumb / Back Link */}
        <div className="border-b border-white/10 p-6">
          <Link to="/galleria" className="flex items-center gap-1 text-sm text-[#9ad0ff] hover:text-[#ffb170]">
            ← Torna alla galleria
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 p-8 md:grid-cols-2 lg:p-12">

          {/* LEFT COLUMN: Visual Preview */}
          <div className="relative flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1531] p-8">
            <div className="absolute top-4 right-4 z-20">
              <Switch isOn={mode === '3D'} toggleSwitch={() => setMode(mode === 'flat' ? '3D' : 'flat')} />
            </div>

            <div className="scale-100 transition-transform duration-500 max-h-[60vh]">
              {
                preset && mode === '3D' ? (
                  <Preview3DWrapper product={preset} noExtra />
                ) : (
                  <img
                    src={stripeData.images[0] || getCoverTemplateImagePath(preset.format, preset.frontCover.collection, preset.frontCover.template)}
                    alt={name}
                    width={200}
                    height={360}
                    className="object-contain !w-auto !h-auto"
                  />
                )
              }
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <h3 className="mb-2 text-sm font-black uppercase tracking-widest text-[#ffb170]">
                {preset.frontCover.collection}
              </h3>
              <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-white">{name}</h1>
              <div className="flex items-center gap-4">
                <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-[#d5e2ff]">
                  Formato {preset.format}
                </span>
                <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-[#d5e2ff]">
                  {preset.modules.length} Moduli
                </span>
              </div>
            </div>

            <div className="leading-relaxed text-[#b6c8f2]">
              <p>
                Agenda stampata 3D in formato {preset.format} della collezione {preset.frontCover.collection}.
                Include template personalizzati e {preset.modules.length} sezioni interne.
                Perfetta per l'organizzazione quotidiana e per un regalo davvero unico.
              </p>
            </div>

            <div className="mt-4 border-t border-white/10 pt-6">
              <div className="flex items-end gap-4 mb-8">
                {formattedPrice ? (
                  <span className="text-4xl font-black text-white">{formattedPrice}</span>
                ) : (
                  <span className="italic text-[#8ea2d0]">Prezzo non disponibile</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="rounded-xl border border-[#f97316]/35 bg-[#f97316] px-6 py-3 text-base font-black text-[#1e293b] transition-colors hover:bg-[#fb8a35]"
                >
                  Aggiungi al carrello
                </button>
                <Link
                  to={linkProduct}
                  className="inline-flex items-center justify-center rounded-xl border border-[#9ad0ff]/35 bg-[#9ad0ff]/10 px-6 py-3 text-base font-bold text-[#d8ecff] transition-colors hover:bg-[#9ad0ff]/20"
                >
                  Personalizza
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails