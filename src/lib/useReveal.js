import { useEffect } from 'react';

/**
 * Adds `.is-in` to every [data-reveal] element inside `ref` when it enters the
 * viewport (once). CSS owns the actual motion, so content is never hidden
 * from users without JS-driven animation.
 */
export default function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const els = root.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}
