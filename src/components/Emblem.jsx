/**
 * The clinic emblem. Shipped as a 15 KB alpha mask and painted with the brief's
 * gold gradient in CSS, instead of a full-colour PNG.
 */
export default function Emblem({ className = '', label }) {
  return <span className={`emblem ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} />;
}
