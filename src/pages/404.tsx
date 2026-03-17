import * as React from "react"
import { Link, HeadFC, PageProps, HeadProps } from "gatsby"
import Typography from "../components/atoms/Typography"
import Layout from "../components/organisms/Layout"
import Button from "../components/atoms/Button"
import Seo from "../components/atoms/Seo"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout showCustomCursor>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0b1122] p-4 text-[#eef3ff]">
        <Typography variant="h1" className='text-center text-[#f5f8ff]'>Pagina non trovata</Typography>
        <Typography variant="p" className='text-center !text-[#aac0ef]'>
          Ti sei perso in mezzo alle pagine di UUUK?
        </Typography>
        <Button href="/" text="Torna alla homepage"></Button>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head = ({ location }: HeadProps) => {

  return (
    <Seo
      lang={"it"}
      title={'404'}
      pathname={location.pathname}
      description={"Ops! Sembra che la pagina che stai cercando sia scomparsa nel nulla. Ma non preoccuparti, il nostro team di esploratori digitali è già al lavoro per riportarla alla luce. Nel frattempo, perché non torni alla homepage e continui a scoprire le meraviglie di UUUK?"}
      noIndex
    />
  )
}
