import React from 'react'

const Footer = () => {
  return (
    <div className='text-center py-4 mx-auto text-brown'>
      <p className='mx-0'>&copy; {new Date().getFullYear()} UUUK. All rights reserved.</p>
    </div>
  )
}

export default Footer