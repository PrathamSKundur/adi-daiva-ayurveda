import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShaderImage from '../gl/ShaderImage';
import { DESK_FRAG } from '../gl/shaders';
import { srcset, placeholder, dims } from '../lib/Picture';
import { finePointer, reducedMotion } from '../lib/env';
import { whatsappWith } from '../data/site';
import Emblem from './Emblem';
import { WhatsAppIcon } from './ornaments';

const CREAM = [253 / 255, 251 / 255, 247 / 255];

/**
 * Phase 1 + 3.1 · OPD & Diagnosis hero.
 * Layout follows the clinic flyer: the desk photograph washed into parchment,
 * the emblem and name centred, the philosophy as the headline.
 * The desk is a 2.5D depth scene (mouse on desktop, scroll on touch) and a
 * frosted-glass card offers the free Prakriti assessment and Nadi Pareeksha.
 */
export default function Hero() {
  const ref = useRef(null);
  const scrollMouse = useRef(null);
  const d = dims('clinic-desk');

  useEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('.hero__desk', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
      if (!finePointer) {
        // no cursor on phones: scrolling moves the depth layers instead
        scrollMouse.current = { x: 0.5, y: 0.5 };
        ScrollTrigger.create({
          trigger: ref.current, start: 'top top', end: 'bottom top',
          onUpdate: ({ progress: p }) => { scrollMouse.current = { x: 0.5 + p * 0.3, y: 0.5 - p * 0.8 }; },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__desk" style={{ backgroundImage: `url(${placeholder('clinic-desk')})` }}>
        <ShaderImage
          texture={typeof window !== 'undefined' && window.innerWidth < 768 ? '/img/clinic-desk-900.webp' : '/img/clinic-desk-1200.webp'}
          fragment={DESK_FRAG}
          focus={[0.5, 0.48]}
          uniforms={{ uCream: CREAM }}
          pointerTarget={ref}
          mouseRef={finePointer ? undefined : scrollMouse}
          mouseEase={0.05}
        >
          <img
            className="hero__desk-img"
            src="/img/clinic-desk-1200.webp"
            srcSet={srcset('clinic-desk')}
            sizes="100vw"
            width={d.w}
            height={d.h}
            alt="The consulting desk at Adi Daiva Ayurveda Clinic, with certificates and shrine above"
            fetchpriority="high"
            decoding="async"
            crossOrigin="anonymous"
          />
        </ShaderImage>
      </div>
      <div className="hero__fade" aria-hidden="true" />

      <div className="hero__content">
        <Emblem className="hero__logo" />
        <p className="hero__name">
          <span>Adi Daiva</span>
          <span>Ayurveda Clinic</span>
        </p>
        <p className="hero__kn" lang="kn">ಆದಿ ದೈವ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸಾಲಯ</p>
        <p className="hero__values">Authentic Ayurveda · Holistic Healing · Compassionate Care</p>
        <h1 id="hero-title" className="hero__title">
          Awaken the Divine Source Within:
          <span> Authentic Ayurvedic Healing in Mysuru.</span>
        </h1>

        {/* the reciprocity offer, on frosted glass */}
        <aside className="glass" aria-label="Free diagnostic services">
          <div className="glass__offers">
            <div>
              <span className="glass__free">Free</span>
              <strong>Prakriti Assessment</strong>
              <small>Know your body constitution</small>
            </div>
            <div>
              <span className="glass__free">Free</span>
              <strong>Nadi Pareeksha</strong>
              <small>Classical pulse diagnosis</small>
            </div>
          </div>
          <a
            className="btn btn--gold"
            href={whatsappWith('Hari Om, I would like to book my free Prakriti Assessment and Nadi Pareeksha with Dr. Rohit.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Reserve your free assessment
          </a>
        </aside>
      </div>
    </section>
  );
}
