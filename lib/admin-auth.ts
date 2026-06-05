import { NextResponse } from 'next/server';
import { getClientIp } from './db';
import {
  checkLoginLock,
  clearLoginFailure,
  recordLoginFailure,
} from './mail-rate-limit';
import { verifyPasswordForScope, verifySession } from './session-auth';

export async function verifyAdminRequest(
  req: Request,
  password?: string | null,
): Promise<NextResponse | null> {
  if (verifySession(req, 'admin')) return null;

  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json(
      { success: false, message: '服务器未配置 ADMIN_PASSWORD 环境变量' },
      { status: 500 },
    );
  }

  const candidate = typeof password === 'string' && password ? password : '';
  if (candidate) {
    const key = `admin:${getClientIp(req)}`;
    const lock = await checkLoginLock(key);
    if (lock.locked) {
      const retryAfterSec = Math.ceil(lock.retryAfterMs / 1000);
      return NextResponse.json(
        { success: false, message: `尝试次数过多，请 ${retryAfterSec} 秒后再试` },
        { status: 429, headers: { 'retry-after': String(retryAfterSec) } },
      );
    }

    if (verifyPasswordForScope('admin', candidate)) {
      await clearLoginFailure(key);
      return null;
    }

    const result = await recordLoginFailure(key);
    if (result.locked) {
      const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);
      return NextResponse.json(
        { success: false, message: `尝试次数过多，请 ${retryAfterSec} 秒后再试` },
        { status: 429, headers: { 'retry-after': String(retryAfterSec) } },
      );
    }
  }

  return NextResponse.json(
    { success: false, message: '密码错误或会话已过期' },
    { status: 401 },
  );
}
