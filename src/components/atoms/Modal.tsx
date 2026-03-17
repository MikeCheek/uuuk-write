import { StaticImage } from 'gatsby-plugin-image'
import React, { useEffect, useRef, useState } from 'react'

const Modal: React.FC<{
  show: boolean
  onClose: () => void
  children?: React.ReactNode
  showCursor?: boolean
}> = ({ show, onClose, children, showCursor = false }) => {
  const ANIM_DURATION = 1000
  const [mounted, setMounted] = useState<boolean>(show)
  const [visible, setVisible] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let timeout: number | undefined
    if (show) {
      // mount and play enter animation
      setMounted(true)
      // ensure DOM is painted before starting animation
      requestAnimationFrame(() => {
        setVisible(true)
        // focus the modal for accessibility after it becomes visible
        requestAnimationFrame(() => ref.current?.focus())
      })

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', onKey)
      return () => {
        document.removeEventListener('keydown', onKey)
      }
    } else {
      // play exit animation then unmount
      setVisible(false)
      timeout = window.setTimeout(() => {
        setMounted(false)
      }, ANIM_DURATION)
      return () => {
        if (timeout) clearTimeout(timeout)
      }
    }
  }, [show, onClose])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(5,9,20,0.72)] transition-opacity duration-[1000ms] ease ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        // close when clicking on overlay
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`relative min-w-[320px] max-w-[90%] transform rounded-2xl border border-white/15 bg-[#0f1b3c]/95 px-8 py-10 outline-none backdrop-blur-[8px] backdrop-saturate-[120%] transition-all duration-[1000ms] ease-[cubic-bezier(.2,.9,.2,1)] ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0'}`}
        style={{ WebkitBackdropFilter: 'blur(8px) saturate(120%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`${showCursor ? 'cursor-pointer' : 'cursor-none'} absolute right-2 top-0 border-none bg-transparent text-[#ffb170]`}
          style={{
            fontSize: '4rem',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div>{children ?? <div className='flex flex-col items-center justify-center gap-8'>
          <p className='text-2xl font-bold uppercase text-[#f3f7ff]'>Scegli la collezione</p>
          <div className='flex flex-col gap-12 text-[#f3f7ff] md:flex-row'>
            <a className='group' href="https://eu.jotform.com/build/250762743092357" target="_blank" title='Acquista collezione Triadic'>
              <StaticImage src='../../images/triadic.webp' alt='cover image 1' className='w-64 md:w-80 h-auto m-2 rounded-lg' />
              <p className='mt-4 w-full text-center text-lg group-hover:underline'>Collezione Triadic</p>
            </a>
            <a className='group' href="https://form.jotform.com/uuukthefuture/mood-paypal-form-" target='_blank' title='Acquista collezione Mood'>
              <StaticImage src='../../images/mood.webp' alt='cover image 2' className='w-64 md:w-80 h-auto m-2 rounded-lg' />
              <p className='mt-4 w-full text-center text-lg group-hover:underline'>Collezione Mood</p>
            </a>
          </div>
        </div>}</div>
      </div>
    </div>
  )
}

export default Modal