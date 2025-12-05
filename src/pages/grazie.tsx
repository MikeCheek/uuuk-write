import React from 'react'
import Layout from '../components/organisms/Layout'
import Typography from '../components/atoms/Typography'
import { Link } from 'gatsby'
import Button from '../components/atoms/Button'

const Grazie = () => {
  return (
    <Layout >
      <div className='flex flex-col w-full items-center justify-center h-full text-center gap-8'>
        <Typography variant="h1" className='text-beige'>Grazie del tuo acquisto!</Typography>
        <Typography variant='p' render='h2' className='!text-brown'>Stiamo preparando il tuo UUUK. Ti contatteremo al più presto.</Typography>
        <Button text="Torna alla home" href="/" />
      </div>
    </Layout>
  )
}

export default Grazie