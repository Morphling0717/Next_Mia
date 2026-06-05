/**
 * Apply idempotent SQL migrations from ./migrations.
 *
 * The app still creates critical tables on boot, but this script gives deployment
 * operators an explicit, auditable migration step.
 *
 * Usage:
 *   node scripts/migrate-db.js
 *   DATABASE_PATH=/app/data/codes.db node scripts/migrate-db.js
 */

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(process.cwd(), process.env.DATABASE_PATH || "codes.db");
const migrationsDir = path.resolve(process.cwd(), "migrations");

function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function main() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database not found: ${dbPath}`);
  }
  if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found.");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => /^\d+_.+\.sql$/.test(f))
    .sort();

  const db = new sqlite3.Database(dbPath);

  try {
    await dbRun(
      db,
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY NOT NULL,
        applied_at TEXT NOT NULL
      )`,
    );

    for (const file of files) {
      const existing = await dbGet(db, "SELECT id FROM schema_migrations WHERE id = ?", [
        file,
      ]);
      if (existing) {
        console.log(`↷ ${file} already applied`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await dbRun(db, "BEGIN IMMEDIATE");
      try {
        await new Promise((resolve, reject) => {
          db.exec(sql, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        await dbRun(db, "INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)", [
          file,
          new Date().toISOString(),
        ]);
        await dbRun(db, "COMMIT");
        console.log(`✓ applied ${file}`);
      } catch (err) {
        await dbRun(db, "ROLLBACK").catch(() => {});
        throw err;
      }
    }
  } finally {
    db.close();
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
