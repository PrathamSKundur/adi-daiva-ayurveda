// Ornaments taken from the visiting card: thin gold rules broken by a flower knot,
// wide-tracked small capitals, and the WhatsApp/phone glyphs.

export function Knot({ className = '' }) {
  return (
    <svg className={`knot ${className}`} viewBox="0 0 40 16" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M20 2c2 3 2 6 0 8-2-2-2-5 0-8Z" />
        <path d="M20 10c-3-2-7-2-9 0 3 2 6 2 9 0Zm0 0c3-2 7-2 9 0-3 2-6 2-9 0Z" />
        <circle cx="20" cy="13.5" r="0.9" fill="currentColor" />
      </g>
    </svg>
  );
}

/** "— ✿ —" divider line with the knot in the middle. */
export function Rule({ className = '' }) {
  return (
    <div className={`rule ${className}`} aria-hidden="true">
      <span />
      <Knot />
      <span />
    </div>
  );
}

/** Small-caps label, as on the card ("PERSONALIZED AYURVEDIC CARE"). */
export function Label({ children, className = '' }) {
  return <p className={`label ${className}`}>{children}</p>;
}

export const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);

export const PhoneIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
