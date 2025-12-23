/**
 * Checks whether a string is a valid email address for common web usage.
 * Pragmatic validator: not a full RFC parser.
 *
 * - Local part: typical symbols, no leading/trailing dot, no consecutive dots.
 * - Domain: dot-separated labels (1–63 chars), alnum with internal hyphens, no leading/trailing hyphen.
 * - Final TLD requires 2+ letters (adjust if you need single-letter TLDs).
 */
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])\.)+[A-Za-z]{2,}$/;

export function isEmailValid(
  input: string,
  options: { trim?: boolean; enforceLengths?: boolean } = {
    trim: true,
    enforceLengths: true,
  },
): boolean {
  if (input === '') return false;
  if (typeof input !== 'string') return false;

  const shouldTrim = options.trim ?? true;
  const enforceLengths = options.enforceLengths ?? true;

  const email = shouldTrim ? input.trim() : input;

  if (email.length === 0) return false;

  // Must be exactly one "@"
  const atIndex = email.indexOf('@');
  if (atIndex === -1 || email.indexOf('@', atIndex + 1) !== -1) return false;

  const [local, domain] = email.split('@');
  if (!local || !domain) return false;

  if (enforceLengths) {
    if (local.length > 64) return false;
    if (domain.length > 255) return false;
  }

  // Regex match
  if (!EMAIL_REGEX.test(email)) return false;

  // Extra domain label validation (defensive)
  const labels = domain.split('.');
  // No empty labels
  if (labels.some((l) => l.length === 0)) return false;
  // No leading/trailing hyphen and label length <= 63
  if (labels.some((l) => l.length > 63 || l.startsWith('-') || l.endsWith('-')))
    return false;

  // Disallow IP-literal domains like [127.0.0.1]
  if (domain.startsWith('[') && domain.endsWith(']')) return false;

  return true;
}

/* Quick checks */
//console.debug(isEmailValid("doruippu@gmail.com")); // true
// console.debug(isEmailValid("user@example.com")); // true
// console.debug(isEmailValid("first.last+tag@sub.domain.co")); // true
// console.debug(isEmailValid(".starts.with.dot@example.com")); // false
// console.debug(isEmailValid("double..dot@example.com")); // false
// console.debug(isEmailValid("user@-badlabel.com")); // false
// console.debug(isEmailValid("user@example")); // false
