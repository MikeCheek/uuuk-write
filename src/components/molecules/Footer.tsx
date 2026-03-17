import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <div className='mx-auto mt-6 w-full border-t border-[#0b1122]/10 bg-[#0b1122] py-5 text-center text-[#c7d6f8]'>
      <p className='mx-0 text-sm tracking-wide'>&copy; {year ?? new Date().getFullYear()} UUUK. All rights reserved.</p>
    </div>
  )
}

export default Footer