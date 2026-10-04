// Turns the raw clinic photos in assets-src/ into responsive web images in public/img/
// and writes tiny blurred placeholders to src/data/placeholders.json.
// Run with: npm run images
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'assets-src';
const OUT = 'public/img';
mkdirSync(OUT, { recursive: true });

// crop: fractions trimmed from each edge (removes phone-camera watermarks)
const IMAGES = {
  consultation: { widths: [800, 1280, 1920], placeholder: true },
  'dr-rohit-desk': { widths: [600, 900, 1300], placeholder: true },
  homa: { widths: [480, 720], trimBlack: true, placeholder: true },
  'kati-basti': { widths: [800, 1400], crop: { left: 0.055 } },
  'janu-basti': { widths: [700, 1200], crop: { bottom: 0.075 } },
  'swarna-prashana': { widths: [600, 1000] },
  'clinic-desk': { widths: [700, 1200], crop: { bottom: 0.04 }, placeholder: true },
  'dr-skanda': { widths: [240] },
  // round portrait for the intro, cut from the consultation photo
  'dr-rohit-portrait': { src: 'consultation', extract: { left: 2380, top: 540, width: 1060, height: 1060 }, widths: [320, 560] },
};

async function base(name, cfg) {
  let buf = await sharp(`${SRC}/${cfg.src || name}.jpg`).rotate().toBuffer();
  if (cfg.extract) buf = await sharp(buf).extract(cfg.extract).toBuffer();
  if (cfg.trimBlack) buf = await sharp(buf).trim({ background: '#000000', threshold: 40 }).toBuffer();
  if (cfg.crop) {
    const { width: w, height: h } = await sharp(buf).metadata();
    const c = cfg.crop;
    const left = Math.round(w * (c.left || 0));
    const top = Math.round(h * (c.top || 0));
    buf = await sharp(buf)
      .extract({ left, top, width: w - left - Math.round(w * (c.right || 0)), height: h - top - Math.round(h * (c.bottom || 0)) })
      .toBuffer();
  }
  return buf;
}

const placeholders = {};
const meta = {};
for (const [name, cfg] of Object.entries(IMAGES)) {
  const buf = await base(name, cfg);
  const { width, height } = await sharp(buf).metadata();
  meta[name] = { w: width, h: height };
  for (const w of cfg.widths) {
    const r = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await r.clone().webp({ quality: 78 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  // one jpeg for WebGL textures / very old browsers
  const largest = cfg.widths[cfg.widths.length - 1];
  await sharp(buf).resize({ width: largest, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${name}.jpg`);
  if (cfg.placeholder) {
    const tiny = await sharp(buf).resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer();
    placeholders[name] = `data:image/webp;base64,${tiny.toString('base64')}`;
  }
}

// Logo: gold line-art on cream → transparent gold
const { data, info } = await sharp(`${SRC}/logo.jpg`).resize({ width: 640 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const bg = [251, 249, 244];
for (let i = 0; i < data.length; i += 4) {
  let a = (bg[2] - data[i + 2]) / (bg[2] - 40);
  a = Math.max(0, Math.min(1, a));
  if (a < 0.04) { data[i + 3] = 0; continue; }
  for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, (data[i + c] - bg[c] * (1 - a)) / a));
  data[i + 3] = Math.round(a * 255);
}
const logo = await sharp(data, { raw: info }).trim().png().toBuffer();
await sharp(logo).resize(512).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
await sharp(logo).resize(96).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-96.png`);

writeFileSync('src/data/images.json', JSON.stringify({ placeholders, meta }, null, 2));
console.log('images ready:', Object.keys(IMAGES).length, 'sets');
