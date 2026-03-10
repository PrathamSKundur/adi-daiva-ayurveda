import React from 'react'
import { motion } from 'framer-motion'
import { Star, CalendarDays, Users, Sparkles } from 'lucide-react'

const highlights = [
  { icon: CalendarDays, label: 'Every Pushya Nakshatra' },
  { icon: Users,        label: 'For Children of All Ages' },
  { icon: Sparkles,     label: 'Boosts Immunity & Intellect' },
]

export default function SwarnaSection(){
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
        <h2 className="heading text-2xl font-bold whitespace-nowrap" style={{ color: '#1B4332' }}>
          Swarna Bindu Prashana
        </h2>
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl overflow-hidden shadow-xl"
        style={{ border: '2.5px solid #D4AF37' }}
      >
        {/* Top gold bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #1B4332 100%)' }} />

        <div className="flex flex-col lg:flex-row">

          {/* ── Image ── */}
          <div className="w-full lg:w-[48%] h-64 sm:h-80 lg:h-auto min-h-[340px] relative flex-shrink-0">
            <img
              src="/20260310.jpg"
              alt="Swarna Bindu Prashana Drive for Kids"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 50%, rgba(27,67,50,0.4) 100%)'
              }}
            />
          </div>

          {/* ── Content panel ── */}
          <div
            className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10"
            style={{ background: '#1B4332' }}
          >
            {/* Badge */}
            <span
              className="self-start inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{
                background: 'rgba(212,175,55,0.18)',
                border: '1px solid rgba(212,175,55,0.55)',
                color: '#D4AF37'
              }}
            >
              <Star size={11} fill="#D4AF37" style={{ color: '#D4AF37' }} />
              Special Monthly Drive
            </span>

            <h3
              className="heading text-2xl sm:text-3xl lg:text-3xl font-bold leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              Swarna Bindu<br />Prashana Drive
            </h3>

            <p
              className="mt-1 text-sm font-medium"
              style={{ color: '#D4AF37' }}
            >
              Ancient Ayurvedic Immunisation for Children
            </p>

            <div className="my-5 h-px w-10" style={{ background: '#D4AF37' }} />

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(216,226,220,0.9)' }}>
              Conducted every <strong style={{ color: '#D4AF37' }}>Pushya Nakshatra</strong> — a
              sacred Ayurvedic ritual using <strong style={{ color: '#FFFFFF' }}>Swarna Bhasma</strong>{' '}
              (purified gold), Brahmi ghee &amp; honey. Strengthens immunity, sharpens intellect
              and supports holistic growth in children.
            </p>

            {/* Highlights */}
            <div className="mt-6 space-y-3">
              {highlights.map(h => (
                <div key={h.label} className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <h.icon size={15} style={{ color: '#D4AF37' }} />
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(216,226,220,0.85)' }}>{h.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/919380736394"
              target="_blank"
              rel="noreferrer"
              className="mt-7 self-start px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: '#D4AF37', color: '#1B4332' }}
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

