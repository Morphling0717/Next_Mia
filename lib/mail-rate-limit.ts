import { get, run } from './db';

/**
 * SQLite-backed sliding-window rate limit + login failure lock.
 *
 * This survives process restarts and works across multiple app processes as long
 * as they share the same SQLite database.
 */

type HitRow = {
  timestamps: string;
};

type LoginFailureRow = {
  count: number;
  first_fail_at: number;
  locked_until: number;
};

const G = globalThis as unknown as { __mailDbGcAt?: number };

async function maybeGc(now: number) {
  if (G.__mailDbGcAt && now - G.__mailDbGcAt < 5 * 60_000) return;
  G.__mailDbGcAt = now;

  const cutoffIso = new Date(now - 60 * 60_000).toISOString();
  const cutoffMs = now - 60 * 60_000;
  await run('DELETE FROM runtime_rate_limits WHERE updated_at < ?', [cutoffIso]);
  await run(
    `DELETE FROM runtime_login_failures
     WHERE locked_until < ? AND first_fail_at < ?`,
    [now, cutoffMs],
  );
}

function parseTimestamps(raw: string | undefined): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === 'number' && Number.isFinite(x));
  } catch {
    return [];
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
};

export type RateLimitOptions = {
  key: string;
  max: number;
  windowMs: number;
};

export async function rateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  await maybeGc(now);

  const { key, max, windowMs } = opts;
  const row = await get<HitRow>(
    'SELECT timestamps FROM runtime_rate_limits WHERE key = ?',
    [key],
  );
  const cutoff = now - windowMs;
  const kept = parseTimestamps(row?.timestamps).filter((t) => t > cutoff);

  if (kept.length >= max) {
    const earliest = kept[0];
    const resetAt = earliest + windowMs;
    await saveRateLimitHit(key, kept, now);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfterMs: Math.max(0, resetAt - now),
    };
  }

  kept.push(now);
  await saveRateLimitHit(key, kept, now);
  return {
    allowed: true,
    remaining: Math.max(0, max - kept.length),
    resetAt: now + windowMs,
    retryAfterMs: 0,
  };
}

async function saveRateLimitHit(key: string, timestamps: number[], now: number) {
  await run(
    `INSERT INTO runtime_rate_limits (key, timestamps, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       timestamps = excluded.timestamps,
       updated_at = excluded.updated_at`,
    [key, JSON.stringify(timestamps), new Date(now).toISOString()],
  );
}

export type LoginLockStatus =
  | { locked: false }
  | { locked: true; retryAfterMs: number };

const LOGIN_FAIL_MAX = 10;
const LOGIN_FAIL_WINDOW_MS = 10 * 60_000;
const LOGIN_LOCK_DURATION_MS = 30 * 60_000;

export async function checkLoginLock(key: string): Promise<LoginLockStatus> {
  const now = Date.now();
  await maybeGc(now);
  const rec = await get<LoginFailureRow>(
    `SELECT count, first_fail_at, locked_until
     FROM runtime_login_failures WHERE key = ?`,
    [key],
  );
  if (!rec) return { locked: false };
  if (Number(rec.locked_until) > now) {
    return { locked: true, retryAfterMs: Number(rec.locked_until) - now };
  }
  return { locked: false };
}

export async function recordLoginFailure(key: string): Promise<LoginLockStatus> {
  const now = Date.now();
  await maybeGc(now);
  const rec = await get<LoginFailureRow>(
    `SELECT count, first_fail_at, locked_until
     FROM runtime_login_failures WHERE key = ?`,
    [key],
  );

  if (!rec || now - Number(rec.first_fail_at) > LOGIN_FAIL_WINDOW_MS) {
    await saveLoginFailure(key, 1, now, 0, now);
    return { locked: false };
  }

  const count = Number(rec.count) + 1;
  if (count >= LOGIN_FAIL_MAX) {
    const lockedUntil = now + LOGIN_LOCK_DURATION_MS;
    await saveLoginFailure(key, count, Number(rec.first_fail_at), lockedUntil, now);
    return { locked: true, retryAfterMs: LOGIN_LOCK_DURATION_MS };
  }

  await saveLoginFailure(key, count, Number(rec.first_fail_at), 0, now);
  return { locked: false };
}

async function saveLoginFailure(
  key: string,
  count: number,
  firstFailAt: number,
  lockedUntil: number,
  now: number,
) {
  await run(
    `INSERT INTO runtime_login_failures
       (key, count, first_fail_at, locked_until, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       count = excluded.count,
       first_fail_at = excluded.first_fail_at,
       locked_until = excluded.locked_until,
       updated_at = excluded.updated_at`,
    [key, count, firstFailAt, lockedUntil, new Date(now).toISOString()],
  );
}

export async function clearLoginFailure(key: string): Promise<void> {
  await run('DELETE FROM runtime_login_failures WHERE key = ?', [key]);
}
