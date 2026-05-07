import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from './Button'

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
    <div className="fixed cursor-none z-[100] top-4 right-4"
      aria-pressed={scrolled}
    >
      <Button
        onClick={handleClick}
        text={displayedText}
        type="button"
        variant={scrolled ? "tertiary" : "primary"}
      />
    </div>
  )
}

export default ButtonTop