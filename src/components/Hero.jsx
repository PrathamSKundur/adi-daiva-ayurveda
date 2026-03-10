import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{ border: '1px solid #D8E2DC' }}
      >
        {/* ── Mobile: stacked image + tagline bar (unchanged) ── */}
        {/* ── Desktop (lg+): side-by-side, image left 60% / info panel right 40% ── */}
        <div className="flex flex-col lg:flex-row">

          {/* Image */}
          <div className="w-full lg:w-[60%] h-64 sm:h-80 lg:h-[500px] relative flex-shrink-0">
            <img
              src="/20260228_111659.jpg"
              alt="Dr. Rohit S. Patil consulting a patient"
              className="w-full h-full object-cover object-top"
            />
            {/* Gradient overlay — only on mobile (text is overlaid) */}
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(27,67,50,0) 38%, rgba(27,67,50,0.85) 100%)'
              }}
            />
            {/* Mobile text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white lg:hidden">
              <p className="text-xs uppercase tracking-widest mb-1 opacity-80">
                Adi Daiva Ayurveda Clinic
              </p>
              <h1
                className="heading text-2xl sm:text-3xl font-bold leading-snug"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                Dr. Rohit S. Patil
              </h1>
              <p className="text-sm mt-1 opacity-90">B.A.M.S., PGDYS</p>
              <p className="text-xs mt-1 opacity-80">
                Consultant Physician &amp; Clinical Yoga Specialist
              </p>
            </div>
          </div>

          {/* Desktop info panel */}
          <div
            className="hidden lg:flex flex-col justify-center px-10 py-10 flex-1"
            style={{ background: '#1B4332' }}
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#D8E2DC', opacity: 0.7 }}>
              Adi Daiva Ayurveda Clinic · Mysuru
            </p>
            <h1
              className="heading text-4xl xl:text-5xl font-bold text-white leading-tight"
            >
              Dr. Rohit<br />S. Patil
            </h1>
            <p
              className="mt-3 text-base font-medium"
              style={{ color: '#D8E2DC' }}
            >
              B.A.M.S., PGDYS
            </p>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: '#D8E2DC', opacity: 0.85 }}
            >
              Consultant Physician &amp;<br />Clinical Yoga Specialist
            </p>

            {/* Divider */}
            <div className="my-6 h-px w-12" style={{ background: '#D4AF37' }} />

            <p className="text-sm leading-relaxed" style={{ color: '#D8E2DC', opacity: 0.8 }}>
              Authentic Ayurveda · Holistic Healing<br />Compassionate Care
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex gap-3">
              <a
                href="tel:9380736394"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#D8E2DC', color: '#1B4332' }}
              >
                Call Now
              </a>
              <a
                href="https://wa.me/919380736394"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{
                  background: 'transparent',
                  color: '#D8E2DC',
                  border: '1.5px solid rgba(216,226,220,0.45)'
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Mobile tagline bar (unchanged) */}
        <div
          className="px-5 py-4 lg:hidden"
          style={{ background: '#1B4332' }}
        >
          <p className="text-center text-sm text-white tracking-wide">
            Authentic Ayurveda · Holistic Healing · Compassionate Care
          </p>
        </div>
      </motion.div>
    </section>
  )
}
