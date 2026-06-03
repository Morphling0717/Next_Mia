/**
 * 星眠Mia 默认站点配置初始化脚本（开发期一次性 / 兜底用）
 *
 * 使用方法：
 *   node scripts/init-full-config.js
 *
 * 注意：
 *   - 仅在 site_config 表里 *没有* 任何 site_config 记录时写入。
 *   - 真正的"运行时默认值"来自 lib/site-config.ts 里的 DEFAULT_SITE_CONFIG；
 *     这里是首次创建 DB 时写入的同构默认值。
 */

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../codes.db");

const defaultConfig = {
  seo: {
    title: "星眠Mia | 云端教堂",
    description:
      "星眠Mia（Mia）官方主站：天使猫猫见习牧师的云端教堂，收录直播状态、立绘展示、歌单、视频归档与匿名发信箱。",
    keywords: [
      "星眠Mia",
      "星眠",
      "Mia",
      "XingmianMia",
      "云端教堂",
      "天使猫猫",
      "见习牧师",
      "VTuber",
      "虚拟主播",
      "歌回",
      "直播",
    ],
    siteName: "星眠Mia | 云端教堂",
    playlistName: "星眠Mia 云端歌册",
    playlistDescription:
      "星眠Mia（Mia）的云端教堂点歌单，包含圣咏、流行、古风、英文、日文等曲目。",
  },
  pwa: {
    manifestName: "星眠Mia 云端教堂",
    manifestShortName: "星眠Mia",
    manifestDescription: "星眠Mia·云端教堂：天使猫猫见习牧师的可安装网页应用。",
    installTitle: "获取 星眠Mia App",
    installDescription: "云端教堂上身体验，直接添加至桌面",
    installIosDescription: "在 Safari 点击分享并添加到主屏幕",
    installButton: "立即安装",
    iosStepOne: "1. 底部点击",
    iosStepTwo: "2. 选择",
    updateTitle: "发现新版本",
    updateDescription: "点击立即应用，无需重装",
    updateButton: "更新",
  },
  offline: {
    metadataTitle: "离线模式 · 星眠Mia",
    metadataDescription: "暂时连不上网络，已在离线模式下显示。",
    title: "云端信号丢失",
    body: "云端教堂暂时连不上 Mia 的服务器。\n稍后会自动恢复，或者你也可以手动重试。",
    statusText: "OFFLINE · CACHED SHELL",
    retryButton: "重新连接",
  },
  system: {
    configUpdatedToast: "云端教堂数据已更新，内容已自动刷新",
  },
  hero: {
    code: "PROJECT: XINGMIAN_MIA / STATUS: 见习中",
    title: "云端教堂 · 星夜祈祷",
    subtitle: "天使猫猫见习牧师 Mia",
    projectName: "星眠Mia",
    startBtn: "ENTER",
    scrollText: "SCROLL",
    statusText: "项目状态: 见习",
    followersText: "本周访客:",
    statsLoadingText: "SYNCING...",
    statsPendingText: "待配置",
    statsErrorText: "ERROR",
    statsOfflineText: "OFFLINE",
  },
  model: {
    titlePrefix: "MIA",
    titleSuffix: "_DATA",
    syncRate: "SYNC_RATE: 100%",
    facePlaceholder: "FACE",
    imagePlaceholderTitle: "立绘大图",
    imageMissingText: "暂无图片",
    expressions: [
      { id: "表情一", face: "pic/face/1.webp", full: "pic/full/1.webp" },
      { id: "表情二", face: "pic/face/2.webp", full: "pic/full/2.webp" },
      { id: "表情三", face: "pic/face/3.webp", full: "pic/full/3.webp" },
      { id: "表情四", face: "pic/face/4.webp", full: "pic/full/4.webp" },
      { id: "表情五", face: "pic/face/5.webp", full: "pic/full/5.webp" },
      { id: "表情六", face: "pic/face/6.webp", full: "pic/full/6.webp" },
    ],
  },
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
  gallery: { titlePrefix: "MIA", titleSuffix: "_ARCHIVE", scrollText: "SCROLL TO EXPLORE >>>", datePrefix: "DATE //" },
  api: { bilibili: "https://1377297588-5v9c60xnw1.ap-guangzhou.tencentscf.com/?mid=3706975546248092" },
  song_ui: {
    titlePrefix: "SONG",
    titleSuffix: "_BOOK",
    serverText: "SERVER:",
    songsUnit: "首歌",
    searchPlaceholder: "SEARCH...",
    randomizeBtn: "RANDOMIZE",
    copiedPrefix: "COPIED:",
    copiedTag: "已抄写",
    emptyText: "/// SCRIPTURE NOT FOUND ///",
    copyCommandPrefix: "点歌",
    categories: [
      { id: "all", label: "ALL" },
      { id: "pop", label: "流行" },
      { id: "gufeng", label: "古风" },
      { id: "english", label: "英文" },
    ],
  },
  videos: { archiveTitle: "✚ MIA · ARCHIVE ✚" },
  footer: { text: "© 星眠Mia · CLOUD CATHEDRAL" },
  errors: {
    title: "⚠ 教堂出了一点小故障",
    message: "请不用担心，这是程序错误，不是你的问题。",
    retryText: "刷新页面重试",
  },
  mail: {
    entryLabel: "发信箱",
    entryHint: "匿名交付给 Mia",
    entryHintDisabled: "发信箱暂时关闭",
    disabledBanner: "发信箱暂时关闭，稍后再来投递吧 ~",
    senderTitle: "MAIL_BOX",
    senderTagline: "在云端教堂御前，把想对 Mia 说的话匿名上交",
    statusOpen: "ONLINE",
    statusPaused: "OFFLINE",
    pausedMessage: "OFFLINE · 云端教堂发信箱暂时关闭，稍后再来投递吧 ~",
    placeholderText: "在这里写下你想说的话…",
    placeholderNickname: "称呼（可选）",
    placeholderLink: "B站 / X / 外站链接（可选）",
    successMessage: "已送达云端教堂 · Mia 会在直播时读到 ~",
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
