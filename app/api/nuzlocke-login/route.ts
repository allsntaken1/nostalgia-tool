import { NextResponse, type NextRequest } from 'next/server';
import { createNuzlockeSessionToken, getNuzlockePassword, NUZLOCKE_COOKIE } from '../../nuzlocke/auth';

export async function POST(request: NextRequest) {
  const configuredPassword = getNuzlockePassword();

  if (!configuredPassword) {
    return NextResponse.json({ error: 'NUZLOCKE_PASSWORD is not configured.' }, { status: 503 });
  }

  let password = '';

  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 });
  }

  if (password !== configuredPassword) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: NUZLOCKE_COOKIE,
    value: createNuzlockeSessionToken(configuredPassword),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/nuzlocke',
  });

  return response;
}
