import { color } from 'console-log-colors';
import PrettyError from 'pretty-error';

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1] as string);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const formatRelativeNumber = (num: number, precision = 1): string => {
  return new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: precision,
  }).format(num);
};

const URL_SAFE_ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Securely generate random bytes in TypeScript.
 * - Browser: crypto.getRandomValues
 * - Node (older versions): crypto.randomBytes
 */
function getSecureRandomBytes(size: number): Uint8Array {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    'getRandomValues' in globalThis.crypto
  ) {
    const buf = new Uint8Array(size);
    globalThis.crypto.getRandomValues(buf);
    return buf;
  }

  console.warn(
    '[random.nanoid] No secure RNG available; falling back to Math.random (NOT secure)',
  );
  const buf = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
}

/**
 * Random utilities.
 */
export const random = {
  /**
   * Generate a URL-safe NanoID-like string.
   * @param length Number of characters; default 21. Use 15 for your case.
   * @returns Random ID string of requested length.
   */
  nanoid(length = 21): string {
    if (!Number.isFinite(length) || length <= 0 || length > 1024) {
      throw new Error(
        'random.nanoid: length must be a positive number <= 1024',
      );
    }

    const alphabet = URL_SAFE_ALPHABET;
    const mask = (1 << Math.ceil(Math.log2(alphabet.length))) - 1;
    const step = Math.ceil((1.6 * mask * length) / alphabet.length);

    const idChars: string[] = [];
    while (idChars.length < length) {
      const bytes = getSecureRandomBytes(step);
      for (let i = 0; i < bytes.length && idChars.length < length; i++) {
        const index = (bytes[i] as any) & mask;
        if (index < alphabet.length) {
          idChars.push(alphabet[index] as string);
        }
      }
    }

    return idChars.join('');
  },
};

/**
 * Returns a compact relative string like "12m ago", "2h ago", "3d ago".
 * - Input can be Date, ISO string, or timestamp (ms).
 * - Uses "now" when within 30 seconds by default.
 * - Handles future dates (returns "in 5m", "in 2h", etc).
 */
export function formatDate(
  input: Date | string | number,
  options?: {
    now?: Date | number;
    nowThresholdSeconds?: number;
  },
): string {
  const nowInput = options?.now ?? Date.now();
  const now = nowInput instanceof Date ? nowInput.getTime() : Number(nowInput);

  const date =
    input instanceof Date
      ? input
      : typeof input === 'string'
        ? new Date(input)
        : new Date(input);

  const target = date.getTime();
  if (Number.isNaN(target)) return '';

  const diffMs = now - target;
  const future = diffMs < 0;
  const absSec = Math.abs(diffMs) / 1000;

  const threshold = options?.nowThresholdSeconds ?? 30;
  if (absSec <= threshold) return 'now';

  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  let value: number;
  let unit: string;

  if (absSec < HOUR) {
    value = Math.floor(absSec / MINUTE);
    unit = 'm';
  } else if (absSec < DAY) {
    value = Math.floor(absSec / HOUR);
    unit = 'h';
  } else if (absSec < WEEK) {
    value = Math.floor(absSec / DAY);
    unit = 'd';
  } else if (absSec < MONTH) {
    value = Math.floor(absSec / WEEK);
    unit = 'w';
  } else if (absSec < YEAR) {
    value = Math.floor(absSec / MONTH);
    unit = 'mo';
  } else {
    value = Math.floor(absSec / YEAR);
    unit = 'y';
  }

  return future ? `in ${value}${unit}` : `${value}${unit} ago`;
}

export const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('bun', 'zod');

export function printEnvErrors(errors: any[]) {
  let message = `${color.redBright('✘ Missing Environment Variables')}\n\n`;

  errors.forEach((err) => {
    const variable = err.path[0];
    const cleaned = err.message.replace(/\s+/g, ' ');
    message += `${color.yellow('•')} ${color.white(variable)} ${color.gray('→')} ${color.red(cleaned)}\n`;

    const e = new Error(message);

    console.error(pe.render(e));
  });
}
