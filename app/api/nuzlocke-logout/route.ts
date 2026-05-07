import { NextResponse } from 'next/server';
import { NUZLOCKE_COOKIE } from '../../nuzlocke/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: NUZLOCKE_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/nuzlocke',
  });

  return response;
}
