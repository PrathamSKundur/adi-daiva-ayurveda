import React from 'react'
import { motion } from 'framer-motion'
import { Gift, FlaskConical } from 'lucide-react'

const freebies = [
  'Nadi Pariksha (Pulse Diagnosis)',
  'Prakriti Assessment (Body Constitution)',
  'Blood Pressure Check',
  'Height & Weight Check',
]

export default function Complimentary(){
  return (
    <section>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
        <h2 className="heading text-2xl font-bold" style={{ color: '#1B4332' }}>
          Complimentary Services
        </h2>
        <span className="flex-1 h-px" style={{ background: '#D8E2DC' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 items-start lg:items-stretch">
        {/* Free services box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)', color: '#FFFFFF' }}
        >
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
          <div className="p-6 lg:p-8 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(216,226,220,0.12)' }}
              >
                <Gift size={18} style={{ color: '#D8E2DC' }} />
              </span>
              <h3 className="heading text-xl font-semibold">FREE with Every Visit</h3>
            </div>
            <ul className="space-y-3 flex-1">
              {freebies.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(216,226,220,0.9)' }}>
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#D4AF37' }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs" style={{ color: 'rgba(216,226,220,0.5)' }}>
              No appointment needed · Walk-ins welcome
            </p>
          </div>
        </motion.div>

        {/* Paid service highlight */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ border: '2px solid #D8E2DC', background: '#FAFAFA' }}
        >
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #1B4332, #D8E2DC)' }} />
          <div className="p-6 lg:p-8 flex flex-col items-center justify-center text-center gap-3">
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#1B4332' }}
            >
              <FlaskConical size={26} style={{ color: '#D8E2DC' }} />
            </span>
            <p className="text-xs uppercase tracking-widest" style={{ color: '#1B4332', opacity: 0.5 }}>
              Affordable Diagnostics
            </p>
            <h3 className="heading text-5xl font-bold" style={{ color: '#1B4332' }}>
              ₹50
            </h3>
            <div>
              <p className="text-base font-semibold" style={{ color: '#1B4332' }}>
                Blood Sugar Check
              </p>
              <p className="text-xs mt-1 text-gray-400">(Random Blood Sugar — RBS)</p>
            </div>
            <a
              href="tel:9380736394"
              className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#1B4332', color: '#FFFFFF' }}
            >
              Book a Check-up
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
