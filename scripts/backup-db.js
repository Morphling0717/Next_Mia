/**
 * Create a timestamped SQLite backup without touching Git-tracked files.
 *
 * Usage:
 *   node scripts/backup-db.js
 *   DATABASE_PATH=/app/data/codes.db DB_BACKUP_DIR=/app/data/backups node scripts/backup-db.js
 */

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(process.cwd(), process.env.DATABASE_PATH || "codes.db");
const backupDir = path.resolve(
  process.cwd(),
  process.env.DB_BACKUP_DIR || path.join(path.dirname(dbPath), "backups"),
);

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function quoteSqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database not found: ${dbPath}`);
  }
  fs.mkdirSync(backupDir, { recursive: true });

  const backupPath = path.join(
    backupDir,
    `${path.basename(dbPath, path.extname(dbPath))}.${stamp()}.db`,
  );

  await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (openErr) => {
      if (openErr) {
        reject(openErr);
        return;
      }
      db.serialize(() => {
        db.get("PRAGMA integrity_check", (integrityErr, row) => {
          if (integrityErr) {
            reject(integrityErr);
            return;
          }
          const result = row ? Object.values(row)[0] : "";
          if (result !== "ok") {
            reject(new Error(`Integrity check failed before backup: ${result}`));
            return;
          }
          db.run(`VACUUM INTO ${quoteSqlString(backupPath)}`, (backupErr) => {
            db.close();
            if (backupErr) reject(backupErr);
            else resolve();
          });
        });
      });
    });
  });

  console.log(`✅ Backup created: ${backupPath}`);
}

main().catch((err) => {
  console.error("❌ Backup failed:", err);
  process.exit(1);
});
