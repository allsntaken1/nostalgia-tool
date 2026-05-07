import { createHash } from 'crypto';
import { cookies } from 'next/headers';

export const NUZLOCKE_COOKIE = 'repeat_nuzlocke_session';

export function getNuzlockePassword() {
  return process.env.NUZLOCKE_PASSWORD?.trim() || '';
}

export function hasNuzlockePassword() {
  return getNuzlockePassword().length > 0;
}

export function createNuzlockeSessionToken(password: string) {
  return createHash('sha256').update(`repeat-nuzlocke:${password}`).digest('hex');
}

export async function isNuzlockeAuthorized() {
  const password = getNuzlockePassword();
  if (!password) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(NUZLOCKE_COOKIE)?.value;

  return session === createNuzlockeSessionToken(password);
}
