import { useEffect, useRef, useState } from 'react';
import useReveal from '../lib/useReveal';
import { finePointer, lowPower } from '../lib/env';
import { whatsappWith, DISCLAIMER } from '../data/site';
import { Label } from './ornaments';

// pos: on the front surface of the figure (body space)
const SYSTEMS = {
  mind: {
    label: 'Mind', term: 'Manas', pos: [0, 0.8, 0.095],
    concern: 'stress, worry and poor sleep',
    diet: [['On waking', 'Warm water, five soaked almonds'], ['Meals', 'Fresh, simple, home-cooked; at fixed times'], ['Evening', 'A light dinner before 8 pm'], ['Bedtime', 'Warm milk with a pinch of nutmeg'], ['Go easy on', 'Late screens, too much tea or coffee']],
    asana: 'Viparita Karani', how: 'Legs up the wall, five to ten minutes.', breath: 'Bhramari · Yoga Nidra',
  },
  lungs: {
    label: 'Lungs', term: 'Prana', pos: [0.07, 0.5, 0.09],
    concern: 'allergies, sinus trouble and frequent colds',
    diet: [['On waking', 'Warm water with tulsi and ginger'], ['Meals', 'Moong soup, millet khichdi, warming spices'], ['Evening', 'Turmeric milk, an early dinner'], ['Go easy on', 'Cold drinks; curd and bananas at night'], ['Habit', 'Steam inhalation with ajwain']],
    asana: 'Bhujangasana', how: 'Cobra pose, slowly, to open the chest.', breath: 'Anulom Vilom · Bhramari',
  },
  gut: {
    label: 'Gut', term: 'Agni', pos: [0, 0.28, 0.085],
    concern: 'acidity, bloating and sluggish digestion',
    diet: [['On waking', 'Warm water boiled with cumin, coriander and fennel'], ['Midday', 'Your main meal, when Agni is strongest'], ['After lunch', 'Thin buttermilk with roasted cumin'], ['Evening', 'A light, warm dinner by 7:30 pm'], ['Go easy on', 'Raw salads at night, iced drinks']],
    asana: 'Vajrasana', how: 'Sit on your heels for five minutes after each meal.', breath: 'Agnisara · Pavanamuktasana',
  },
  joints: {
    label: 'Joints', term: 'Sandhi', pos: [0.085, -0.4, 0.05],
    concern: 'knee and back pain, morning stiffness',
    diet: [['On waking', 'Warm water and a gentle fifteen-minute walk'], ['Meals', 'Warm, cooked food with a spoon of ghee'], ['Add', 'Sesame, dry ginger, fenugreek, garlic'], ['Habit', 'Warm sesame-oil massage before the bath'], ['Go easy on', 'Cold, dry and stale food; long fasts']],
    asana: 'Setu Bandhasana', how: 'Bridge pose, supported, within comfort.', breath: 'Joint-freeing series · Nadi Shodhana',
  },
};
const KEYS = Object.keys(SYSTEMS);

function Plan({ k }) {
  if (!k) {
    return (
      <div className="plan__intro">
        <p className="plan__quote">“When diet is wrong, medicine is of no use. When diet is right, medicine is of no need.”</p>
        <p className="plan__cite">An old Ayurvedic proverb</p>
        <p>Click a glowing point on the body, or choose below.</p>
      </div>
    );
  }
  const s = SYSTEMS[k];
  return (
    <>
      <p className="label">{s.label} · {s.term}</p>
      <h3>For {s.concern}</h3>
      <table className="plan__table">
        <caption>Sample diet chart</caption>
        <tbody>
          {s.diet.map(([when, what]) => <tr key={when}><th scope="row">{when}</th><td>{what}</td></tr>)}
        </tbody>
      </table>
      <div className="plan__asana">
        <p className="label">Clinical yoga asana</p>
        <p className="plan__pose">{s.asana}</p>
        <p>{s.how}</p>
        <p className="plan__breath">{s.breath}</p>
      </div>
      <p className="fineprint">A sample only. {DISCLAIMER}</p>
      <a className="text-link" href={whatsappWith(`Hari Om, I would like a personal diet and yoga plan for ${s.concern}.`)} target="_blank" rel="noopener noreferrer">
        Get your personalised plan →
      </a>
    </>
  );
}

export default function YogaDiet() {
  const ref = useRef(null);
  const canvas = useRef(null);
  const labels = useRef({});
  const scene = useRef(null);
  const drag = useRef(null);
  // two faces of one card: new content goes on the hidden face, then the card turns over
  const [card, setCard] = useState({ face: 0, faces: [null, null] });
  const active = card.faces[card.face];
  useReveal(ref);

  const pick = (k) => {
    setCard((c) => {
      if (c.faces[c.face] === k) return c;
      const faces = [...c.faces];
      faces[1 - c.face] = k;
      return { face: 1 - c.face, faces };
    });
  };

  useEffect(() => { scene.current?.setActive(active); }, [active]);

  useEffect(() => {
    if (lowPower) return undefined;
    let cancelled = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || scene.current || cancelled) return;
      io.disconnect();
      import('../gl/bodyScene.js').then(({ createBodyScene }) => {
        if (cancelled) return;
        scene.current = createBodyScene(canvas.current, {
          resolution: finePointer ? 120 : 96,
          hotspots: KEYS.map((key) => ({ key, pos: SYSTEMS[key].pos })),
          onFrame: (pts) => {
            for (const p of pts) {
              const el = labels.current[p.key];
              if (!el) continue;
              el.style.transform = `translate(${p.x}px, ${p.y}px)`;
              el.classList.toggle('is-behind', !p.facing);
            }
          },
        });
      });
    }, { rootMargin: '400px 0px' });
    io.observe(canvas.current);
    return () => { cancelled = true; io.disconnect(); scene.current?.dispose(); scene.current = null; };
  }, []);

  // drag horizontally to turn the model; vertical swipes still scroll the page
  const down = (e) => { drag.current = { x: e.clientX }; if (scene.current) scene.current.drag.dragging = true; };
  const move = (e) => {
    if (!drag.current || !scene.current) return;
    scene.current.drag.v = (e.clientX - drag.current.x) * 0.006;
    drag.current.x = e.clientX;
  };
  const up = () => { drag.current = null; if (scene.current) scene.current.drag.dragging = false; };

  return (
    <section id="yoga" ref={ref} className="yoga" aria-labelledby="yoga-title">
      <div className="section-head" data-reveal>
        <Label>Clinical yoga &amp; diet</Label>
        <h2 id="yoga-title">A plan written for <em>your</em> body.</h2>
        <p>Click a part of the body to see a sample of the personalised diet chart and clinical yoga asana Dr. Rohit prescribes.</p>
      </div>

      <div className="yoga__grid">
        <div className="yoga__stage" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
          <canvas ref={canvas} className="yoga__canvas" aria-hidden="true" />
          {KEYS.map((k) => (
            <button
              key={k}
              ref={(el) => { labels.current[k] = el; }}
              className={`body-point ${active === k ? 'is-on' : ''}`}
              onClick={() => pick(k)}
              aria-label={SYSTEMS[k].label}
              aria-pressed={active === k}
            >
              <span>{SYSTEMS[k].label}</span>
            </button>
          ))}
          <p className="yoga__hint" aria-hidden="true">Drag to turn</p>
        </div>

        <div className="yoga__side">
          <div className="yoga__picker" role="group" aria-label="Body systems">
            {KEYS.map((k) => (
              <button key={k} aria-pressed={active === k} onClick={() => pick(k)}>{SYSTEMS[k].label}</button>
            ))}
          </div>
          <div className="flip">
            <div className={`flip__inner ${card.face ? 'is-flipped' : ''}`}>
              <article className="flip__face" aria-hidden={card.face !== 0}><Plan k={card.faces[0]} /></article>
              <article className="flip__face flip__face--back" aria-hidden={card.face !== 1}><Plan k={card.faces[1]} /></article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
