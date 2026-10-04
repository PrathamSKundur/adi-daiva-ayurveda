import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ShaderImage from '../gl/ShaderImage';
import { HOMA_FRAG } from '../gl/shaders';
import { srcset, dims } from '../lib/Picture';
import { reducedMotion } from '../lib/env';
import Particles from './Particles';
import { Label } from './ornaments';

// #07130E in display space, so the burnt photo edges meet the page with no seam
const NIGHT = [7 / 255, 19 / 255, 14 / 255];
const TAGLINE = ['Awaken', 'the', 'Divine', 'source', 'within!'];

/**
 * Phase 4 · the Adi Daiva Homa: Dr. Rohit behind the sacred fire.
 * Heat-shimmer shader over the bricks and lower third, edges burnt to deep green,
 * pinned briefly so the tagline can arrive in stillness.
 */
export default function Homa() {
  const root = useRef(null);
  const homa = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      // The Homa: hold the frame, let the fire speak first, then the words
      gsap.timeline({
        scrollTrigger: { trigger: homa.current, start: 'top top', end: '+=140%', scrub: true, pin: true, anticipatePin: 1 },
      })
        .to({}, { duration: 0.35 }) // stillness: nothing but fire
        .fromTo('.homa__deva', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.2 })
        .fromTo('.homa__word', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.12, duration: 0.25 }, '>-0.05')
        .fromTo('.homa__gloss', { opacity: 0 }, { opacity: 1, duration: 0.2 }, '>0.05')
        .to({}, { duration: 0.15 });

    }, root);
    return () => ctx.revert();
  }, []);

  const d = dims('homa');
  return (
    <div ref={root} id="homa">
      <section ref={homa} className="homa" data-night aria-labelledby="homa-title">
        <ShaderImage
          texture="/img/homa.jpg"
          fragment={HOMA_FRAG}
          focus={[0.5, 0.42]}
          uniforms={{ uNight: NIGHT }}
          pointerTarget={homa}
          className="homa__fire"
        >
          <img
            className="homa__still"
            src="/img/homa-720.webp"
            srcSet={srcset('homa')}
            sizes="(min-width: 768px) 50vh, 100vw"
            width={d.w}
            height={d.h}
            loading="lazy"
            decoding="async"
            alt="Dr. Rohit S. Patil seated behind the sacred Homa fire"
          />
        </ShaderImage>
        <Particles mode="embers" density={45} className="homa__embers" />

        <div className="homa__words">
          <Label className="homa__chapter">Daiva Vyapashraya Chikitsa</Label>
          <p className="homa__deva" lang="sa">आदि दैव</p>
          <h2 id="homa-title" className="homa__tagline">
            {TAGLINE.map((w, n) => (
              <span key={w}>
                <span className={`homa__word ${w === 'Divine' ? 'homa__word--lit' : ''}`}>{w}</span>
                {n < TAGLINE.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <p className="homa__gloss">
            <em>Daiva Vyapashraya Chikitsa</em>, healing through the divine. Alongside medicine, the classical texts
            prescribe mantra, prayer and the sacred fire, so that the mind heals with the body.
          </p>
        </div>
      </section>

    </div>
  );
}
