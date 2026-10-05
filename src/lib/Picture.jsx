import images from '../data/images.json';

const WIDTHS = {
  consultation: [1280],
  homa: [480, 720],
  'greeva-basti': [800, 1400],
  'kati-basti': [800, 1400],
  'janu-basti': [700, 1200],
  'swarna-prashana': [600, 1000],
  'clinic-desk': [700, 900, 1200, 1500],
  'dr-skanda': [240],
  'dr-rohit-portrait': [320, 560],
};

export const srcset = (name) => WIDTHS[name].map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
export const largest = (name) => `/img/${name}-${WIDTHS[name].at(-1)}.webp`;
export const placeholder = (name) => images.placeholders[name];
export const dims = (name) => images.meta[name];

/** Responsive <img> with width/height set (no layout shift) and lazy loading by default. */
export default function Picture({ name, alt, sizes = '100vw', eager = false, className, style, position, crossOrigin }) {
  const d = dims(name);
  return (
    <img
      className={className}
      src={largest(name)}
      srcSet={srcset(name)}
      sizes={sizes}
      width={d.w}
      height={d.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      crossOrigin={crossOrigin}
      style={{ objectPosition: position, ...style }}
    />
  );
}
