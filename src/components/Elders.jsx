import { useEffect, useRef, useState } from 'react';
import Picture, { largest } from '../lib/Picture';
import useReveal from '../lib/useReveal';
import { finePointer } from '../lib/env';
import { whatsappWith } from '../data/site';
import { Label } from './ornaments';

const ZOOM = 2.2;

// positions are fractions of the photo (x from left, y from top)
const NODES = [
  {
    id: 'pool', x: 0.462, y: 0.664, title: 'The oil reservoir',
    text: 'A wall of black-gram dough holds warm, medicated oil over the knee for thirty to forty-five minutes.',
    note: 'Masha (black gram) · sesame-oil base',
  },
  {
    id: 'oil', x: 0.554, y: 0.716, title: 'What is in the oil',
    text: 'Oils such as Mahanarayana or Ksheerabala taila are traditionally used to calm Vata and nourish the joint.',
    note: 'Bala · Ashwagandha · Shatavari',
  },
  {
    id: 'warmth', x: 0.392, y: 0.528, title: 'Warmth, kept steady',
    text: 'As the oil cools it is drawn off, warmed and returned, so the heat never spikes and never fades.',
    note: 'Snehana with gentle Swedana',
  },
  {
    id: 'rest', x: 0.538, y: 0.87, title: 'Rest, supported',
    text: 'The knee rests softly bent on a rolled cloth. Elders are never hurried; comfort comes first.',
    note: 'Comfort before protocol',
  },
];

export default function Elders() {
  const ref = useRef(null);
  const frame = useRef(null);
  const dragging = useRef(false);
  const [lens, setLens] = useState({ x: 0.3, y: 0.32 });
  const [moved, setMoved] = useState(false);
  const [size, setSize] = useState({ w: 1, h: 1, l: 150 });
  const [near, setNear] = useState(false); // load the magnified photo only when the section is close
  useReveal(ref);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setSize({ w, h: e.contentRect.height, l: Math.round(Math.max(120, Math.min(170, w * 0.36))) });
    });
    ro.observe(frame.current);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(frame.current);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const found = NODES.find((n) => Math.hypot((n.x - lens.x) * 0.75, n.y - lens.y) < 0.065);

  const place = (e) => {
    const r = frame.current.getBoundingClientRect();
    setLens({
      x: Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width)),
      y: Math.min(0.97, Math.max(0.03, (e.clientY - r.top) / r.height)),
    });
    setMoved(true);
  };

  // lens: drag it with a finger (it captures the pointer, so the page doesn't scroll)
  const lensDown = (e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); };
  const lensMove = (e) => { if (dragging.current) place(e); };
  const lensUp = () => { dragging.current = false; };

  const { w, h, l } = size;
  return (
    <section id="geriatric" ref={ref} className="elders" aria-labelledby="elders-title">
      <div className="elders__text">
        <div data-reveal>
          <Label>Geriatric care · Rasayana</Label>
          <h2 id="elders-title">For the hands <em>that raised us</em>.</h2>
          <p className="elders__intro">
            Stiff knees, broken sleep, a slower appetite. Ayurveda’s Rasayana tradition offers our parents gentle,
            unhurried care, and it can sit alongside the medicines they already take. Tell us everything they take.
          </p>
        </div>

        <div className="lens-panel" aria-live="polite" data-reveal>
          <p className="lens-panel__hint">
            Drag the gold lens over the knees, or choose a point:
          </p>
          <div className="lens-panel__chips">
            {NODES.map((n) => (
              <button key={n.id} aria-pressed={found?.id === n.id} onClick={() => { setLens({ x: n.x, y: n.y }); setMoved(true); }}>
                {n.title}
              </button>
            ))}
          </div>
        </div>

        <a className="text-link" data-reveal href={whatsappWith('Hari Om, I would like to book a consultation with Dr. Rohit for my parent.')} target="_blank" rel="noopener noreferrer">
          Book a consultation for your parent →
        </a>
      </div>

      <div className="elders__figure" data-reveal>
        <div
          ref={frame}
          className={`lens-frame ${moved ? 'is-moved' : ''}`}
          onPointerMove={(e) => { if (e.pointerType === 'mouse') place(e); }}
          onClick={(e) => { if (!finePointer) place(e); }}
        >
          <Picture name="janu-basti" alt="Dr. Rohit S. Patil giving Janu Basti, warm oil therapy, to an older woman's knees" sizes="(min-width: 900px) 40vw, 100vw" />
          {NODES.map((n) => (
            <span key={n.id} className={`hotspot ${found?.id === n.id ? 'is-on' : ''}`} style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }} aria-hidden="true" />
          ))}
          <div
            className={`lens ${found ? 'lens--found' : ''}`}
            role="presentation"
            onPointerDown={lensDown}
            onPointerMove={lensMove}
            onPointerUp={lensUp}
            onPointerCancel={lensUp}
            style={{
              left: `${lens.x * 100}%`,
              top: `${lens.y * 100}%`,
              width: l,
              height: l,
              backgroundImage: near ? `url(${largest('janu-basti')})` : undefined,
              backgroundSize: `${w * ZOOM}px ${h * ZOOM}px`,
              backgroundPosition: `${l / 2 - lens.x * w * ZOOM}px ${l / 2 - lens.y * h * ZOOM}px`,
            }}
          >
            <span className="lens__glass" aria-hidden="true" />
            <span className="lens__handle" aria-hidden="true" />
          </div>
          {found && (
            <div
              key={found.id}
              className={`node3d node3d--${found.x > 0.5 ? 'left' : 'right'}`}
              style={{ left: `${found.x * 100}%`, top: `${found.y * 100}%` }}
              role="status"
            >
              <span className="node3d__stem" aria-hidden="true" />
              <p className="node3d__title">{found.title}</p>
              <p>{found.text}</p>
              <p className="node3d__note">{found.note}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
