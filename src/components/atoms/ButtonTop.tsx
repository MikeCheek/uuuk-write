import React, { useCallback, useEffect, useRef, useState } from 'react'

const ButtonTop = ({ onClick, text, onClickScrolled, textScrolled }: { onClick: () => void, text: string, onClickScrolled?: () => void, textScrolled?: string }) => {

  const [scrolled, setScrolled] = useState<boolean>(false)
  const targetText = scrolled && textScrolled ? textScrolled : text
  const [displayedText, setDisplayedText] = useState<string>(text)
  const timeoutRef = useRef<number | null>(null)
  const displayedRef = useRef<string>(displayedText)

  // keep displayedRef roughly in sync
  useEffect(() => {
    displayedRef.current = displayedText
  }, [displayedText])

  // update scrolled state on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onScroll = () => {
      const isScrolled = window.scrollY > 100
      setScrolled(prev => {
        if (prev === isScrolled) return prev
        return isScrolled
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // run once to pick up initial value
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // typing animation: delete to common prefix then type target
  useEffect(() => {
    // nothing to do on server or if already equal
    if (typeof window === 'undefined') return
    if (targetText === displayedRef.current) return

    // clear any running timer
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const deleteSpeed = 40
    const typeSpeed = 80

    const getCommonPrefixLen = (a: string, b: string) => {
      let i = 0
      const n = Math.min(a.length, b.length)
      while (i < n && a[i] === b[i]) i++
      return i
    }

    const prefix = getCommonPrefixLen(displayedRef.current, targetText)

    const typeStep = () => {
      if (displayedRef.current.length < targetText.length) {
        displayedRef.current = targetText.slice(0, displayedRef.current.length + 1)
        setDisplayedText(displayedRef.current)
        timeoutRef.current = window.setTimeout(typeStep, typeSpeed)
      } else {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }

    const deleteStep = () => {
      if (displayedRef.current.length > prefix) {
        displayedRef.current = displayedRef.current.slice(0, -1)
        setDisplayedText(displayedRef.current)
        timeoutRef.current = window.setTimeout(deleteStep, deleteSpeed)
      } else {
        // start typing the remainder
        timeoutRef.current = window.setTimeout(typeStep, typeSpeed)
      }
    }

    // decide where to start: if already at or below prefix, start typing; otherwise delete
    if (displayedRef.current.length <= prefix) {
      typeStep()
    } else {
      deleteStep()
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [scrolled, text, textScrolled])

  // choose click handler depending on scrolled state (fallback to original onClick)
  const handleClick = useCallback(() => {
    if (scrolled && onClickScrolled) {
      onClickScrolled()
    } else {
      onClick()
    }
  }, [scrolled, onClick, onClickScrolled])

  return (
    <button
      onClick={handleClick}
      className={`fixed cursor-none z-[100] top-4 right-4 rounded-lg border px-4 py-2 text-base font-bold uppercase tracking-wide transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b1122] focus:ring-[#f97516] ${scrolled ? 'border-2 border-[#f97516]/45 bg-[#f97516]/10 text-[#f97516]' : 'border-[#ffb170]/35 bg-gradient-to-r from-[#f97516] to-[#ff9d57] text-[#0b1122] shadow-[0_10px_24px_rgba(249,117,22,0.26)]'
        }`}
      aria-pressed={scrolled}
    >
      <span
        style={{
          display: 'inline-block',
          // slight transform for subtle movement while typing
          transition: 'transform 80ms linear',
          transform: 'translateY(0)'
        }}
      >
        {displayedText}
      </span>
    </button>
  )
}

export default ButtonTop