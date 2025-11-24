import React from 'react'
import Instagram from '../../assets/instagram.svg'

const Actions = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
      <button onClick={onClick} className="px-10 cursor-none py-4 border border-transparent text-xl font-medium rounded-lg text-beige bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
        Ordina il tuo UUUK
      </button>

      <a href="https://www.instagram.com/uuuk.notes/" target="_blank" rel="noopener noreferrer"
        className="ml-4 cursor-none px-8 py-3 text-lg font-medium rounded-lg text-beige bg-transparent border border-beige hover:bg-beige/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-none hover:shadow-md transform hover:scale-105"
      >
        Chi siamo
        <Instagram className="inline-block w-6 h-6 ml-2 -mt-1" fill="beige" />
      </a>
    </div>
  )
}

export default Actions