import { useRef, useState } from 'react';
import ShaderImage from '../gl/ShaderImage';
import { OIL_FRAG } from '../gl/shaders';
import Picture, { largest } from '../lib/Picture';
import useReveal from '../lib/useReveal';
import { whatsappWith, DISCLAIMER } from '../data/site';
import { Label } from './ornaments';

// oil pools in image uv (y up), radius in image-height units
const SLIDES = [
  {
    key: 'kati', name: 'Kati Basti', deva: 'कटि बस्ति', img: 'kati-basti', focus: [0.55, 0.42],
    oilA: [0.566, 0.347], oilB: [0.566, 0.347], r: 0.065,
    text: 'A ring of black-gram dough is sealed on the lower back and filled with warm medicated oil, held there and re-warmed as it cools. Traditionally used for stiffness and pain of the lower back.',
  },
  {
    key: 'janu', name: 'Janu Basti', deva: 'जानु बस्ति', img: 'janu-basti', focus: [0.5, 0.55],
    oilA: [0.462, 0.336], oilB: [0.554, 0.284], r: 0.065,
    text: 'Warm medicated oil pooled over each knee inside a dough reservoir. Traditionally used for knee pain, stiffness and ease of movement.',
  },
  { key: 'shiro', name: 'Shirodhara', deva: 'शिरोधारा', text: 'A slow, steady stream of warm oil poured across the forehead. Traditionally used for stress, sleeplessness and headaches.' },
  { key: 'abhy', name: 'Abhyanga', deva: 'अभ्यङ्ग', text: 'A full-body massage with warm herbal oil, chosen for your constitution. Nourishes the tissues and calms Vata.' },
  { key: 'nasya', name: 'Nasya', deva: 'नस्य', text: 'Medicated drops through the nose, the classical route for conditions of the head, sinuses and senses.' },
  { key: 'vire', name: 'Virechana', deva: 'विरेचन', text: 'Therapeutic purgation under supervision, one of the five classical cleansings, used for conditions of Pitta.' },
];

const N = SLIDES.length;
const wrap = (d) => ((d % N) + N + Math.floor(N / 2)) % N - Math.floor(N / 2);

export default function Panchakarma() {
  const ref = useRef(null);
  const drag = useRef(null);
  const [i, setI] = useState(0);
  useReveal(ref);
  const go = (d) => setI((v) => (v + d + N) % N);
  const s = SLIDES[i];

  const down = (e) => { drag.current = { x: e.clientX, moved: false }; };
  const move = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 45) { go(dx < 0 ? 1 : -1); drag.current = { x: e.clientX, moved: true }; }
  };
  const up = () => { drag.current = null; };

  return (
    <section id="panchakarma" ref={ref} className="pk" aria-labelledby="pk-title">
      <div className="section-head" data-reveal>
        <Label>Panchakarma therapies</Label>
        <h2 id="pk-title">Warm oil, held <em>patiently</em>.</h2>
        <p>Hover over the oil, or touch it. This is the slow warmth of a Basti, held over the place that hurts.</p>
      </div>

      <div
        className="coverflow"
        role="region"
        aria-roledescription="carousel"
        aria-label="Panchakarma therapies"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      >
        {SLIDES.map((sl, n) => {
          const d = wrap(n - i);
          const front = d === 0;
          return (
            <article
              key={sl.key}
              className={`cf-slide ${sl.img ? 'cf-slide--photo' : 'cf-slide--card'} ${front ? 'is-front' : ''}`}
              style={{
                '--d': d,
                '--ad': Math.abs(d),
                zIndex: 10 - Math.abs(d),
                opacity: Math.abs(d) > 2 ? 0 : 1,
                pointerEvents: Math.abs(d) > 2 ? 'none' : undefined,
              }}
              aria-hidden={!front}
              onClick={() => { if (!front && !drag.current?.moved) setI(n); }}
            >
              {sl.img ? (
                front ? (
                  <ShaderImage
                    texture={largest(sl.img)}
                    fragment={OIL_FRAG}
                    focus={sl.focus}
                    uniforms={{ uOilA: sl.oilA, uOilB: sl.oilB, uOilR: sl.r }}
                    mouseEase={0.14}
                  >
                    <Picture crossOrigin="anonymous" name={sl.img} alt={`${sl.name} being given by Dr. Rohit S. Patil`} sizes="(min-width: 900px) 46vw, 80vw" position={`${sl.focus[0] * 100}% ${(1 - sl.focus[1]) * 100}%`} />
                  </ShaderImage>
                ) : (
                  <Picture name={sl.img} alt="" sizes="40vw" position={`${sl.focus[0] * 100}% ${(1 - sl.focus[1]) * 100}%`} />
                )
              ) : (
                <div className="cf-card">
                  <span className="cf-card__drop" aria-hidden="true" />
                  <p className="cf-card__deva" lang="sa">{sl.deva}</p>
                  <p className="cf-card__name">{sl.name}</p>
                </div>
              )}
              {sl.img && <span className="cf-slide__tag">{sl.name}</span>}
            </article>
          );
        })}
      </div>

      <div className="cf-controls">
        <button onClick={() => go(-1)} aria-label="Previous therapy">←</button>
        <div className="cf-dots" role="tablist" aria-label="Choose a therapy">
          {SLIDES.map((sl, n) => (
            <button key={sl.key} role="tab" aria-selected={n === i} aria-label={sl.name} onClick={() => setI(n)} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next therapy">→</button>
      </div>

      <div key={s.key} className="cf-caption" aria-live="polite">
        <p className="cf-caption__deva" lang="sa">{s.deva}</p>
        <h3>{s.name}</h3>
        <p>{s.text}</p>
        <a className="text-link" href={whatsappWith(`Hari Om, I would like to ask Dr. Rohit about ${s.name}.`)} target="_blank" rel="noopener noreferrer">
          Ask Dr. Rohit about {s.name} →
        </a>
        <p className="fineprint">{DISCLAIMER}</p>
      </div>
    </section>
  );
}
