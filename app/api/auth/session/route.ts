import { NextResponse } from 'next/server';
import { getClientIp } from '@/lib/db';
import {
  clearLoginFailure,
  checkLoginLock,
  recordLoginFailure,
} from '@/lib/mail-rate-limit';
import {
  clearSessionCookie,
  setSessionCookie,
  verifyPasswordForScope,
  verifySession,
  type SessionScope,
} from '@/lib/session-auth';

export const dynamic = 'force-dynamic';

function parseScope(value: unknown): SessionScope | null {
  return value === 'admin' || value === 'mail' ? value : null;
}

function lockResponse(retryAfterMs: number) {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);
  return NextResponse.json(
    { success: false, message: `尝试次数过多，请 ${retryAfterSec} 秒后再试` },
    { status: 429, headers: { 'retry-after': String(retryAfterSec) } },
  );
}

export async function GET(req: Request) {
  return NextResponse.json(
    {
      success: true,
      admin: verifySession(req, 'admin'),
      mail: verifySession(req, 'mail'),
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    scope?: unknown;
    password?: unknown;
  } | null;
  const scope = parseScope(body?.scope);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!scope) {
    return NextResponse.json(
      { success: false, message: 'scope 必须是 admin 或 mail' },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const key = `session:${scope}:${ip}`;
  const lock = await checkLoginLock(key);
  if (lock.locked) return lockResponse(lock.retryAfterMs);

  if (!verifyPasswordForScope(scope, password)) {
    const result = await recordLoginFailure(key);
    if (result.locked) return lockResponse(result.retryAfterMs);
    return NextResponse.json(
      { success: false, message: '密码错误或未授权' },
      { status: 401 },
    );
  }

  await clearLoginFailure(key);
  const res = NextResponse.json({ success: true, scope });
  setSessionCookie(res, scope);
  return res;
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => null)) as { scope?: unknown } | null;
  const scope = parseScope(body?.scope);
  const res = NextResponse.json({ success: true });

  if (scope) {
    clearSessionCookie(res, scope);
  } else {
    clearSessionCookie(res, 'admin');
    clearSessionCookie(res, 'mail');
  }

  return res;
}
