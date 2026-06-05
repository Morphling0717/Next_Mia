CREATE TABLE IF NOT EXISTS runtime_rate_limits (
  key TEXT PRIMARY KEY NOT NULL,
  timestamps TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_runtime_rate_limits_updated_at
  ON runtime_rate_limits (updated_at);

CREATE TABLE IF NOT EXISTS runtime_login_failures (
  key TEXT PRIMARY KEY NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  first_fail_at INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_runtime_login_failures_updated_at
  ON runtime_login_failures (updated_at);
