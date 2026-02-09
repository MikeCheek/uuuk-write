import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className='text-center py-4 mx-auto text-beige'>
      <p className='mx-0'>&copy; {year ?? new Date().getFullYear()} UUUK. All rights reserved.</p>
    </div>
  )
}

export default Footer