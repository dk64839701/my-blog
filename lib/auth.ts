function bytesToBase64url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let str = '';
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlToBytes(str: string): Uint8Array<ArrayBuffer> {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SECRET!;
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

export const SESSION_COOKIE = 'admin_session';
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(email: string): Promise<string> {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const data = `${email}|${expiry}`;
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}|${bytesToBase64url(sig)}`;
}

export async function verifySession(value: string): Promise<string | null> {
  const parts = value.split('|');
  if (parts.length !== 3) return null;
  const [email, expiryStr, sigB64] = parts;
  const expiry = Number(expiryStr);
  if (!expiry || Date.now() > expiry) return null;
  try {
    const key = await getHmacKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlToBytes(sigB64),
      new TextEncoder().encode(`${email}|${expiryStr}`)
    );
    if (!valid || !ADMIN_EMAILS.includes(email)) return null;
    return email;
  } catch {
    return null;
  }
}
