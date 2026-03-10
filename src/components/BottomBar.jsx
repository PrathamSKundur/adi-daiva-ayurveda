import React from 'react'
import { MapPin, Phone, MessageCircle } from 'lucide-react'

const MAPS_URL =
  'https://maps.app.goo.gl/WH9Z6Ut6omnbzCUR7'

export default function BottomBar(){
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-50"
      style={{
        background: '#1B4332',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 16px rgba(27,67,50,0.25)'
      }}
    >
      <div className="max-w-4xl mx-auto px-2 h-16 flex items-stretch">
        {/* Find Us */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 active:opacity-60"
        >
          <MapPin size={20} style={{ color: '#D8E2DC' }} />
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#D8E2DC' }}>
            Find Us
          </span>
        </a>

        {/* Divider */}
        <div className="w-px my-3" style={{ background: 'rgba(216,226,220,0.2)' }} />

        {/* Call */}
        <a
          href="tel:9380736394"
          className="flex-1 flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 active:opacity-60"
        >
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: '#D8E2DC' }}
          >
            <Phone size={18} style={{ color: '#1B4332' }} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#D8E2DC' }}>
            Call
          </span>
        </a>

        {/* Divider */}
        <div className="w-px my-3" style={{ background: 'rgba(216,226,220,0.2)' }} />

        {/* WhatsApp */}
        <a
          href="https://wa.me/919380736394"
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 active:opacity-60"
        >
          <MessageCircle size={20} style={{ color: '#D8E2DC' }} />
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#D8E2DC' }}>
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  )
}
