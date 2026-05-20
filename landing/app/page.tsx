import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Demo from '@/components/Demo'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Demo />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
