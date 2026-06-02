/* eslint-disable */
/**
 * 一次性脚本：把"直播信息·外部链接按钮"4 个默认链接写入到现有的 site_config。
 *
 * 适用场景：
 *  - DB 已通过 init-full-config.js 初始化过，但当时 live.links 是空数组；
 *  - 现在想补上 直播间 / B站主页 / 投信箱 / QQ群 这 4 个新入口。
 *
 * 行为：
 *  - live.links 为空数组（或缺失）时写入默认 4 条；
 *  - 已经有链接时，只修正默认项的行为：投信箱 → mail:compose，QQ 群 → LogoQq；
 *  - 不覆盖站长在 /admin 自定义过的其它标题 / URL；
 *  - URL 全部为占位，部署后请到 /admin → 直播信息 → 外部链接按钮 替换。
 *
 * 用法：
 *   node scripts/seed-live-links.js
 */

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../codes.db");

const DEFAULT_LINKS = [
  { title: "进入直播间", url: "https://live.bilibili.com/", icon: "Radio", color: "gold" },
  { title: "B 站主页", url: "https://space.bilibili.com/", icon: "User", color: "ink" },
  { title: "投信箱", url: "mail:compose", icon: "Mail", color: "blush" },
  { title: "QQ 群", url: "https://qm.qq.com/", icon: "LogoQq", color: "gold" },
];

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err);
    process.exit(1);
  }
});

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

async function main() {
  const row = await dbGet("SELECT value FROM site_config WHERE key = ?", ["site_config"]);
  if (!row) {
    console.error("❌ 还没有 site_config 行，请先运行 node scripts/init-full-config.js");
    process.exit(1);
  }

  let cfg;
  try {
    cfg = JSON.parse(row.value);
  } catch (e) {
    console.error("❌ site_config 不是合法 JSON:", e);
    process.exit(1);
  }

  cfg.live = cfg.live || {};
  const existingLinks = Array.isArray(cfg.live.links) ? cfg.live.links : [];

  if (existingLinks.length === 0) {
    cfg.live.links = DEFAULT_LINKS;
  } else {
    cfg.live.links = existingLinks.map((link) => {
      if (link?.title === "投信箱" || link?.url === "/mail" || link?.icon === "Mail") {
        return { ...link, url: "mail:compose", icon: "Mail", color: link.color || "blush" };
      }
      if (link?.title === "QQ 群" || link?.icon === "Group" || /qm\.qq\.com/i.test(link?.url || "")) {
        return { ...link, icon: "LogoQq", color: link.color || "gold" };
      }
      return link;
    });
  }

  await dbRun(
    "UPDATE site_config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?",
    [JSON.stringify(cfg), "site_config"],
  );

  console.log(`✅ 已同步 live.links：`);
  cfg.live.links.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}  →  ${l.url}  [${l.icon}/${l.color}]`));
  console.log("💡 请到 /admin → 直播信息 → 外部链接按钮 把 URL 改成真实地址。");
  db.close();
}

main().catch((err) => {
  console.error("❌ 写入失败:", err);
  db.close();
  process.exit(1);
});
