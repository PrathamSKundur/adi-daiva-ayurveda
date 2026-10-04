import { useEffect, useRef } from 'react';
import { reducedMotion, MAX_DPR } from '../lib/env';

const MODES = {
  // sparks rising from the Homa (ember tone, only ever near the flame)
  embers: { colors: ['200,80,30', '235,140,60', '255,200,120'], dir: -1, speed: [0.3, 1], size: [0.6, 2], sway: 0.6, life: [140, 280] },
  // Swarna dust drifting down
  dust: { colors: ['212,175,55', '227,199,126', '197,160,89'], dir: 1, speed: [0.15, 0.5], size: [0.5, 1.7], sway: 0.35, life: [200, 420] },
};

export default function Particles({ mode = 'embers', density = 50, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const cfg = MODES[mode];
    const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
    let w = 0, h = 0, raf, visible = false;
    const rand = (a, b) => a + Math.random() * (b - a);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const spawn = (p = {}) => {
      p.x = rand(0, w);
      p.y = cfg.dir < 0 ? rand(h * 0.5, h + 10) : rand(-20, h * 0.5);
      p.v = rand(...cfg.speed);
      p.s = rand(...cfg.size);
      p.c = cfg.colors[(Math.random() * cfg.colors.length) | 0];
      p.life = rand(...cfg.life);
      p.age = 0;
      p.ph = Math.random() * 6.28;
      return p;
    };
    const ps = Array.from({ length: density }, () => { const p = spawn(); p.age = Math.random() * p.life; return p; });

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        if (++p.age > p.life) spawn(p);
        p.y += cfg.dir * p.v;
        p.x += Math.sin(p.age * 0.03 + p.ph) * cfg.sway * 0.3;
        const a = Math.sin(Math.PI * (p.age / p.life));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 4);
        g.addColorStop(0, `rgba(${p.c},${0.85 * a})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * 4, 0, 6.2832);
        ctx.fill();
      }
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [mode, density]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" />;
}
