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

// Clinic operating hours (IST). Day 0 = Sunday. Each entry is [open, close] as 'HH:MM'.
export const HOURS = {
  0: [['10:30', '13:00'], ['17:00', '20:00']],
  1: [['09:30', '13:00'], ['17:00', '21:00']],
  2: [['09:30', '13:00'], ['17:00', '21:00']],
  3: [['09:30', '13:00'], ['17:00', '21:00']],
  4: [['09:30', '13:00'], ['17:00', '21:00']],
  5: [['09:30', '13:00'], ['17:00', '21:00']],
  6: [['09:30', '13:00'], ['17:00', '21:00']],
};

export const DR_SKANDA = {
  name: 'Dr. Sree Skanda',
  degrees: 'BAMS (Integrated)',
  phone: '9448553738',
  phoneDisplay: '+91 94485 53738',
  hours: '9:00 AM – 9:00 PM',
  days: 'Monday to Saturday',
  whatsapp: `https://wa.me/919448553738?text=${encodeURIComponent('Hari Om Dr. Skanda, I would like to book an online Ayurveda consultation.')}`,
};

export const NAV = [
  { id: 'panchakarma', label: 'Panchakarma' },
  { id: 'swarna', label: 'Swarna Prashana' },
  { id: 'elements', label: 'Five Elements' },
  { id: 'geriatric', label: 'Geriatric Care' },
  { id: 'yoga', label: 'Yoga & Diet' },
  { id: 'contact', label: 'Contact' },
];

export const DISCLAIMER = 'Ayurvedic care is individualised; consult the physician.';
