import crypto from 'crypto';
import { NextResponse } from 'next/server';

export type SessionScope = 'admin' | 'mail';

const COOKIE_NAMES: Record<SessionScope, string> = {
  admin: 'mia_admin_session',
  mail: 'mia_mail_session',
};

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, Buffer.alloc(ab.length));
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

export function getPasswordForScope(scope: SessionScope): string | null {
  if (scope === 'mail') {
    const mailPassword = process.env.MAIL_AUTH_PASSWORD?.trim();
    if (mailPassword) return mailPassword;
  }
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  return adminPassword || null;
}

export function verifyPasswordForScope(
  scope: SessionScope,
  password: string | null | undefined,
): boolean {
  const expected = getPasswordForScope(scope);
  const candidate = typeof password === 'string' ? password : '';
  if (!expected || !candidate) return false;
  return safeEqual(candidate, expected);
}

function getSessionSecret(): string | null {
  return (
    process.env.SESSION_SECRET?.trim() ||
    process.env.WINDCHIME_HASH_SALT?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    null
  );
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function signPayload(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        if (index === -1) return [part, ''];
        return [
          decodeURIComponent(part.slice(0, index)),
          decodeURIComponent(part.slice(index + 1)),
        ];
      }),
  );
}

export function createSessionToken(scope: SessionScope): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('SESSION_SECRET / WINDCHIME_HASH_SALT / ADMIN_PASSWORD 未配置');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({
      scope,
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS,
      nonce: crypto.randomUUID(),
    }),
  );
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function verifySession(req: Request, scope: SessionScope): boolean {
  const secret = getSessionSecret();
  if (!secret) return false;

  const cookieName = COOKIE_NAMES[scope];
  const token = parseCookies(req.headers.get('cookie'))[cookieName];
  if (!token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = signPayload(payload, secret);
  if (!safeEqual(signature, expected)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      scope?: string;
      exp?: number;
    };
    return parsed.scope === scope && typeof parsed.exp === 'number' && parsed.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function setSessionCookie(res: NextResponse, scope: SessionScope) {
  res.cookies.set(COOKIE_NAMES[scope], createSessionToken(scope), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse, scope: SessionScope) {
  res.cookies.set(COOKIE_NAMES[scope], '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
