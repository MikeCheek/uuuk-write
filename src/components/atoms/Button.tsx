import { Link } from 'gatsby'
import React from 'react'

interface ButtonProps {
  text?: string
  onClick?: () => void
  href?: string
  icon?: React.ReactNode
  small?: boolean
  smaller?: boolean
  variant?: "primary" | "secondary" | "tertiary"
  loading?: boolean,
  type?: "button" | "submit" | "reset"
  theme?: "blue" | "beige"
  className?: string
}

const Button = ({
  text = "Ordina ora",
  onClick,
  href,
  icon,
  small = false,
  smaller = false,
  variant = "primary",
  loading = false,
  type = "button",
  theme = "beige",
  className = ''
}: ButtonProps) => {

  // Logic for sizing to keep the JSX clean
  const sizeClasses = smaller
    ? 'text-xs px-1 py-[0.5px]'
    : small
      ? 'text-sm px-2 py-1'
      : 'text-base px-4 py-2'

  const loadingClasses = loading ? 'cursor-not-allowed opacity-70' : ''

  const baseStyle = `
    inline-flex items-center justify-center 
    font-extrabold rounded-xl uppercase tracking-wider
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b1122]
    active:scale-95 transform
    ${sizeClasses}
    ${loadingClasses}
  `

  const variantStyle = variant === "primary"
    ? "bg-gradient-to-r from-[#f97516] via-[#f97516] to-[#ffffff] text-[#0b1122] border border-[#f97516] shadow-[0_8px_20px_rgba(249,117,22,0.35)] hover:bg-[#e8681a] hover:border-[#e8681a] focus:ring-[#f97516]"
    : variant === "tertiary"
      ? "border-2 border-[#f97516]/45 bg-[#f97516]/10 text-[#f97516] hover:bg-[#f97516]/20 focus:ring-[#f97516]"
      : theme === "blue"
        ? "bg-[#9ad0ff]/12 border border-[#9ad0ff]/45 text-[#d8ecff] hover:bg-[#9ad0ff]/20 focus:ring-[#9ad0ff]"
        : "bg-[#101d3f] border border-white/15 text-[#f2f5ff] hover:bg-[#18274d] focus:ring-[#f97516]"

  const style = `${baseStyle} ${variantStyle} ${className}`

  const content = loading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {text}
    </div>
  ) : (
    <>
      <span>{text}</span>
      {icon ? <span className="inline-flex items-center ml-2">{icon}</span> : null}
    </>
  )

  if (href) {
    const isExternalHref = /^https?:\/\//i.test(href)

    if (isExternalHref) {
      return (
        <a href={href} title={text} className={style} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      )
    }

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