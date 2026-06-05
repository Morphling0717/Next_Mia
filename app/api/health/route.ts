import { NextResponse } from 'next/server';
import { all, get } from '@/lib/db';

export const dynamic = 'force-dynamic';

type CountRow = { count: number };

async function count(table: string) {
  const row = await get<CountRow>(`SELECT COUNT(*) AS count FROM ${table}`);
  return Number(row?.count ?? 0);
}

export async function GET() {
  const startedAt = Date.now();
  try {
    const integrityRows = await all<Record<string, string>>('PRAGMA integrity_check');
    const integrity = Object.values(integrityRows[0] ?? {})[0] ?? 'unknown';
    const ok = integrity === 'ok';
    const [songs, siteConfig, mailTopics, mailMessages, migrations] = await Promise.all([
      count('songs'),
      count('site_config'),
      count('mail_topics'),
      count('mail_messages'),
      count('schema_migrations'),
    ]);

    return NextResponse.json(
      {
        ok,
        service: 'next-mia',
        checkedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        database: {
          integrity,
          songs,
          siteConfig,
          mailTopics,
          mailMessages,
          migrations,
        },
        env: {
          adminPassword: Boolean(process.env.ADMIN_PASSWORD?.trim()),
          mailPassword: Boolean(process.env.MAIL_AUTH_PASSWORD?.trim()),
          sessionSecret: Boolean(
            process.env.SESSION_SECRET?.trim() ||
              process.env.WINDCHIME_HASH_SALT?.trim() ||
              process.env.ADMIN_PASSWORD?.trim(),
          ),
          turnstile: Boolean(process.env.TURNSTILE_SECRET?.trim()),
          siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
        },
      },
      {
        status: ok ? 200 : 503,
        headers: { 'cache-control': 'no-store' },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'health check failed';
    return NextResponse.json(
      {
        ok: false,
        service: 'next-mia',
        checkedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        error: message,
      },
      {
        status: 503,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }
}
