export type NuzlockeSupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

export function getNuzlockeSupabaseConfig(): NuzlockeSupabaseConfig | null {
  const rawUrl = process.env.NUZLOCKE_SUPABASE_URL?.trim().replace(/\/$/, '');
  const serviceRoleKey = process.env.NUZLOCKE_SUPABASE_SERVICE_ROLE_KEY;
  let url = rawUrl;

  if (url) {
    url = url
      .replace(/\/rest\/v1$/i, '')
      .replace(/\/storage\/v1$/i, '')
      .replace(/\/auth\/v1$/i, '');
  }

  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
}

export function isNuzlockeSupabaseConfigured() {
  return Boolean(getNuzlockeSupabaseConfig());
}

export function nuzlockeSupabaseHeaders(prefer?: string) {
  const config = getNuzlockeSupabaseConfig();

  if (!config) throw new Error('Nuzlocke Supabase is not configured.');

  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function nuzlockeSupabaseRequest<T>(pathName: string, init: RequestInit = {}) {
  const config = getNuzlockeSupabaseConfig();

  if (!config) throw new Error('Nuzlocke Supabase is not configured.');

  const response = await fetch(`${config.url}${pathName}`, {
    ...init,
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Nuzlocke Supabase request failed: ${response.status}`);
  }

  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}
