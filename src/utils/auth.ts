/**
 * Password helpers for the localStorage-based demo accounts.
 *
 * Passwords of newly registered members are stored as a salted PBKDF2 hash
 * instead of plain text. This only reduces exposure of the stored data; it does
 * not replace a real backend (anyone with access to the browser can still edit
 * localStorage).
 */
const PBKDF2_ITERATIONS = 100_000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

/** Web Crypto subtle API is only available in secure contexts (https/localhost). */
export function canHashPasswords(): boolean {
  return typeof globalThis.crypto?.subtle?.deriveBits === 'function'
    && typeof globalThis.crypto.getRandomValues === 'function';
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function createSalt(): string {
  return toHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex) as BufferSource, iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );

  return toHex(new Uint8Array(bits));
}

/** Constant-time string comparison. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
