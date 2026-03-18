import React from 'react'
import Layout from '../components/organisms/Layout'
import CartCheckout from '../components/arena/CartCheckout'
import Seo from '../components/atoms/Seo'
import { HeadProps } from 'gatsby'

const CartPage = () => {
  return (
    <Layout showCustomCursor={false} shoppingCart={false}>
      <CartCheckout />
    </Layout>
  )
}

export default CartPage

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'Carrello'}
      pathname={location.pathname}
      description={"Riepilogo del tuo carrello UUUK. Visualizza i prodotti selezionati, modifica le quantità o rimuovi articoli prima di procedere al checkout. Assicurati che tutto sia perfetto prima di finalizzare il tuo ordine e ricevere la tua agenda personalizzata."}
      noIndex
    />
  )
}