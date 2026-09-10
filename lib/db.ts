import sqlite3 from 'sqlite3';
import path from 'path';
import { windChimeSchemaReady } from './windchime-storage';
export { getWindChimeClientIp as getClientIp } from '@windchime/embed/server';
import fs from 'fs';

// 防止开发环境下热更新导致数据库连接被多次实例化锁死
const globalForDb = global as unknown as { __db?: sqlite3.Database; __miaDbReady?: Promise<void> };

const configuredDbPath = (process.env.DATABASE_PATH || 'codes.db').trim();
const dbPath = path.isAbsolute(configuredDbPath)
  ? configuredDbPath
  : path.resolve(/* turbopackIgnore: true */ process.cwd(), configuredDbPath);
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = globalForDb.__db ?? new sqlite3.Database(dbPath);

globalForDb.__db = db;
db.configure("busyTimeout", 5000);

// 初始化表结构
export const dbReady = globalForDb.__miaDbReady ??= windChimeSchemaReady.then(() => new Promise<void>((resolve, reject) => {
const init = { run(sql: string, callback?: ((error: Error | null) => void)) {
  db.run(sql, (err) => {
    if (err && !/duplicate column name/i.test(err.message)) reject(err);
    callback?.(err);
  });
} };
db.serialize(() => {
  init.run(`
    CREATE TABLE IF NOT EXISTS global_config (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  // ===== SITE CONFIG TABLE =====
  init.run(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      version INTEGER NOT NULL DEFAULT 1,
      updated_by TEXT
    )
  `);
  init.run(
    `ALTER TABLE site_config ADD COLUMN version INTEGER NOT NULL DEFAULT 1`,
    (err) => {
      if (err && !/duplicate column name/i.test(err.message)) {
        console.warn('[site_config] ADD COLUMN version:', err.message);
      }
    },
  );
  init.run(
    `ALTER TABLE site_config ADD COLUMN updated_by TEXT`,
    (err) => {
      if (err && !/duplicate column name/i.test(err.message)) {
        console.warn('[site_config] ADD COLUMN updated_by:', err.message);
      }
    },
  );
  init.run(`
    CREATE TABLE IF NOT EXISTS site_config_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snapshot_version INTEGER NOT NULL UNIQUE,
      snapshot_updated_at TEXT,
      snapshot_updated_by TEXT,
      backed_up_at TEXT NOT NULL,
      site_config_value TEXT NOT NULL,
      songs_value TEXT NOT NULL
    )
  `);
  init.run(
    `CREATE INDEX IF NOT EXISTS idx_site_config_history_backed_up_at
       ON site_config_history (backed_up_at DESC)`
  );

  // ===== SONGS TABLE =====
  init.run(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      artist TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Mail schema and migrations are owned by WindChime.
  // ===== RUNTIME MAINTENANCE / AUTH TABLES =====
  init.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);
  init.run(`
    CREATE TABLE IF NOT EXISTS runtime_rate_limits (
      key TEXT PRIMARY KEY NOT NULL,
      timestamps TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  init.run(
    `CREATE INDEX IF NOT EXISTS idx_runtime_rate_limits_updated_at
       ON runtime_rate_limits (updated_at)`,
  );
  init.run(`
    CREATE TABLE IF NOT EXISTS runtime_login_failures (
      key TEXT PRIMARY KEY NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      first_fail_at INTEGER NOT NULL DEFAULT 0,
      locked_until INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `);
  init.run(
    `CREATE INDEX IF NOT EXISTS idx_runtime_login_failures_updated_at
       ON runtime_login_failures (updated_at)`,
  );
  db.get("SELECT 1", (err) => err ? reject(err) : resolve());
});
}));

// 封装 Promise 版本的常用方法，替代原先的回调地狱
export const get = <T = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T | undefined> => {
  return dbReady.then(() => new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err); else resolve(row as T | undefined);
    });
  }));
};

export const all = <T = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> => {
  return dbReady.then(() => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err); else resolve(rows as T[]);
    });
  }));
};

export const run = <T = sqlite3.RunResult>(query: string, params: unknown[] = []): Promise<T> => {
  return dbReady.then(() => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err); else resolve(this as T);
    });
  }));
};

export const getConfig = async (key: string) => {
  const row = await get<{ value: string }>(
    "SELECT value FROM global_config WHERE key = ?",
    [key],
  );
  return row ? row.value : null;
};

export const setConfig = async (key: string, value: string | number) => {
  await run("UPDATE global_config SET value = ? WHERE key = ?", [String(value), key]);
};
