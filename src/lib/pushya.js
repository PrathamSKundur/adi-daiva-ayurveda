// Upcoming Pushya Nakshatra windows, computed in the browser so the calendar never goes stale.
//
// Moon: Meeus, "Astronomical Algorithms" (2nd ed.), ch. 47 (truncated ELP-2000/82), ~10" accuracy.
// Sidereal zodiac: Lahiri (Chitrapaksha) ayanamsa, as used by Indian panchangas.
// Pushya is the 8th nakshatra: sidereal lunar longitude 93°20′ – 106°40′.

const RAD = Math.PI / 180;
const norm = (x) => ((x % 360) + 360) % 360;

// [D, M, M', F, Σl × 1e-6 degrees]   (Meeus table 47.A, longitude terms)
const TERMS = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399], [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330], [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
];

const julianDay = (ms) => ms / 86400000 + 2440587.5;
const DELTA_T_DAYS = 70 / 86400; // TT − UT, ~70 s in the 2020s

/** Tropical (mean-equinox) ecliptic longitude of the Moon, degrees. */
export function moonLongitude(ms) {
  const T = (julianDay(ms) + DELTA_T_DAYS - 2451545.0) / 36525;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  let sum = 0;
  for (const [d, m, mp, f, c] of TERMS) {
    const arg = (d * D + m * M + mp * Mp + f * F) * RAD;
    sum += c * Math.sin(arg) * (m === 0 ? 1 : Math.abs(m) === 1 ? E : E * E);
  }
  const A1 = (119.75 + 131.849 * T) * RAD;
  const A2 = (53.09 + 479264.29 * T) * RAD;
  sum += 3958 * Math.sin(A1) + 1962 * Math.sin((Lp - F) * RAD) + 318 * Math.sin(A2);
  return norm(Lp + sum / 1e6);
}

/** Lahiri ayanamsa (mean), degrees: 23°51′11″ at J2000, precessing ~50.29″ a year. */
export function lahiri(ms) {
  const years = (julianDay(ms) - 2451545.0) / 365.25;
  return 23.85306 + (50.2879 / 3600) * years + (0.000222 / 3600) * years * years;
}

export const siderealMoon = (ms) => norm(moonLongitude(ms) - lahiri(ms));

const START = 93 + 1 / 3; // 93°20′
const END = 106 + 2 / 3; // 106°40′
const inPushya = (ms) => { const l = siderealMoon(ms); return l >= START && l < END; };

// bisect the boundary between two instants where inPushya differs, to within a minute
function edge(a, b) {
  const va = inPushya(a);
  while (b - a > 60000) {
    const m = (a + b) / 2;
    if (inPushya(m) === va) a = m; else b = m;
  }
  return Math.floor(b / 60000) * 60000;
}

/** Next `count` Pushya windows from `fromMs`: [{ start, end }] as epoch ms. */
export function upcomingPushya(fromMs = Date.now(), count = 8) {
  const out = [];
  const step = 2 * 3600000; // the Moon spends ~24 h in a nakshatra; 2-hour steps never skip one
  let t = fromMs - 30 * 3600000; // include a window that is in progress
  let prev = inPushya(t);
  let start = null;
  while (out.length < count && t < fromMs + 420 * 86400000) {
    const n = t + step;
    const cur = inPushya(n);
    if (cur !== prev) {
      const at = edge(t, n);
      if (cur) start = at;
      else if (start !== null) {
        if (at > fromMs) out.push({ start, end: at });
        start = null;
      }
    }
    prev = cur;
    t = n;
  }
  return out;
}
