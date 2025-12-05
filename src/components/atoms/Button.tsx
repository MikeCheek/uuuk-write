import React from 'react'

const Button = ({ text = "Ordina ora", onClick, href, small = false }: { text?: string, onClick?: () => void, href?: string, small?: boolean }) => {

  const style = `cursor-none border border-transparent font-medium rounded-lg text-beige bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 ${small ? 'text-base px-4 py-2' : 'text-xl px-10 py-4'}`

  return (
    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
      {href ? (
        <a href={href} className={style}>
          {text}
        </a>
      ) : (
        <button onClick={onClick} className={style}>
          {text}
        </button>
      )}
    </div>
  )
}

export default Button