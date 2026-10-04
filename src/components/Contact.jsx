import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import { CLINIC, DR_SKANDA, DISCLAIMER, WHATSAPP_URL } from '../data/site';
import { Label, PhoneIcon, WhatsAppIcon } from './ornaments';

export default function Contact() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <>
      <section id="contact" ref={ref} className="contact" aria-labelledby="contact-title">
        <div className="contact__lead" data-reveal>
          <Label>Contact us</Label>
          <h2 id="contact-title">Visit <em>Adi Daiva Ayurveda Clinic</em> today.</h2>
          <p>Your first Prakriti assessment and Nadi Pareeksha are free. Bring any reports and the medicines you take.</p>
          <a className="btn btn--gold btn--lg" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> Book Free Nadi Pareeksha
          </a>
        </div>
        <div className="contact__card" data-reveal>
          <address>
            <strong>{CLINIC.name}</strong>
            {CLINIC.address.map((l) => <span key={l}>{l}</span>)}
          </address>
          <p className="contact__hours">Clinic hours: [PLACEHOLDER]</p>
          <a className="text-link" href={`tel:+91${CLINIC.phone}`}><PhoneIcon /> {CLINIC.phoneDisplay}</a>
          <a className="text-link" href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__brand">
          <img src="/img/logo.png" alt="" width="72" height="72" loading="lazy" />
          <div>
            <strong>Adi Daiva Ayurveda Clinic</strong>
            <em>“Awaken the Divine source within!”</em>
          </div>
        </div>
        <div className="footer__cols">
          <p><strong>Dr. Rohit S. Patil</strong>B.A.M.S., PGDYS · Consultant Physician &amp; Clinical Yoga Specialist</p>
          <p><strong>{DR_SKANDA.name}</strong>{DR_SKANDA.degrees}</p>
          <p><strong>Address</strong>{CLINIC.address.join(', ')}</p>
        </div>
        <p className="footer__fine">
          {DISCLAIMER} This website is for information and does not replace a consultation. © {new Date().getFullYear()} Adi Daiva Ayurveda Clinic, Mysuru.
        </p>
      </footer>
    </>
  );
}
