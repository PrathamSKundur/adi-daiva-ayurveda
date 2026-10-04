// Clinic-hours helpers. Everything is evaluated in Indian Standard Time (UTC+5:30),
// whatever the visitor's own time zone.
import { HOURS } from '../data/site';

const IST = 5.5 * 3600000;
const DAY = 86400000;
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** IST calendar parts of an instant. */
export function ist(ms) {
  const d = new Date(ms + IST);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), dow: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() };
}
/** Epoch ms of IST midnight for the day containing `ms`. */
export const istMidnight = (ms) => Math.floor((ms + IST) / DAY) * DAY - IST;

export function fmtTime(min) {
  const h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ap}`;
}
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** e.g. { open: true, text: 'Open now · until 1:00 PM' } */
export function openStatus(now = Date.now()) {
  const { dow, min } = ist(now);
  for (const [o, c] of HOURS[dow]) {
    if (min >= toMin(o) && min < toMin(c)) return { open: true, text: `Open now · until ${fmtTime(toMin(c))}` };
  }
  const later = HOURS[dow].find(([o]) => toMin(o) > min);
  if (later) return { open: false, text: `Closed now · opens ${fmtTime(toMin(later[0]))} today` };
  const nd = (dow + 1) % 7;
  return { open: false, text: `Closed now · opens ${fmtTime(toMin(HOURS[nd][0][0]))} tomorrow (${DOW[nd]})` };
}

/** Readable rows for display: [{ days, slots }] */
export const HOURS_ROWS = [
  { days: 'Monday – Saturday', slots: HOURS[1].map(([o, c]) => `${fmtTime(toMin(o))} – ${fmtTime(toMin(c))}`) },
  { days: 'Sunday', slots: HOURS[0].map(([o, c]) => `${fmtTime(toMin(o))} – ${fmtTime(toMin(c))}`) },
];

/**
 * The best day to visit during a Pushya window: the IST date whose clinic hours overlap
 * the window the most. Returns { day (IST-midnight ms), slots: [[startMin, endMin]], minutes }.
 */
export function visitDay({ start, end }) {
  let best = null;
  for (let day = istMidnight(start); day < end; day += DAY) {
    const { dow } = ist(day);
    const slots = [];
    let minutes = 0;
    for (const [o, c] of HOURS[dow]) {
      const s = Math.max(day + toMin(o) * 60000, start);
      const e = Math.min(day + toMin(c) * 60000, end);
      if (e > s) {
        slots.push([Math.round((s - day) / 60000), Math.round((e - day) / 60000)]);
        minutes += (e - s) / 60000;
      }
    }
    if (!best || minutes > best.minutes) best = { day, slots, minutes };
  }
  return best;
}
