import React, { useEffect } from 'react'
import Layout from '../components/organisms/Layout'
import Typography from '../components/atoms/Typography'
import { HeadProps, Link } from 'gatsby'
import Button from '../components/atoms/Button'
import Seo from '../components/atoms/Seo'
import { useCart } from '../utilities/cartContext'
import { CheckCircle2 } from 'lucide-react'

const Grazie = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <Layout >
      <div className="min-h-screen w-full bg-[#070d1e] bg-[radial-gradient(circle_at_top,_#162f5f_0%,_#070d1e_55%)] px-4 py-12 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-[#0f1b3c]/90 px-8 py-14 text-center shadow-[0_20px_70px_rgba(5,8,18,0.55)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f97316]/15 text-[#f97316]">
            <CheckCircle2 size={34} />
          </div>
          <Typography variant="h1" className='text-[#f6f8ff] !text-4xl uppercase tracking-tight'>Grazie del tuo acquisto!</Typography>
          <Typography variant='p' render='h2' className='!text-[#ffb170] !text-lg'>Stiamo preparando il tuo UUUK!</Typography>
          <Typography variant='p' render='p' className='!text-[#b6c8f2] max-w-xl'>Ti arriverà a breve una mail di conferma del tuo ordine dalla quale potrai seguire lo stato del tuo ordine.</Typography>
          <Button text="Torna alla home" href="/" />
        </div>
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