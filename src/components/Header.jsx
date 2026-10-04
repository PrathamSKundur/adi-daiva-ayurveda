import { useEffect, useState } from 'react';
import { CLINIC, NAV, WHATSAPP_URL } from '../data/site';
import Emblem from './Emblem';
import { PhoneIcon } from './ornaments';

export default function Header() {
  const [dark, setDark] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setSolid(window.scrollY > 40);
      const under = document.elementsFromPoint(window.innerWidth / 2, 32);
      setDark(under.some((el) => el.closest?.('[data-night]')));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${dark ? 'header--night' : ''} ${solid ? 'header--solid' : ''} ${open ? 'header--open' : ''}`}>
      <a href="#top" className="header__brand" aria-label="Adi Daiva Ayurveda Clinic, back to top" onClick={() => setOpen(false)}>
        <Emblem className="header__emblem" />
        <span>Adi Daiva <em>Ayurveda</em></span>
      </a>
      <nav className="header__nav" aria-label="Sections">
        {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>{n.label}</a>)}
      </nav>
      <div className="header__actions">
        <a href={`tel:+91${CLINIC.phone}`} className="header__call" aria-label={`Call the clinic, ${CLINIC.phoneDisplay}`}><PhoneIcon size={18} /></a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="header__book">Book Consultation</a>
        <button className="header__menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
      </div>
    </header>
  );
}
