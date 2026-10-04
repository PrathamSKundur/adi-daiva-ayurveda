import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import Icon from './icons';
import { DISCLAIMER } from '../data/site';
import { Label } from './ornaments';

const DEVA_NUM = ['१', '२', '३', '४', '५', '६', '७', '८'];

const LEAVES = [
  { icon: 'gut', term: 'Jatharagni', title: 'Digestion', text: 'Acidity, bloating, constipation, poor appetite. We begin by restoring the digestive fire.' },
  { icon: 'spine', term: 'Asthi · Sandhi', title: 'Bones, joints & pain', text: 'Back and neck pain, sciatica, arthritis, frozen shoulder.' },
  { icon: 'lungs', term: 'Pranavaha srotas', title: 'Breathing', text: 'Allergies, sinus trouble, frequent colds, support alongside asthma care.' },
  { icon: 'mind', term: 'Manas', title: 'Mind & sleep', text: 'Worry, sleeplessness, burnout, recurring headaches.' },
  { icon: 'women', term: 'Stri roga', title: 'Women’s health', text: 'Irregular or painful cycles, PCOS, the years around menopause.' },
  { icon: 'lifestyle', term: 'Dosha samya', title: 'Diabetes & blood pressure', text: 'Diet, routine and medicine, alongside the care you already receive.' },
  { icon: 'skin', term: 'Twak', title: 'Skin & hair', text: 'Acne, eczema, psoriasis, hair fall, dandruff.' },
  { icon: 'anorectal', term: 'Kshara sutra', title: 'Piles, fissure & fistula', text: 'Classical para-surgical care with the medicated thread.' },
];

/** What we treat, written like the leaves of a palm-leaf manuscript. */
export default function Manuscript() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="conditions" ref={ref} className="manuscript" aria-labelledby="ms-title">
      <div className="manuscript__head" data-reveal>
        <Label>Conditions we treat</Label>
        <h2 id="ms-title">Rooted care for <em>every system</em> of the body.</h2>
      </div>

      <ol className="palm">
        {LEAVES.map((l, n) => (
          <li key={l.icon} className="palm__leaf" data-reveal style={{ '--d': `${(n % 2) * 0.15}s` }}>
            <span className="palm__num" lang="sa" aria-hidden="true">{DEVA_NUM[n]}</span>
            <Icon name={l.icon} />
            <div className="palm__words">
              <p className="palm__term">{l.term}</p>
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="fineprint manuscript__note">Traditionally used to support these conditions. {DISCLAIMER}</p>
    </section>
  );
}
