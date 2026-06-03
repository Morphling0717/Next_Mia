/**
 * 更新 Bilibili API 地址（不丢失数据）
 *
 * 使用方法：
 *   node scripts/update-bili-api.js
 */

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../codes.db");
const newApiUrl = "https://1377297588-5v9c60xnw1.ap-guangzhou.tencentscf.com/?mid=3706975546248092";

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err);
    process.exit(1);
  }
  console.log(`✅ 已连接到数据库: ${dbPath}`);
});

const dbGet = (q, p = []) =>
  new Promise((res, rej) => {
    db.get(q, p, (err, row) => {
      if (err) rej(err);
      else res(row);
    });
  });

const dbRun = (q, p = []) =>
  new Promise((res, rej) => {
    db.run(q, p, function (err) {
      if (err) rej(err);
      else res(this);
    });
  });

async function main() {
  const existing = await dbGet(
    "SELECT value FROM site_config WHERE key = ?",
    ["site_config"],
  );

  if (!existing) {
    console.log("❌ site_config 记录不存在，请先运行 node scripts/init-full-config.js");
    db.close();
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(existing.value);
  } catch (e) {
    console.error("❌ site_config JSON 解析失败:", e);
    db.close();
    process.exit(1);
  }

  if (!config.api) {
    config.api = {};
  }

  const oldUrl = config.api.bilibili;
  config.api.bilibili = newApiUrl;

  await dbRun(
    "UPDATE site_config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?",
    [JSON.stringify(config), "site_config"],
  );

  console.log("✅ 已更新 Bilibili API 地址");
  console.log(`   旧值: ${oldUrl || "(未设置)"}`);
  console.log(`   新值: ${newApiUrl}`);
  db.close();
}

main().catch((err) => {
  console.error("❌ 更新失败:", err);
  db.close();
  process.exit(1);
});
