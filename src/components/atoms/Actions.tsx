import React from 'react'

const Actions = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
      <button onClick={onClick} className="px-10 cursor-none py-4 border border-transparent text-xl font-medium rounded-lg text-beige bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
        Ordina ora
      </button>
    </div>
  )
}

export default Actions