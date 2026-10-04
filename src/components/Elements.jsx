import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { lowPower, finePointer } from '../lib/env';
import { Label } from './ornaments';

// order of creation in Samkhya: from the subtlest to the densest
const ELEMENTS = [
  {
    key: 'akasha', deva: 'आकाश', name: 'Akasha', en: 'Space',
    body: 'The emptiness that holds everything: the channels of the body, the hollow of the ear, the stillness of the mind.',
    dosha: 'With Vayu, forms Vata',
    felt: 'Felt here as deep parallax and generous space: room to breathe and think clearly.',
  },
  {
    key: 'vayu', deva: 'वायु', name: 'Vayu', en: 'Air',
    body: 'All movement: breath, circulation, the impulse that travels along every nerve.',
    dosha: 'With Akasha, forms Vata',
    felt: 'Felt here as breath: the booking button rises and falls once every five seconds, like Pranayama.',
  },
  {
    key: 'agni', deva: 'अग्नि', name: 'Agni', en: 'Fire',
    body: 'Transformation: digestion, metabolism, the light in the eyes. When Agni is strong, the body is strong.',
    dosha: 'With Jala, forms Pitta',
    felt: 'Felt here in the sacred Homa, its heat shimmering on your screen.',
  },
  {
    key: 'jala', deva: 'जल', name: 'Jala', en: 'Water',
    body: 'Cohesion: plasma, lymph, the moisture that keeps joints supple and tissues soft.',
    dosha: 'With Prithvi, forms Kapha',
    felt: 'Felt here as warm medicated oil: images ripple under your touch and buttons melt rather than snap.',
  },
  {
    key: 'prithvi', deva: 'पृथ्वी', name: 'Prithvi', en: 'Earth',
    body: 'Structure: bone, muscle, the ground the body stands on. Stability, patience, strength.',
    dosha: 'With Jala, forms Kapha',
    felt: 'Felt here in the scroll itself: steady, weighted, unhurried.',
  },
];

/**
 * Phase 2 · the Pancha Mahabhuta, felt as you scroll.
 * The section is pinned; scrolling morphs one particle field through the five
 * tattva yantras while the text for each element takes its turn.
 */
export default function Elements() {
  const section = useRef(null);
  const canvas = useRef(null);
  const [active, setActive] = useState(0);
  // the build renders the animated version; weak devices switch to the static list after mounting
  const [static_, setStatic] = useState(false);

  useEffect(() => {
    if (lowPower) { setStatic(true); return undefined; }
    let scene;
    let cancelled = false;
    import('../gl/elementsScene.js').then(({ createElementsScene }) => {
      if (cancelled) return;
      scene = createElementsScene(canvas.current, { count: finePointer ? 18000 : 8000 });
    });

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: ({ progress }) => {
            // hold on each form, travel between them
            const raw = progress * 4;
            const i = Math.min(4, Math.floor(raw));
            const f = raw - i;
            const eased = i + gsap.parseEase('power2.inOut')(gsap.utils.clamp(0, 1, (f - 0.3) / 0.55));
            scene?.setProgress(Math.min(4, eased));
            setActive(Math.min(4, Math.round(eased)));
          },
        },
      });
    }, section);

    return () => { cancelled = true; ctx.revert(); scene?.dispose(); };
  }, []);

  return (
    <section id="elements" ref={section} className={`elements ${static_ ? 'elements--static' : ''}`} data-night aria-labelledby="el-title">
      {!static_ && <canvas ref={canvas} className="elements__canvas" aria-hidden="true" />}

      <div className="elements__head">
        <Label className="elements__label">Pancha Mahabhuta · the five elements</Label>
        <h2 id="el-title" className="elements__title">Everything in nature, and in you, is made of five.</h2>
      </div>

      <ol className="elements__list">
        {ELEMENTS.map((el, i) => (
          <li key={el.key} className={`el ${active === i ? 'is-active' : ''}`} aria-current={active === i ? 'step' : undefined}>
            <p className="el__deva" lang="sa">{el.deva}</p>
            <h3 className="el__name">{el.name} <span>{el.en}</span></h3>
            <p className="el__body">{el.body}</p>
            <p className="el__dosha">{el.dosha}</p>
            <p className="el__felt">{el.felt}</p>
          </li>
        ))}
      </ol>

      <nav className="elements__rail" aria-hidden="true">
        {ELEMENTS.map((el, i) => (
          <span key={el.key} className={active === i ? 'is-active' : ''}>
            <i />{el.name}
          </span>
        ))}
      </nav>
    </section>
  );
}
