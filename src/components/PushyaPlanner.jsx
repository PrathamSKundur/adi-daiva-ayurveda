import { useEffect, useMemo, useState } from 'react';
import { upcomingPushya } from '../lib/pushya';
import { ist, istMidnight, fmtTime, visitDay } from '../lib/hours';
import { CLINIC, whatsappWith } from '../data/site';
import { WhatsAppIcon } from './ornaments';

const DAY = 86400000;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WD_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dateLabel = (ms, long) => { const p = ist(ms); return `${(long ? WD_LONG : WD)[p.dow]}, ${p.d} ${MONTHS[p.m].slice(0, long ? 99 : 3)} ${p.y}`; };
const instant = (ms) => { const p = ist(ms); return `${WD[p.dow]} ${p.d} ${MONTHS[p.m].slice(0, 3)}, ${fmtTime(p.min)}`; };
// Pushya on a Thursday is Guru Pushya, on a Sunday Ravi Pushya: both considered especially auspicious
const yoga = (dow) => (dow === 4 ? 'Guru Pushya' : dow === 0 ? 'Ravi Pushya' : null);

function countdown(dayMs, now) {
  const n = Math.round((dayMs - istMidnight(now)) / DAY);
  return n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
}

/** An .ics file with every upcoming Swarna Prashana day, each with a reminder the morning before. */
function downloadIcs(visits) {
  const esc = (s) => s.replace(/[\\,;]/g, (c) => `\\${c}`);
  const ymd = (ms) => { const p = ist(ms); return `${p.y}${String(p.m + 1).padStart(2, '0')}${String(p.d).padStart(2, '0')}`; };
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const events = visits.map((v) => [
    'BEGIN:VEVENT',
    `UID:swarna-prashana-${ymd(v.day)}@adidaiva-ayurveda`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(v.day)}`,
    `DTEND;VALUE=DATE:${ymd(v.day + DAY)}`,
    `SUMMARY:${esc('Swarna Bindu Prashana · Adi Daiva Ayurveda')}`,
    `DESCRIPTION:${esc(`Pushya Nakshatra: ${instant(v.start)} to ${instant(v.end)} (IST). Clinic times that day: ${v.slots.map(([s, e]) => `${fmtTime(s)}–${fmtTime(e)}`).join(', ')}. Call ${CLINIC.phoneDisplay} to confirm.`)}`,
    `LOCATION:${esc(CLINIC.address.join(', '))}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:-PT15H', `DESCRIPTION:${esc('Swarna Prashana tomorrow at Adi Daiva Ayurveda')}`, 'END:VALARM',
    'END:VEVENT',
  ].join('\r\n'));
  // RFC 5545: lines longer than 75 octets are folded (CRLF + space)
  const fold = (line) => line.match(/.{1,72}/gu).join('\r\n ');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Adi Daiva Ayurveda//Swarna Prashana//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR']
    .join('\r\n').split('\r\n').map(fold).join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'swarna-prashana-dates.ics' });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Upcoming Pushya Nakshatra dates, calculated from the Moon's position on the visitor's
 * device (always current), with the best clinic day and times for each.
 */
export default function PushyaPlanner() {
  const [now, setNow] = useState(null); // computed after mount: the pre-rendered page shows a placeholder
  const [offset, setOffset] = useState(0); // months shown after the current one

  useEffect(() => { setNow(Date.now()); }, []);

  const visits = useMemo(() => {
    if (!now) return [];
    return upcomingPushya(now, 13).map((w) => ({ ...w, ...visitDay(w) })).filter((v) => v.day + DAY > now);
  }, [now]);

  if (!now || !visits.length) {
    return <div className="planner planner--loading" aria-busy="true"><p>Calculating the coming Pushya Nakshatra dates…</p></div>;
  }

  const next = visits[0];
  const nextP = ist(next.day);
  const y = yoga(nextP.dow);

  // month grid
  const base = ist(now);
  const mIndex = base.m + offset;
  const gy = base.y + Math.floor(mIndex / 12), gm = ((mIndex % 12) + 12) % 12;
  const first = Date.UTC(gy, gm, 1) - 5.5 * 3600000; // IST midnight, 1st of the month
  const lead = ist(first).dow;
  const daysIn = new Date(Date.UTC(gy, gm + 1, 0)).getUTCDate();
  const todayMid = istMidnight(now);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) {
    const day = first + (d - 1) * DAY;
    const visit = visits.find((v) => v.day === day);
    const pushya = visits.some((v) => v.start < day + DAY && v.end > day);
    cells.push({ d, day, visit, pushya, today: day === todayMid });
  }

  return (
    <div className="planner">
      <p className="planner__eyebrow">Plan your child’s visit</p>

      {/* the next date, large */}
      <div className="planner__next">
        <div className="planner__when">
          <span className="planner__count">{countdown(next.day, now)}</span>
          {y && <span className="planner__yoga">{y}</span>}
        </div>
        <p className="planner__date">
          <span>{WD_LONG[nextP.dow]}</span>
          {nextP.d} {MONTHS[nextP.m]} {nextP.y}
        </p>
        <dl className="planner__facts">
          <div><dt>Pushya Nakshatra</dt><dd>{instant(next.start)} → {instant(next.end)}</dd></div>
          <div>
            <dt>Clinic times that day</dt>
            <dd>{next.slots.length ? next.slots.map(([s, e]) => `${fmtTime(s)} – ${fmtTime(e)}`).join(' · ') : 'Outside clinic hours, please call'}</dd>
          </div>
        </dl>
        <div className="planner__actions">
          <a
            className="btn btn--gold"
            href={whatsappWith(`Hari Om, I would like to book Swarna Bindu Prashana for my child on ${dateLabel(next.day, true)}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Book this date
          </a>
          <button className="btn btn--line" onClick={() => downloadIcs(visits)}>
            <CalendarIcon /> Add all dates to my calendar
          </button>
        </div>
      </div>

      {/* month calendar */}
      <div className="month" aria-label={`${MONTHS[gm]} ${gy}`}>
        <div className="month__head">
          <button onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0} aria-label="Previous month">‹</button>
          <p>{MONTHS[gm]} {gy}</p>
          <button onClick={() => setOffset((o) => Math.min(11, o + 1))} disabled={offset === 11} aria-label="Next month">›</button>
        </div>
        <div className="month__grid" role="grid">
          {WD.map((w) => <span key={w} className="month__wd" role="columnheader">{w[0]}</span>)}
          {cells.map((c, i) =>
            c ? (
              <span
                key={i}
                role="gridcell"
                className={`month__day ${c.pushya ? 'is-pushya' : ''} ${c.visit ? 'is-visit' : ''} ${c.today ? 'is-today' : ''} ${c.day < todayMid ? 'is-past' : ''}`}
                title={c.visit ? `Swarna Prashana day · Pushya ${instant(c.visit.start)} → ${instant(c.visit.end)}` : undefined}
                aria-label={c.visit ? `${c.d}: Swarna Prashana day` : undefined}
              >
                {c.d}
              </span>
            ) : (
              <span key={i} />
            )
          )}
        </div>
        <p className="month__legend">
          <span><i className="dot dot--visit" /> Swarna Prashana day</span>
          <span><i className="dot dot--pushya" /> Pushya Nakshatra</span>
        </p>
      </div>

      {/* the following dates */}
      <ol className="planner__list">
        {visits.slice(1, 7).map((v) => {
          const p = ist(v.day);
          const yy = yoga(p.dow);
          return (
            <li key={v.day}>
              <span className="planner__list-date">
                <strong>{p.d}</strong>
                <small>{MONTHS[p.m].slice(0, 3)}</small>
              </span>
              <span className="planner__list-info">
                <b>{WD_LONG[p.dow]}{yy && <em> · {yy}</em>}</b>
                <small>Pushya {instant(v.start)} → {instant(v.end)}</small>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="planner__note">
        Dates are calculated from the Moon’s position (Lahiri ayanamsa, Indian Standard Time) and match printed
        panchangas to within a minute or two. The clinic confirms each session; please book on WhatsApp.
      </p>
    </div>
  );
}

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
