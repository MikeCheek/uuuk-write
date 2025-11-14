import React from 'react'

const Actions = () => {
  return (
    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
      <button className="px-10 cursor-none py-4 border border-transparent text-lg font-medium rounded-lg text-beige bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
        Ordina il tuo UUUK
      </button>

      <button className="ml-4 cursor-none px-10 py-4 text-lg font-medium rounded-lg text-beige bg-transparent border border-beige hover:bg-beige/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-none hover:shadow-md transform hover:scale-105">
        Chi siamo
      </button>
    </div>
  )
}

export default Actions