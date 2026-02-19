import * as React from "react"
import { Link, HeadFC, PageProps, HeadProps } from "gatsby"
import Typography from "../components/atoms/Typography"
import Layout from "../components/organisms/Layout"
import Button from "../components/atoms/Button"
import Seo from "../components/atoms/Seo"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout showCustomCursor>
      <div className="text-beige flex flex-col items-center justify-center min-h-screen gap-8 p-4">
        <Typography variant="h1">Pagina non trovata</Typography>
        <Typography variant="p">
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
