import { Link } from 'gatsby'
import React from 'react'

interface ButtonProps {
  text?: string
  onClick?: () => void
  href?: string
  small?: boolean
  smaller?: boolean
  variant?: "primary" | "secondary"
  loading?: boolean,
  type?: "button" | "submit" | "reset"
  theme?: "blue" | "beige"
}

const Button = ({
  text = "Ordina ora",
  onClick,
  href,
  small = false,
  smaller = false,
  variant = "primary",
  loading = false,
  type = "button",
  theme = "beige"
}: ButtonProps) => {

  // Logic for sizing to keep the JSX clean
  const sizeClasses = smaller
    ? 'text-xs px-3 py-1.5'
    : small
      ? 'text-sm px-5 py-2'
      : 'text-base px-8 py-3'

  const loadingClasses = loading ? 'cursor-not-allowed opacity-70' : ''

  const baseStyle = `
    inline-flex items-center justify-center 
    font-bold rounded-lg uppercase tracking-wide
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b1122]
    active:scale-95 transform
    ${sizeClasses}
    ${loadingClasses}
  `

  const variantStyle = variant === "primary"
    ? "bg-gradient-to-r from-[#f97516] to-[#ff9d57] text-[#0b1122] border border-[#ffb170]/40 shadow-[0_10px_24px_rgba(249,117,22,0.28)] hover:brightness-105 focus:ring-[#f97516]"
    : theme === "blue"
      ? "bg-[#9ad0ff]/12 border border-[#9ad0ff]/45 text-[#d8ecff] hover:bg-[#9ad0ff]/20 focus:ring-[#9ad0ff]"
      : "bg-[#101d3f] border border-white/15 text-[#f2f5ff] hover:bg-[#18274d] focus:ring-[#f97516]"

  const style = `${baseStyle} ${variantStyle}`

  const content = loading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {text}
    </div>
  ) : (
    text
  )

  if (href) {
    return (
      <Link to={href} title={text ?? content} className={style}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={style} disabled={loading} type={type}>
      {content}
    </button>
  )
}

export default Button