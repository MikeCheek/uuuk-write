import React from 'react'

interface NoImagePlaceholderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Reusable placeholder component for missing product images
 * Used consistently across gallery, product pages, and cart
 */
const NoImagePlaceholder = ({ size = 'md', className = '' }: NoImagePlaceholderProps) => {
  const sizeClasses = {
    sm: 'w-12 h-16',     // Cart drawer: 12x16
    md: 'w-24 h-36',     // Cart checkout: 24x36
    lg: 'w-44 h-56'      // Gallery & Product page: 44x56
  }

  const iconSizeClasses = {
    sm: 'w-6 h-6',       // Small icon
    md: 'w-12 h-12',     // Medium icon
    lg: 'w-12 h-12'      // Large icon (same as md for gallery)
  }

  const textSizeClasses = {
    sm: 'text-[9px]',    // Cart drawer: tiny
    md: 'text-xs',       // Cart checkout: extra small
    lg: 'text-xs'        // Gallery: extra small
  }

  const spacingClasses = {
    sm: 'mb-1',
    md: 'mb-2',
    lg: 'mb-2'
  }

  return (
    <div className={`flex flex-col items-center justify-center rounded-md bg-gradient-to-br from-[#0f1b3c] to-[#0b1531] border border-white/10 ${sizeClasses[size]} ${className}`}>
      <svg
        className={`text-white/30 ${iconSizeClasses[size]} ${spacingClasses[size]}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <span className={`font-semibold text-white/40 text-center px-2 ${textSizeClasses[size]}`}>
        Nessuna immagine
      </span>
    </div>
  )
}

export default NoImagePlaceholder
