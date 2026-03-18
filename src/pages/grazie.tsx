import React from 'react'
import Layout from '../components/organisms/Layout'
import { HeadProps } from 'gatsby'
import Seo from '../components/atoms/Seo'
import GrazieContent from '../components/arena/GrazieContent'

const Grazie = () => {
  return (
    <Layout>
      <GrazieContent />
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