import { useEffect, useRef, useState } from 'react';
import Picture from '../lib/Picture';
import useReveal from '../lib/useReveal';
import { finePointer, lowPower, reducedMotion } from '../lib/env';
import { whatsappWith } from '../data/site';
import { Label } from './ornaments';

// One clinic photograph exists so far, shown in three crops; more sessions can be added here.
const TILES = [
  { type: 'photo', pos: '50% 55%', caption: 'A few drops, from Dr. Rohit’s hand' },
  { type: 'leaf', word: 'Medhya', deva: 'मेध्य', gloss: 'Nourishes memory and learning' },
  { type: 'photo', pos: '66% 70%', caption: 'Monthly, on Pushya Nakshatra' },
  { type: 'leaf', word: 'Bala', deva: 'बल', gloss: 'Supports strength and natural immunity' },
  { type: 'photo', pos: '40% 48%', caption: 'Gentle, painless, oral drops' },
  { type: 'leaf', word: 'Agni', deva: 'अग्नि', gloss: 'Supports digestion and appetite' },
  { type: 'leaf', word: 'Ayushya', deva: 'आयुष्य', gloss: 'A foundation for a long, healthy life' },
];
const LOOP = [...TILES, ...TILES]; // rendered twice for a seamless loop

export default function Swarna() {
  const ref = useRef(null);
  const rail = useRef(null);
  const stage = useRef(null);
  const dustCanvas = useRef(null);
  const dust = useRef(null);
  const paused = useRef(false);
  const [active, setActive] = useState(null);
  useReveal(ref);

  // the slow, endless drift (users can also swipe; it resumes after)
  useEffect(() => {
    if (reducedMotion) return undefined;
    const el = rail.current;
    let raf, resumeAt = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (paused.current || now < resumeAt) return;
      el.scrollLeft += 0.45;
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    };
    raf = requestAnimationFrame(tick);
    const hold = () => { resumeAt = performance.now() + 2500; };
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('wheel', hold, { passive: true });
    return () => { cancelAnimationFrame(raf); el.removeEventListener('touchstart', hold); el.removeEventListener('wheel', hold); };
  }, []);

  // 3D gold dust behind the focused image
  useEffect(() => {
    if (lowPower) return undefined;
    let cancelled = false;
    import('../gl/goldDust.js').then(({ createGoldDust }) => {
      if (!cancelled) dust.current = createGoldDust(dustCanvas.current);
    });
    return () => { cancelled = true; dust.current?.dispose(); };
  }, []);

  // keep the emitter glued to the focused tile while the marquee moves
  useEffect(() => {
    let raf;
    const follow = () => {
      raf = requestAnimationFrame(follow);
      if (active === null || !dust.current) { dust.current?.setEmitter(null); return; }
      const tile = rail.current.children[0]?.children[active];
      if (!tile) return;
      const s = stage.current.getBoundingClientRect();
      const r = tile.getBoundingClientRect();
      dust.current.setEmitter({ x: r.left - s.left + r.width / 2, y: r.top - s.top, w: r.width });
    };
    follow();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const focus = (n) => { setActive(n); paused.current = n !== null; };

  return (
    <section id="swarna" ref={ref} className="swarna" aria-labelledby="swarna-title">
      <div className="section-head" data-reveal>
        <Label>Swarna Bindu Prashana · children’s care</Label>
        <h2 id="swarna-title">A drop of <em className="gilt">gold</em> for a lifetime of health.</h2>
        <p>
          Conducted on the auspicious Pushya Nakshatra, this classical Ayurvedic immunisation ritual uses Swarna Bhasma
          (purified gold), Brahmi ghee and honey. Traditionally given to support immunity, intellect and physical strength
          in children aged 0–16 years.
        </p>
      </div>

      <div className={`marquee ${active !== null ? 'has-focus' : ''}`} ref={stage}>
        <canvas ref={dustCanvas} className="marquee__dust" aria-hidden="true" />
        <div className="marquee__rail" ref={rail} tabIndex={0} aria-label="Swarna Prashana moments">
          <div className="marquee__track">
            {LOOP.map((t, n) => (
              <figure
                key={n}
                className={`m-tile m-tile--${t.type} ${active === n ? 'is-active' : ''}`}
                onPointerEnter={finePointer ? () => focus(n) : undefined}
                onPointerLeave={finePointer ? () => focus(null) : undefined}
                onClick={!finePointer ? () => focus(active === n ? null : n) : undefined}
                aria-hidden={n >= TILES.length}
              >
                {t.type === 'photo' ? (
                  <>
                    <Picture name="swarna-prashana" alt={n < TILES.length ? 'Dr. Rohit S. Patil giving Swarna Bindu Prashana drops to a young child' : ''} sizes="300px" position={t.pos} />
                    <figcaption>{t.caption}</figcaption>
                  </>
                ) : (
                  <div className="m-tile__leaf">
                    <span className="m-tile__drop" aria-hidden="true" />
                    <p className="m-tile__deva" lang="sa">{t.deva}</p>
                    <p className="m-tile__word">{t.word}</p>
                    <p className="m-tile__gloss">{t.gloss}</p>
                  </div>
                )}
              </figure>
            ))}
          </div>
        </div>
      </div>

      <dl className="facts" data-reveal>
        <div><dt>For</dt><dd>Children from birth to 16 years</dd></div>
        <div><dt>When</dt><dd>Every month on Pushya Nakshatra · next date [PLACEHOLDER]</dd></div>
        <div><dt>How</dt><dd>A few drops by mouth. No needles.</dd></div>
      </dl>
      <p className="center" data-reveal>
        <a className="text-link" href={whatsappWith('Hari Om, please share the next Pushya Nakshatra date for Swarna Bindu Prashana.')} target="_blank" rel="noopener noreferrer">
          Ask for this month’s Pushya date →
        </a>
      </p>
    </section>
  );
}
