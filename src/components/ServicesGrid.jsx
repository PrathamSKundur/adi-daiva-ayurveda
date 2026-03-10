import React from 'react'
import { motion } from 'framer-motion'
import {
  Zap, Activity, Heart, Sparkles, Wind, Salad, Shield, Moon
} from 'lucide-react'

const services = [
  { title: 'Pain Management',          desc: 'Joint, back & muscular pain relief', icon: Zap },
  { title: 'Lifestyle Disorders',      desc: 'Diabetes, BP, obesity & more',       icon: Activity },
  { title: "Hormonal / Women's Health", desc: 'PCOD, fertility & menstrual care',   icon: Heart },
  { title: 'Skin & Hair',              desc: 'Psoriasis, hair fall & skin glow',    icon: Sparkles },
  { title: 'Respiratory / ENT',        desc: 'Asthma, sinusitis & allergies',       icon: Wind },
  { title: 'Digestive Health',         desc: 'Acidity, IBS & gut healing',          icon: Salad },
  { title: 'Ano-Rectal / Wound Care',  desc: 'Fistula, piles & wound management',  icon: Shield },
  { title: 'Sleep Aid',                desc: 'Stress, anxiety & insomnia care',     icon: Moon },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function ServicesGrid(){
  return (
    <section>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
        <h2 className="heading text-2xl font-bold" style={{ color: '#1B4332' }}>
          Our Services
        </h2>
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        {services.map((s) => (
          <motion.div
            key={s.title}
            variants={item}
            className="rounded-xl p-4 lg:p-6 flex flex-col items-start gap-3 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{
              border: '1.5px solid #D8E2DC',
              background: '#FAFAFA',
              minHeight: '120px'
            }}
          >
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#D8E2DC' }}
            >
              <s.icon size={20} style={{ color: '#1B4332' }} />
            </span>
            <div>
              <p className="text-sm lg:text-base font-semibold leading-tight" style={{ color: '#1B4332' }}>
                {s.title}
              </p>
              <p className="text-xs mt-1 leading-relaxed text-gray-500">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
