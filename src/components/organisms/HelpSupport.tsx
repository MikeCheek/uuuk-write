import React, { useState } from 'react'
import Modal from '../atoms/Modal'
import { useSnackbar } from '../../utilities/snackbarContext'

type HelpSupportProps = {
  help: boolean | { orderId: string }
}

const HelpSupport = ({ help }: HelpSupportProps) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const { showSnackbar } = useSnackbar()

  if (!help) {
    return null
  }

  const helpMailTo =
    typeof help === 'object' && help.orderId
      ? `mailto:uuuk.thefuture@gmail.com?subject=${encodeURIComponent(
        `Supporto ordine ${help.orderId}`
      )}&body=${encodeURIComponent(
        `Ciao team UUUK,%0D%0Aho bisogno di supporto per il mio ordine ${help.orderId}.%0D%0A` +
        `Motivo: info/modifiche/problema.%0D%0A%0D%0AGrazie!`
      )}`
      : `mailto:uuuk.thefuture@gmail.com?subject=${encodeURIComponent(
        'Richiesta di supporto'
      )}&body=${encodeURIComponent(
        `Ciao team UUUK,%0D%0Aho bisogno di supporto.%0D%0AMotivo: info/modifiche/problema.%0D%0AGrazie!`
      )}`

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSnackbar(successMessage, 'success')
    } catch {
      showSnackbar('Impossibile copiare automaticamente. Copia manualmente.', 'error')
    }
  }

  return (
    <>
      <Modal show={helpModalOpen} onClose={() => setHelpModalOpen(false)} showCursor>
        <div className="flex max-w-md flex-col gap-4 p-2 text-[#f3f7ff]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8ea2d0]">Supporto</p>
          <h3 className="text-2xl font-black uppercase leading-tight">Come vuoi contattarci?</h3>
          <p className="text-sm text-[#c4d4ff]">
            Scegli un&apos;azione rapida per ricevere assistenza su ordini, modifiche o informazioni.
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => copyToClipboard('uuuk.thefuture@gmail.com', 'Email copiata')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  copyToClipboard('uuuk.thefuture@gmail.com', 'Email copiata')
                }
              }}
              className="select-text break-all rounded-lg border border-white/20 bg-[#22325d] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a3f73] focus:outline-none focus:ring-2 focus:ring-[#8ea2d0]"
            >
              uuuk.thefuture@gmail.com
            </div>

            <a
              href={helpMailTo}
              className="inline-flex items-center justify-center rounded-lg border border-[#f97316]/35 bg-[#f97316] px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-[#1e293b] transition-all hover:bg-[#fb8a35]"
            >
              Apri email precompilata
            </a>

            {typeof help === 'object' ?
              <button
                type="button"
                onClick={() => copyToClipboard(help.orderId ? help.orderId : '', 'ID ordine copiato')}
                className="rounded-lg border border-white/20 bg-[#22325d] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a3f73]"
              >
                Copia ID ordine
              </button>
              : <></>}
          </div>
        </div>
      </Modal>

      <button
        type="button"
        onClick={() => setHelpModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[#f97316]/45 bg-[#f97316] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#1e293b] shadow-[0_14px_30px_rgba(249,115,22,0.35)] transition-all hover:bg-[#fb8a35]"
      >
        Aiuto
      </button>
    </>
  )
}

export default HelpSupport