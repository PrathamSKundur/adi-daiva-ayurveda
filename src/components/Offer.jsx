import { whatsappWith } from '../data/site';
import { WhatsAppIcon } from './ornaments';

/** The reciprocity offer: free Prakriti assessment and Nadi Pareeksha, set just below the introduction. */
export default function Offer() {
  return (
    <section className="offer" aria-label="Free diagnostic services">
      <aside className="glass" aria-label="Free diagnostic services">
        <div className="glass__offers">
          <div>
            <span className="glass__free">Free</span>
            <strong>Prakriti Assessment</strong>
            <small>Know your body constitution</small>
          </div>
          <div>
            <span className="glass__free">Free</span>
            <strong>Nadi Pareeksha</strong>
            <small>Classical pulse diagnosis</small>
          </div>
        </div>
        <a
          className="btn btn--gold"
          href={whatsappWith('Hari Om, I would like to book my free Prakriti Assessment and Nadi Pareeksha with Dr. Rohit.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon /> Reserve your free assessment
        </a>
      </aside>
    </section>
  );
}
