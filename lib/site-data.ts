// 服务端共享：从 SQLite 读取首页 SSR 需要的初始数据。
// 既给 app/page.tsx 用作 SSR 初始 prop，也给 app/sitemap.ts 用作稳定 lastModified。
// 客户端轮询 /api/config 仍然存在，server-rendered 数据只是首屏 SEO 兜底。
//
// 注意：本文件依赖 sqlite3，只能在 server runtime 跑；不要在 "use client" 组件里
// 直接 import。

import { all, get } from '@/lib/db';
import { getDefaultTopic, listTopics } from '@/lib/mail-topics';
import {
  sanitizeEditableSiteConfig,
  withRuntimeSiteConfig,
  type EditableSiteConfig,
  type RuntimeSiteConfig,
} from '@/lib/site-config';

export type SongRecord = {
  category: string;
  name: string;
  artist: string;
};

export type InitialSiteData = {
  siteConfig: RuntimeSiteConfig;
  configVersion: number;
  configUpdatedAt: string | null;
  songs: SongRecord[];
};

type SiteConfigRow = {
  value: string;
  updated_at: string | null;
  version: number | null;
};

async function readSiteConfigRow(): Promise<SiteConfigRow | undefined> {
  return get<SiteConfigRow>(
    'SELECT value, updated_at, version FROM site_config WHERE key = ?',
    ['site_config'],
  );
}

export async function loadEditableSiteConfig(): Promise<EditableSiteConfig> {
  try {
    const row = await readSiteConfigRow();
    if (!row) return sanitizeEditableSiteConfig({});
    try {
      return sanitizeEditableSiteConfig(JSON.parse(row.value));
    } catch (parseErr) {
      console.warn('[site-data] site_config JSON parse failed:', parseErr);
      return sanitizeEditableSiteConfig({});
    }
  } catch (err) {
    console.warn('[site-data] read editable site_config failed:', err);
    return sanitizeEditableSiteConfig({});
  }
}

/**
 * 读取整套首页 SSR 初始数据。任何子项失败都不应阻塞整体渲染——
 * 失败时回退到 DEFAULT_SITE_CONFIG / 空数组，让 client 端的 /api/config 轮询继续兜底。
 */
export async function loadInitialSiteData(): Promise<InitialSiteData> {
  let editableConfig = sanitizeEditableSiteConfig({});
  let configVersion = 0;
  let configUpdatedAt: string | null = null;
  let songs: SongRecord[] = [];

  try {
    const row = await readSiteConfigRow();
    if (row) {
      try {
        editableConfig = sanitizeEditableSiteConfig(JSON.parse(row.value));
      } catch (parseErr) {
        console.warn('[site-data] site_config JSON parse failed:', parseErr);
      }
      configVersion = Number(row.version ?? 1);
      configUpdatedAt = row.updated_at ?? null;
    }
  } catch (err) {
    console.warn('[site-data] read site_config failed:', err);
  }

  // mail 派生字段（与 /api/config 行为一致）
  let runtimeConfig: RuntimeSiteConfig = withRuntimeSiteConfig(editableConfig);
  try {
    const activeTopics = await listTopics({ onlyPublicActive: true });
    const runtimeActiveTopics = activeTopics.map((t) => ({
      slug: t.slug,
      title: t.title,
      description: t.description,
      startsAt: t.startsAt,
      endsAt: t.endsAt,
    }));
    const defaultTopic = await getDefaultTopic();
    runtimeConfig = withRuntimeSiteConfig(editableConfig, {
      activeTopics: runtimeActiveTopics,
      mailEnabled: defaultTopic ? defaultTopic.isEnabled : true,
    });
  } catch (err) {
    console.warn('[site-data] derive mail fields failed:', err);
    runtimeConfig = withRuntimeSiteConfig(editableConfig);
  }

  try {
    songs = await all<SongRecord>(
      'SELECT category, name, artist FROM songs ORDER BY id ASC',
    );
  } catch (err) {
    console.warn('[site-data] read songs failed:', err);
  }

  return {
    siteConfig: runtimeConfig,
    configVersion,
    configUpdatedAt,
    songs,
  };
}

/**
 * 仅读取 site_config 的 updated_at / version。
 * 给 sitemap 使用，不需要其它派生字段。
 */
export async function getSiteConfigStamp(): Promise<{
  updatedAt: string | null;
  version: number;
}> {
  try {
    const row = await get<SiteConfigRow>(
      'SELECT value, updated_at, version FROM site_config WHERE key = ?',
      ['site_config'],
    );
    return {
      updatedAt: row?.updated_at ?? null,
      version: Number(row?.version ?? 0),
    };
  } catch (err) {
    console.warn('[site-data] read site_config stamp failed:', err);
    return { updatedAt: null, version: 0 };
  }
}
