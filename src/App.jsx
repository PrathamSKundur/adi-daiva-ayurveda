import React from 'react'
import Hero from './components/Hero'
import ServicesGrid from './components/ServicesGrid'
import SwarnaSection from './components/SwarnaSection'
import Panchakarma from './components/Panchakarma'
import Complimentary from './components/Complimentary'
import Footer from './components/Footer'
import BottomBar from './components/BottomBar'

export default function App(){
  return (
    <div className="min-h-screen bg-white font-body" style={{ color: '#1B4332' }}>
      {/* Top header bar */}
      <header className="w-full py-3 px-6 lg:px-12 flex items-center justify-between border-b" style={{ borderColor: '#D8E2DC' }}>
        <span className="heading text-xl lg:text-2xl font-bold" style={{ color: '#1B4332' }}>
          Adi Daiva Ayurveda
        </span>
        <span className="text-xs lg:text-sm uppercase tracking-widest" style={{ color: '#1B4332', opacity: 0.65 }}>
          Clinic · Mysuru
        </span>
      </header>

      {/* Hero is full-width, no max-width cap */}
      <div className="mt-6 px-4 lg:px-12">
        <Hero />
      </div>

      <main className="max-w-6xl mx-auto px-4 lg:px-12 pb-8 space-y-16 mt-14">
        <ServicesGrid />
        <SwarnaSection />
        <Panchakarma />
        <Complimentary />
      </main>

      <Footer />
      <BottomBar />
    </div>
  )
}
