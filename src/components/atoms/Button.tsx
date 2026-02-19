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
      : 'text-lg px-8 py-3'

  const loadingClasses = loading ? 'cursor-not-allowed opacity-70' : ''

  const baseStyle = `
    inline-flex items-center justify-center 
    font-semibold rounded-lg 
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    active:scale-95 transform
    ${sizeClasses}
    ${loadingClasses}
  `

  const variantStyle = variant === "primary"
    ?
    // theme === "blue"
    //   ? 
    "bg-blue text-beige shadow-md hover:shadow-lg hover:bg-opacity-90 focus:ring-blue"
    // : 
    // "bg-beige text-blue shadow-md hover:shadow-lg hover:bg-opacity-90 focus:ring-beige"
    : theme === "blue"
      ? "bg-transparent border-2 border-blue text-blue hover:bg-blue hover:text-beige focus:ring-blue"
      : "bg-transparent border-2 border-beige text-beige hover:bg-beige hover:text-blue focus:ring-beige"

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
      <Link to={href} className={style} >
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