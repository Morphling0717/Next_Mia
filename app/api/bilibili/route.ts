import { NextResponse } from 'next/server';
import {
  DEFAULT_BILIBILI_API_URL,
  fetchBilibiliData,
  type BilibiliApiResponse,
} from '@/lib/bilibili-api';
import { loadEditableSiteConfig } from '@/lib/site-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type BilibiliCache = {
  sourceUrl: string;
  cachedAt: number;
  data: BilibiliApiResponse;
};

const G = globalThis as unknown as {
  __miaBilibiliCache?: BilibiliCache;
};

function envSeconds(name: string, fallback: number) {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

const CACHE_TTL_MS = envSeconds('BILIBILI_CACHE_TTL_SECONDS', 120) * 1000;
const STALE_TTL_MS = envSeconds('BILIBILI_STALE_TTL_SECONDS', 30 * 60) * 1000;

function withCacheMeta(
  data: BilibiliApiResponse,
  meta: { cached: boolean; stale: boolean; cachedAt: number | null },
) {
  return {
    ...data,
    cached: meta.cached,
    stale: meta.stale,
    cachedAt: meta.cachedAt ? new Date(meta.cachedAt).toISOString() : null,
  };
}

async function getConfiguredBilibiliUrl() {
  try {
    const config = await loadEditableSiteConfig();
    return config.api?.bilibili || DEFAULT_BILIBILI_API_URL;
  } catch {
    return DEFAULT_BILIBILI_API_URL;
  }
}

export async function GET() {
  const sourceUrl = await getConfiguredBilibiliUrl();
  const now = Date.now();
  const cache = G.__miaBilibiliCache;

  if (cache && cache.sourceUrl === sourceUrl && now - cache.cachedAt <= CACHE_TTL_MS) {
    return NextResponse.json(withCacheMeta(cache.data, {
      cached: true,
      stale: false,
      cachedAt: cache.cachedAt,
    }), {
      headers: { 'cache-control': 'no-store' },
    });
  }

  try {
    const data = await fetchBilibiliData(sourceUrl);
    G.__miaBilibiliCache = { sourceUrl, cachedAt: now, data };
    return NextResponse.json(withCacheMeta(data, {
      cached: false,
      stale: false,
      cachedAt: now,
    }), {
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    if (cache && cache.sourceUrl === sourceUrl && now - cache.cachedAt <= STALE_TTL_MS) {
      return NextResponse.json(withCacheMeta(cache.data, {
        cached: true,
        stale: true,
        cachedAt: cache.cachedAt,
      }), {
        headers: {
          'cache-control': 'no-store',
          'x-mia-bilibili-stale': '1',
        },
      });
    }

    const message = error instanceof Error ? error.message : 'Bilibili API request failed';
    return NextResponse.json(
      {
        success: false,
        error: message,
        cached: false,
        stale: false,
        cachedAt: null,
      },
      {
        status: 502,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }
}
