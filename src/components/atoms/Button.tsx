import { Link } from 'gatsby'
import React from 'react'

const Button = ({ text = "Ordina ora", onClick, href, small = false, smaller = false, variant = "primary" }: { text?: string, onClick?: () => void, href?: string, small?: boolean, smaller?: boolean, variant?: "primary" | "secondary" }) => {

  const baseStyle = `cursor-none font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 ${smaller ? 'text-sm px-2 py-1' : small ? 'text-base px-4 py-2' : 'text-xl px-10 py-4'}`

  const variantStyle = variant === "primary"
    ? "text-beige bg-blue focus:ring-beige"
    : "text-beige bg-transparent border border-beige border-2 focus:ring-beige"

  const style = `${baseStyle} ${variantStyle}`

  return (
    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
      {href ? (
        <Link to={href} className={style}>
          {text}
        </Link>
      ) : (
        <button onClick={onClick} className={style}>
          {text}
        </button>
      )}
    </div>
  )
}

export default Button