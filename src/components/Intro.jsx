import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import { srcset } from '../lib/Picture';
import { WHATSAPP_URL, DR_SKANDA } from '../data/site';
import { Label } from './ornaments';

/** Dr. Rohit's introduction, laid out like the lower half of the clinic flyer. */
export default function Intro() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="about" ref={ref} className="intro" aria-labelledby="intro-title">
      <div className="intro__text" data-reveal>
        <Label>Your physician</Label>
        <h2 id="intro-title">Dr. Rohit S. Patil</h2>
        <p className="intro__deg">B.A.M.S., PGDYS · Consultant Physician &amp; Clinical Yoga Specialist</p>
        <p>
          Under the expert guidance of Dr. Rohit S. Patil, ADI DAIVA AYURVEDA brings together classical Ayurvedic
          wisdom and careful, targeted treatment. Deeply rooted in authentic Samhita literature, Dravyaguna
          pharmacology, and precise Bhaishajya Kalpana formulations, Dr. Patil’s approach bridges ancient principles
          with modern clinical rigor.
        </p>
        <p>
          We offer personalized care that looks for the root cause of illness and works to restore your body’s
          natural balance through comprehensive consultation, classical Panchakarma procedures, tailored diet plans,
          and clinical yoga.
        </p>
        <div className="intro__actions">
          <a className="btn btn--gold" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Book Your Consultation</a>
          <a className="btn btn--line" href="#panchakarma">Explore Classical Treatments</a>
        </div>
        <p className="intro__also">
          <img src="/img/dr-skanda-240.webp" width="44" height="55" alt="" loading="lazy" />
          <span>Also with the clinic: <strong>{DR_SKANDA.name}</strong>, {DR_SKANDA.degrees}.</span>
        </p>
      </div>

      <figure className="intro__portrait" data-reveal>
        <img
          src="/img/dr-rohit-portrait-560.webp"
          srcSet={srcset('dr-rohit-portrait')}
          sizes="(min-width: 900px) 340px, 240px"
          width="560"
          height="560"
          alt="Dr. Rohit S. Patil"
          loading="lazy"
        />
      </figure>
    </section>
  );
}
