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
| `npm run build` | Production build into `dist/` |
| `npm run images` | Rebuilds `public/img/` (responsive WebP, crops, logo knock-out, blur placeholders) from `assets-src/` |
| `node scripts/shoot.mjs <url> 390,768,1440 <dir>` | Real-browser screenshots of every section, using your local Chrome |

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
