import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finePointer, reducedMotion } from './lib/env';
import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Elements from './components/Elements';
import Homa from './components/Homa';
import Panchakarma from './components/Panchakarma';
import Swarna from './components/Swarna';
import Elders from './components/Elders';
import YogaDiet from './components/YogaDiet';
import Manuscript from './components/Manuscript';
import Contact from './components/Contact';
import FloatingCTA from './components/FloatingCTA';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Prithvi: grounded, slightly heavy scrolling (Lenis) with a mouse/trackpad. Touch keeps native momentum.
  useEffect(() => {
    if (reducedMotion || !finePointer) return undefined;
    const lenis = new Lenis({ lerp: 0.065, wheelMultiplier: 0.8 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      const el = a && document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { duration: 1.8 });
    };
    document.addEventListener('click', onClick);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <svg className="svg-defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="goldInk" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0" stopColor="#9A7440" />
            <stop offset="0.5" stopColor="#C5A059" />
            <stop offset="1" stopColor="#A9823F" />
          </linearGradient>
        </defs>
      </svg>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Elements />
        <Homa />
        <Panchakarma />
        <Swarna />
        <Elders />
        <YogaDiet />
        <Manuscript />
        <Contact />
      </main>
      <FloatingCTA />
    </>
  );
}
