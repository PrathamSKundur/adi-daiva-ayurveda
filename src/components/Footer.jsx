import React from 'react'
import { Clock, MapPin, Phone, MessageCircle } from 'lucide-react'

export default function Footer(){
  return (
    <footer
      className="w-full mt-8"
      style={{ background: '#1B4332', color: '#FFFFFF' }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-12 py-8 lg:py-12">
        {/* Clinic name */}
        <h2 className="heading text-2xl font-bold mb-1">Adi Daiva Ayurveda Clinic</h2>
        <p className="text-xs uppercase tracking-widest opacity-60 mb-6">
          Authentic Ayurveda · Mysuru
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Info column */}
          <div className="space-y-4">
            {/* Timings */}
            <div className="flex items-start gap-3">
              <Clock size={18} style={{ color: '#D8E2DC' }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Clinic Hours</p>
                <p className="text-xs opacity-80 mt-0.5">Morning: 9:30 am – 1:00 pm</p>
                <p className="text-xs opacity-80">Evening: 5:00 pm – 8:30 pm</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin size={18} style={{ color: '#D8E2DC' }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-xs opacity-80 mt-0.5">
                  796/797 Narayana Bakery Road,<br />
                  Rajarajeshwari Nagar, BEML Layout,<br />
                  Mysuru, Karnataka
                </p>
              </div>
            </div>

            {/* Contact quick links */}
            <div className="flex gap-3 mt-2">
              <a
                href="tel:9380736394"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(216,226,220,0.12)', border: '1px solid rgba(216,226,220,0.25)' }}
              >
                <Phone size={13} /> 9380736394
              </a>
              <a
                href="https://wa.me/919380736394"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(216,226,220,0.12)', border: '1px solid rgba(216,226,220,0.25)' }}
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden h-48">
            <iframe
              title="Clinic Location"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.3805356125!2d76.59913347620407!3d12.290140487966099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7b3375c6b465%3A0xee5b69bdff4bcf56!2sADI%20DAIVA%20AYURVEDA%20CLINIC!5e0!3m2!1sen!2sin!4v1773148061247!5m2!1sen!2sin"
            />
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-8 opacity-40">
          © {new Date().getFullYear()} Adi Daiva Ayurveda Clinic · All rights reserved
        </p>
      </div>
    </footer>
  )
}
