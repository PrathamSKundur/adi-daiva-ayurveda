# Adi Daiva Ayurveda Clinic: website

A single-page scroll experience in three chapters: **the consulting room → the Homa (the source) → the return to light**. See `DESIGN.md` for the rationale and `PLACEHOLDERS.md` for facts to confirm with the clinic.

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (for example http://localhost:5173).

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build into `dist/`, then pre-renders the page to static HTML (the first screen paints before JavaScript runs; React hydrates it) |
| `npm run images` | Rebuilds `public/img/` from `assets-src/`: responsive WebP, watermark crops, blur placeholders, the 15 KB emblem mask |
| `npm run fonts` | Re-subsets the Sanskrit font to the Devanagari words used in `src/` (run after changing any Sanskrit text; needs `pip install fonttools brotli uharfbuzz`) |
| `npm run perf -- <url>` | Load-time check on a simulated mid-range phone (throttled 4G, 4× slower CPU) and on desktop; run against a production build |
| `node scripts/shoot.mjs <url> 390,768,1440 <dir>` | Real-browser screenshots of every section, using your local Chrome |

## Performance (production build, gzip, simulated mid-range Android on 4G)

| Metric | Before | After |
|---|---|---|
| Largest Contentful Paint | 3.6 s | **≈2.0 s** |
| First Contentful Paint | 2.8 s | ≈1.7 s |
| Layout shift (CLS) | 0.003 | 0.000 |
| Downloaded on first view | 1.18 MB | ≈0.58 MB (three.js loads only after the page has finished loading) |

Hosting needs gzip or brotli for HTML, CSS and JS (Netlify, Vercel and Cloudflare Pages do this by default).

## Stack

React + Vite · GSAP ScrollTrigger (descent, pinned Homa, dawn) · Lenis (eased wheel scrolling on desktop only; touch scrolling stays native) · three.js shaders (Homa heat shimmer, oil ripple), loaded on demand · landing title sequence in plain CSS.

Low-power devices and visitors with `prefers-reduced-motion` get static images and CSS glows instead of shaders.

## Structure

```
src/
  App.jsx                 page order, smooth scrolling
  components/             one file per section (Hero, BeingSeen, Source, Panchakarma, Swarna, Elders, YogaDiet, Manuscript, Physicians, Invitation)
  components/icons.jsx    the eight hand-built line icons
  gl/                     ShaderImage + fragment shaders
  data/site.js            phone numbers, address, WhatsApp links
assets-src/               original photographs
```
