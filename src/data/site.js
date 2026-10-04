export const CLINIC = {
  name: 'Adi Daiva Ayurveda Clinic',
  phone: '9380736394', // [PLACEHOLDER] confirm WhatsApp number with the clinic
  phoneDisplay: '+91 93807 36394',
  address: ['796, 797 / H4, Narayana Bakery Road', 'Rajarajeshwari Nagar, BEML Layout', 'Mysuru, Karnataka 570026'],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Adi Daiva Ayurveda Clinic, Rajarajeshwari Nagar, BEML Layout, Mysuru 570026'),
};

// Phase 6: pre-filled message exactly as specified in the brief.
// wa.me needs the country code, so 91 is prefixed to 9380736394.
export const WHATSAPP_URL =
  'https://wa.me/919380736394?text=' +
  encodeURIComponent('Hari Om, I am reaching out to Awaken the Divine Source Within. I would like to book a consultation with Dr. Rohit.');

export const whatsappWith = (text) => `https://wa.me/91${CLINIC.phone}?text=${encodeURIComponent(text)}`;

// Shown for information only (no contact details), as requested.
export const DR_SKANDA = { name: 'Dr. Sree Skanda', degrees: 'BAMS (Integrated)' };

export const NAV = [
  { id: 'elements', label: 'Five Elements' },
  { id: 'panchakarma', label: 'Panchakarma' },
  { id: 'swarna', label: 'Swarna Prashana' },
  { id: 'geriatric', label: 'Geriatric Care' },
  { id: 'yoga', label: 'Yoga & Diet' },
  { id: 'contact', label: 'Contact' },
];

export const DISCLAIMER = 'Ayurvedic care is individualised; consult the physician.';
