import React, { useEffect } from 'react'
import Layout from '../components/organisms/Layout'
import Typography from '../components/atoms/Typography'
import { HeadProps, Link } from 'gatsby'
import Button from '../components/atoms/Button'
import Seo from '../components/atoms/Seo'
import { useCart } from '../utilities/cartContext'

const Grazie = () => {
  const { clearCart, cart } = useCart();

  useEffect(() => {
    clearCart();
  }, [cart, clearCart]);

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

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'Grazie'}
      pathname={location.pathname}
      description={"Grazie per aver acquistato la tua UUUK. Ti contatteremo al più presto per completare il tuo ordine."}
      noIndex
    />
  )
}