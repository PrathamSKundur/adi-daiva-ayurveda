import { useEffect, useRef, useState } from 'react';
import useReveal from '../lib/useReveal';
import { openStatus, HOURS_ROWS } from '../lib/hours';
import { CLINIC, DR_SKANDA, DISCLAIMER, WHATSAPP_URL } from '../data/site';
import Emblem from './Emblem';
import { Label, PhoneIcon, WhatsAppIcon } from './ornaments';

export default function Contact() {
  const ref = useRef(null);
  const [status, setStatus] = useState(null); // live, in IST; filled in after mount
  useReveal(ref);

  useEffect(() => {
    const tick = () => setStatus(openStatus());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

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

          <div className="hours">
            <p className="hours__title">
              Operating hours
              {status && <span className={`hours__status ${status.open ? 'is-open' : ''}`}><i />{status.text}</span>}
            </p>
            <dl>
              {HOURS_ROWS.map((r) => (
                <div key={r.days}>
                  <dt>{r.days}</dt>
                  <dd>{r.slots.map((s) => <span key={s}>{s}</span>)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <a className="text-link" href={`tel:+91${CLINIC.phone}`}><PhoneIcon /> {CLINIC.phoneDisplay}</a>
          <a className="text-link" href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
        </div>

        {/* online consultation, at the end as requested */}
        <aside className="online" data-reveal aria-labelledby="online-title">
          <img className="online__photo" src="/img/dr-skanda-240.webp" width="96" height="120" alt={DR_SKANDA.name} loading="lazy" />
          <div className="online__text">
            <Label>Online consultation</Label>
            <h3 id="online-title">{DR_SKANDA.name}</h3>
            <p className="online__deg">{DR_SKANDA.degrees}</p>
            <p className="online__hours"><strong>{DR_SKANDA.days}</strong> · {DR_SKANDA.hours}</p>
            <p className="online__phone">{DR_SKANDA.phoneDisplay}</p>
          </div>
        </aside>
      </section>

      <footer className="footer">
        <div className="footer__brand">
          <Emblem className="footer__emblem" />
          <div>
            <strong>Adi Daiva Ayurveda Clinic</strong>
            <span lang="kn" className="footer__kn">ಆದಿ ದೈವ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸಾಲಯ</span>
            <em>“Awaken the Divine source within!”</em>
          </div>
        </div>
        <div className="footer__cols">
          <p><strong>Dr. Rohit S. Patil</strong>B.A.M.S., PGDYS · Consultant Physician &amp; Clinical Yoga Specialist</p>
          <p><strong>Operating hours</strong>Mon–Sat 9:30 AM – 1:00 PM, 5:00 – 9:00 PM<br />Sun 10:30 AM – 1:00 PM, 5:00 – 8:00 PM</p>
          <p><strong>Address</strong>{CLINIC.address.join(', ')}</p>
          <p>
            <strong>Online consultation</strong>
            {DR_SKANDA.name}, {DR_SKANDA.degrees}
            <br />
            {DR_SKANDA.days}, {DR_SKANDA.hours} · {DR_SKANDA.phoneDisplay}
          </p>
        </div>
        <p className="footer__fine">
          {DISCLAIMER} This website is for information and does not replace a consultation. © {new Date().getFullYear()} Adi Daiva Ayurveda Clinic, Mysuru.
        </p>
      </footer>
    </>
  );
}
