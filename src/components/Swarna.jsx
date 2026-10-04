import { useEffect, useRef } from 'react';
import Picture from '../lib/Picture';
import useReveal from '../lib/useReveal';
import { lowPower } from '../lib/env';
import { Label } from './ornaments';
import PushyaPlanner from './PushyaPlanner';

// Qualities named in the Kashyapa Samhita for Suvarna Prashana
const BENEFITS = [
  ['Medhya', 'मेध्य', 'memory & learning'],
  ['Bala', 'बल', 'strength & immunity'],
  ['Agni', 'अग्नि', 'digestion & appetite'],
  ['Varnya', 'वर्ण्य', 'healthy complexion'],
  ['Ayushya', 'आयुष्य', 'long, healthy life'],
];

/** Phase 3.3 · Swarna Bindu Prashana: one photograph, the essentials, and a Pushya Nakshatra planner. */
export default function Swarna() {
  const ref = useRef(null);
  const photo = useRef(null);
  const dustCanvas = useRef(null);
  useReveal(ref);

  // gold dust (#D4AF37) drifting down behind the photograph
  useEffect(() => {
    if (lowPower) return undefined;
    let dust;
    let cancelled = false;
    let raf;
    import('../gl/goldDust.js').then(({ createGoldDust }) => {
      if (cancelled) return;
      dust = createGoldDust(dustCanvas.current, 260);
      const follow = () => {
        raf = requestAnimationFrame(follow);
        const s = dustCanvas.current.getBoundingClientRect();
        const r = photo.current.getBoundingClientRect();
        dust.setEmitter({ x: r.left - s.left + r.width / 2, y: r.top - s.top, w: r.width });
      };
      follow();
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); dust?.dispose(); };
  }, []);

  return (
    <section id="swarna" ref={ref} className="swarna" aria-labelledby="swarna-title">
      <div className="section-head" data-reveal>
        <Label>Swarna Bindu Prashana · for children</Label>
        <h2 id="swarna-title">A drop of <em className="gilt">gold</em>, every Pushya Nakshatra.</h2>
      </div>

      <div className="swarna__grid">
        <div className="swarna__story">
          <div className="swarna__photo-wrap" data-reveal>
            <canvas ref={dustCanvas} className="swarna__dust" aria-hidden="true" />
            <figure className="swarna__photo" ref={photo}>
              <Picture name="swarna-prashana" alt="Dr. Rohit S. Patil giving Swarna Bindu Prashana drops to a young child while her mother watches" sizes="(min-width: 1024px) 34vw, 86vw" position="55% 55%" />
              <figcaption>A few drops, from Dr. Rohit’s hand</figcaption>
            </figure>
          </div>

          <div className="swarna__about" data-reveal>
            <p>
              A classical Ayurvedic immunisation ritual for children, given on the auspicious Pushya Nakshatra each month.
              Traditionally given to support immunity, intellect and physical strength.
            </p>
            <dl className="swarna__facts">
              <div><dt>What</dt><dd>Swarna Bhasma (purified gold), Brahmi ghee and honey</dd></div>
              <div><dt>Who</dt><dd>Children from birth to 16 years</dd></div>
              <div><dt>How</dt><dd>A few drops by mouth. Painless, no needles</dd></div>
              <div><dt>How often</dt><dd>Monthly, on every Pushya Nakshatra</dd></div>
            </dl>
            <ul className="swarna__benefits" aria-label="Traditional benefits">
              {BENEFITS.map(([en, sa, gloss]) => (
                <li key={en}><span lang="sa">{sa}</span><b>{en}</b><small>{gloss}</small></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="swarna__plan" data-reveal>
          <PushyaPlanner />
        </div>
      </div>
    </section>
  );
}
