import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Eye, Salad, Flame } from 'lucide-react'

const therapies = [
  {
    icon: Leaf,
    title: 'Geriatric Care',
    desc: 'Netra Basti & Rejuvenating Therapies for the Elderly.'
  },
  {
    icon: Eye,
    title: 'Digital Detox',
    desc: 'Specialized De-stress Programs for Students & Professionals. Netra Tarpana & More.'
  },
  {
    icon: Salad,
    title: 'Personalized Diet Chart',
    desc: 'Custom Ayurvedic diet plans aligned with your Prakriti for lasting health.'
  },
  {
    icon: Flame,
    title: 'Yoga Sessions',
    desc: 'Clinical Yoga sessions tailored to your health condition and lifestyle.'
  }
]

export default function Panchakarma(){
  return (
    <section>
      {/* Section header — styled as a card, not a plain divider label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden mb-5 shadow-sm"
        style={{ background: '#1B4332' }}
      >
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, rgba(216,226,220,0.3) 100%)' }} />
        <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: '#D4AF37' }}>
              Traditional Healing
            </p>
            <h2 className="heading text-2xl sm:text-3xl font-bold text-white">
              Authentic Kerala Panchakarma
            </h2>
          </div>
          <span
            className="self-start sm:self-center text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37' }}
          >
            Certified Therapists
          </span>
        </div>
      </motion.div>

      {/* Therapy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {therapies.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="rounded-xl overflow-hidden flex flex-col"
            style={{ background: '#1B4332', color: '#FFFFFF' }}
          >
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
            <div className="p-5 lg:p-6 flex flex-col gap-3 flex-1">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(216,226,220,0.12)', border: '1px solid rgba(216,226,220,0.2)' }}
              >
                <t.icon size={20} style={{ color: '#D8E2DC' }} />
              </span>
              <div>
                <h3 className="heading text-base font-semibold leading-snug uppercase tracking-wide"
                  style={{ color: '#D4AF37' }}>
                  {t.title}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(216,226,220,0.85)' }}>
                  {t.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
