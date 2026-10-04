import { WHATSAPP_URL } from '../data/site';
import { WhatsAppIcon } from './ornaments';

/** Phase 6: pinned bottom-right at all times, breathing on a 5-second (Pranayama) cycle. */
export default function FloatingCTA() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="breathe-cta" aria-label="Book Free Nadi Pareeksha on WhatsApp">
      <span className="breathe-cta__ring" aria-hidden="true" />
      <span className="breathe-cta__ring breathe-cta__ring--2" aria-hidden="true" />
      <WhatsAppIcon size={20} />
      <span>Book Free Nadi Pareeksha</span>
    </a>
  );
}
