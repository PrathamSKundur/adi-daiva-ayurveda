// Eight hand-built, single-weight (1.5px) gold line icons.
// pathLength=1 lets CSS "write" every stroke in on scroll (.ink paths).

const P = (props) => <path pathLength="1" {...props} />;

// serrated, lance-shaped Neem leaf along a straight midrib
function neemLeaf(x0, y0, x1, y1, maxW, teeth) {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const side = (s) => {
    const pts = [];
    for (let i = 1; i < teeth * 2; i++) {
      const t = i / (teeth * 2);
      const w = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 0.9) * maxW * (i % 2 ? 1 : 0.8);
      pts.push(`${(x0 + dx * t + nx * w * s).toFixed(1)} ${(y0 + dy * t + ny * w * s).toFixed(1)}`);
    }
    return pts;
  };
  return `M${x0} ${y0}L${side(1).join('L')}L${x1} ${y1}L${side(-1).reverse().join('L')}Z`;
}

const leaf = (x, y, r, s = 1) => (
  <P key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0C2-3 6-4 9-3 7 0 3 2 0 0ZM0 0l7-2" />
);

const DROP = 'c-2 3-3 4.5-3 6a3 3 0 0 0 6 0c0-1.5-1-3-3-6Z';

export const ICONS = {
  // stomach with Jatharagni, the digestive flame, at its centre
  gut: (
    <>
      <P d="M27 5v9c0 4-2 6-6 9-5 4-8 9-7 15 1 10 9 18 20 18 10 0 18-6 20-14 1-5-1-9-5-10-3-1-6 1-8 3-2 2-4 3-6 2-2-2-1-5 0-8 2-4 1-8-1-12" />
      <P d="M45 31c3 0 5-2 7-5" />
      <P d="M33 51c-5 0-8-3-8-7 0-3 2-5 4-7 0 2 1 4 3 4-1-4 0-8 3-11 1 4 6 7 6 13 0 5-3 8-8 8Z" />
    </>
  ),
  // spine with a climbing vine (nerve restoration)
  spine: (
    <>
      {[8, 16, 24, 32, 40, 48].map((y) => (
        <P key={y} d={`M28 ${y}h8a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z`} />
      ))}
      <P d="M22 60C42 52 18 44 40 34S20 18 40 6" />
      {leaf(30, 50, -20)}{leaf(27, 39, 200)}{leaf(37, 27, -30)}{leaf(26, 17, 210)}{leaf(39, 8, -40, 0.9)}
    </>
  ),
  // lungs whose bronchi branch like the veins of a Peepal leaf, with its drip tip
  lungs: (
    <>
      <P d="M32 5v17M32 22c-2 3-5 4-8 6M32 22c2 3 5 4 8 6" />
      <P d="M28 17c-9 3-17 12-19 24-1 9 1 16 6 17 2 0 3 2 4 4 1-2 3-3 5-4 4-2 4-6 4-13V17Z" />
      <P d="M36 17c9 3 17 12 19 24 1 9-1 16-6 17-2 0-3 2-4 4-1-2-3-3-5-4-4-2-4-6-4-13V17Z" />
      <P d="M24 28c-2 6-3 14-4 22M23 33l-6 2M22 39l-7 4M21 45l-5 5M23 36l3 3M22 43l3 4" />
      <P d="M40 28c2 6 3 14 4 22M41 33l6 2M42 39l7 4M43 45l5 5M41 36l-3 3M42 43l-3 4" />
    </>
  ),
  // head in profile; a crescent moon cradles one falling drop of oil (Shirodhara)
  mind: (
    <>
      <P d="M23 59v-8c-7-4-11-11-11-19 0-13 10-23 22-23 11 0 19 8 19 18 0 3 1 5 3 8l1 2-4 2v6c0 3-2 5-5 5h-6v9" />
      <P d="M27 30a8 8 0 0 0 14 0 9.5 9.5 0 0 1-14 0Z" />
      <P d={`M34 22${DROP}`} className="ink-fill" />
      <P d="M34 14v4" />
    </>
  ),
  // an Ashoka bloom inside the inverted triangle of Shakti
  women: (
    <>
      <P d="M9 12h46L32 55Z" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <P key={a} transform={`rotate(${a} 32 26)`} d="M32 26c-2.5-3-3-7 0-10 3 3 2.5 7 0 10Z" />
      ))}
      {[30, 90, 150, 210, 270, 330].map((a) => (
        <P key={a} transform={`rotate(${a} 32 26)`} d="M32 26v-12" />
      ))}
      <circle cx="32" cy="26" r="1.6" className="ink-fill" />
    </>
  ),
  // the balance scale: a heart on one pan, three leaves (the doshas) on the other
  lifestyle: (
    <>
      <P d="M32 8v46M23 56h18M11 18h42" />
      <P d="M11 18L4 38M11 18l7 20M3 38c2 5 14 5 16 0Z" />
      <P d="M53 18l-7 20M53 18l7 20M45 38c2 5 14 5 16 0Z" />
      <P d="M11 35c-4-2.5-6-4.5-6-6.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2-2 4-6 6.5Z" />
      {leaf(48, 35, -70, 0.75)}{leaf(53, 34, -100, 0.8)}{leaf(57, 35, -125, 0.75)}
      <circle cx="32" cy="7" r="1.8" className="ink-fill" />
    </>
  ),
  // a Neem leaf catching one golden drop at its tip
  skin: (
    <>
      <P d={neemLeaf(12, 56, 46, 16, 8, 8)} />
      <P d="M12 56L46 16M22 45l-2-6M22 45l6 1M30 36l-2-6M30 36l6 1M38 27l-2-6M38 27l6 1" />
      <P d={`M50 20${DROP}`} className="ink-fill" />
    </>
  ),
  // Kshara Sutra thread in an infinity loop around a herbal root
  anorectal: (
    <>
      <P d="M32 6v24M32 6c-3 1-5 3-6 6M32 6c3 1 5 3 6 6" />
      <P d="M32 30c0 9-4 15-11 21M32 30c0 9 4 15 11 21M32 32v25M32 40c-3 3-6 4-10 5M32 40c3 3 6 4 10 5" />
      <P d="M32 33c-6-8-21-8-21 0s15 8 21 0 21-8 21 0-15 8-21 0Z" />
    </>
  ),
};

export default function Icon({ name }) {
  return (
    <svg className="ink" viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="url(#goldInk)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </g>
    </svg>
  );
}
