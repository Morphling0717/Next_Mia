/**
 * 星眠Mia 默认站点配置初始化脚本（开发期一次性 / 兜底用）
 *
 * 使用方法：
 *   node scripts/init-full-config.js
 *
 * 注意：
 *   - 仅在 site_config 表里 *没有* 任何 site_config 记录时写入。
 *   - 真正的"运行时默认值"来自 content/site-content.json
 *     与 lib/site-data.ts 里的 DEFAULT_SITE_CONFIG，二者保持一致。
 */

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../codes.db");

const defaultConfig = {
  hero: {
    code: "PROJECT: XINGMIAN_MIA / STATUS: 见习中",
    title: "云端教堂 · 星夜祈祷",
    subtitle: "天使猫猫见习牧师 Mia",
    projectName: "星眠Mia",
    startBtn: "ENTER",
    scrollText: "SCROLL",
    statusText: "项目状态: 见习",
    followersText: "本周访客:",
  },
  model: { titlePrefix: "MIA", titleSuffix: "_DATA" },
  live: {
    title: "直播状态",
    roomId: "",
    roomPrefix: "Room:",
    liveNowText: "ON AIR",
    offlineText: "OFFLINE",
    scheduleTitle: "讲道时刻",
    rulesTitle: "祈愿守则",
    schedule: { morning: "晨课: 10:00 - 12:00", evening: "晚祷: 20:00 - 22:00", off: "周一休堂" },
    rules: ["请安静聆听祷词", "投信请保持温柔"],
    links: [
      // 占位 URL，部署后请在 /admin → 直播信息 → 外部链接按钮 里替换为真实地址。
      { title: "进入直播间", url: "https://live.bilibili.com/", icon: "Radio", color: "gold" },
      { title: "B 站主页", url: "https://space.bilibili.com/", icon: "User", color: "ink" },
      { title: "投信箱", url: "mail:compose", icon: "Mail", color: "blush" },
      { title: "QQ 群", url: "https://qm.qq.com/", icon: "LogoQq", color: "gold" },
    ],
  },
  gallery: { title: "本地视频", titlePrefix: "MIA", titleSuffix: "_ARCHIVE", datePrefix: "DATE //" },
  api: { bilibili: "https://bili-proxy-mia.vercel.app/api" },
  song_ui: {
    titlePrefix: "SONG",
    titleSuffix: "_BOOK",
    serverText: "SERVER:",
    serverOnline: "ONLINE",
    serverOffline: "OFFLINE",
    searchPlaceholder: "SEARCH...",
    randomizeBtn: "RANDOMIZE",
    syncingBtn: "SYNC...",
    copiedPrefix: "COPIED:",
    emptyText: "/// SCRIPTURE NOT FOUND ///",
    categories: [
      { id: "all", label: "ALL" },
      { id: "pop", label: "流行" },
      { id: "gufeng", label: "古风" },
      { id: "english", label: "英文" },
    ],
  },
  videos: { archiveTitle: "✚ MIA · ARCHIVE ✚" },
  footer: { text: "© 星眠Mia · CLOUD CATHEDRAL" },
  notifications: {
    modelClicked: "ANGEL_TAPPED",
    systemInitializing: "SYSTEM INITIALIZING...",
    timestampPrefix: "TIMESTAMP:",
    acknowledgeText: "ACKNOWLEDGE",
  },
  errors: {
    title: "⚠ 教堂出了一点小故障",
    message: "请不用担心，这是程序错误，不是你的问题。",
    retryText: "刷新页面重试",
  },
};

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err);
    process.exit(1);
  }
  console.log(`✅ 已连接到数据库: ${dbPath}`);
});

const dbRun = (q, p = []) =>
  new Promise((res, rej) => {
    db.run(q, p, function (err) {
      if (err) rej(err);
      else res(this);
    });
  });

const dbGet = (q, p = []) =>
  new Promise((res, rej) => {
    db.get(q, p, (err, row) => {
      if (err) rej(err);
      else res(row);
    });
  });

async function main() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    )
  `);

  const existing = await dbGet(
    "SELECT value FROM site_config WHERE key = ?",
    ["site_config"],
  );

  if (existing) {
    console.log("✅ site_config 已存在，跳过初始化（如需重置请手动 DELETE）");
    db.close();
    return;
  }

  await dbRun(
    "INSERT INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
    ["site_config", JSON.stringify(defaultConfig)],
  );
  console.log("✅ 已写入 Mia 默认 site_config");
  console.log("💡 后续请在 /admin 后台编辑文案。");
  db.close();
}

main().catch((err) => {
  console.error("❌ 初始化失败:", err);
  db.close();
  process.exit(1);
});
