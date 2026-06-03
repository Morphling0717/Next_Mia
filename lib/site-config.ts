export type ExpressionItem = {
  id: string;
  face: string;
  full: string;
};

export type SongCategory = {
  id: string;
  label: string;
};

export type LiveSchedule = {
  morning: string;
  evening: string;
  off: string;
};

export type LiveLink = {
  title: string;
  url: string;
  icon: string;
  color: string;
};

export type ActiveTopicSummary = {
  slug: string;
  title: string;
  description: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export type EditableSiteConfig = {
  seo: {
    title: string;
    description: string;
    keywords: string[];
    siteName: string;
    playlistName: string;
    playlistDescription: string;
  };
  pwa: {
    manifestName: string;
    manifestShortName: string;
    manifestDescription: string;
    installTitle: string;
    installDescription: string;
    installIosDescription: string;
    installButton: string;
    iosStepOne: string;
    iosStepTwo: string;
    updateTitle: string;
    updateDescription: string;
    updateButton: string;
  };
  offline: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    body: string;
    statusText: string;
    retryButton: string;
  };
  system: {
    configUpdatedToast: string;
  };
  hero: {
    code: string;
    title: string;
    subtitle: string;
    projectName: string;
    startBtn: string;
    scrollText: string;
    statusText: string;
    followersText: string;
    statsLoadingText: string;
    statsPendingText: string;
    statsErrorText: string;
    statsOfflineText: string;
  };
  model: {
    titlePrefix: string;
    titleSuffix: string;
    syncRate: string;
    facePlaceholder: string;
    imagePlaceholderTitle: string;
    imageMissingText: string;
    expressions: ExpressionItem[];
  };
  live: {
    title: string;
    roomId: string;
    roomPrefix: string;
    liveNowText: string;
    offlineText: string;
    scheduleTitle: string;
    rulesTitle: string;
    schedule: LiveSchedule;
    rules: string[];
    links: LiveLink[];
  };
  gallery: {
    titlePrefix: string;
    titleSuffix: string;
    scrollText: string;
    datePrefix: string;
  };
  api: {
    bilibili: string;
  };
  song_ui: {
    titlePrefix: string;
    titleSuffix: string;
    serverText: string;
    songsUnit: string;
    searchPlaceholder: string;
    randomizeBtn: string;
    copiedPrefix: string;
    copiedTag: string;
    emptyText: string;
    copyCommandPrefix: string;
    categories: SongCategory[];
  };
  videos: {
    archiveTitle: string;
  };
  footer: {
    text: string;
  };
  errors: {
    title: string;
    message: string;
    retryText: string;
  };
  mail: {
    entryLabel: string;
    entryHint: string;
    entryHintDisabled: string;
    disabledBanner: string;
    senderTitle: string;
    senderTagline: string;
    statusOpen: string;
    statusPaused: string;
    pausedMessage: string;
    placeholderText: string;
    placeholderNickname: string;
    placeholderLink: string;
    successMessage: string;
  };
};

export type RuntimeSiteConfig = EditableSiteConfig & {
  activeTopics: ActiveTopicSummary[];
  mailEnabled: boolean;
};

export const DEFAULT_SITE_CONFIG: EditableSiteConfig = {
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
    schedule: {
      morning: "晨课: 10:00 - 12:00",
      evening: "晚祷: 20:00 - 22:00",
      off: "周一休堂",
    },
    rules: ["请安静聆听祷词", "投信请保持温柔"],
    links: [
      { title: "进入直播间", url: "https://live.bilibili.com/", icon: "Radio", color: "gold" },
      { title: "B 站主页", url: "https://space.bilibili.com/", icon: "User", color: "ink" },
      { title: "投信箱", url: "mail:compose", icon: "Mail", color: "blush" },
      { title: "QQ 群", url: "https://qm.qq.com/", icon: "LogoQq", color: "gold" },
    ],
  },
  gallery: {
    titlePrefix: "MIA",
    titleSuffix: "_ARCHIVE",
    scrollText: "SCROLL TO EXPLORE >>>",
    datePrefix: "DATE //",
  },
  api: {
    bilibili: "https://1377297588-5v9c60xnw1.ap-guangzhou.tencentscf.com/?mid=3706975546248092",
  },
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
  videos: {
    archiveTitle: "✚ MIA · ARCHIVE ✚",
  },
  footer: {
    text: "© 星眠Mia · CLOUD CATHEDRAL",
  },
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

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isRecord(base)) return clone(base);
  if (!isRecord(override)) return clone(base);

  const result: AnyRecord = clone(base) as AnyRecord;
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const baseValue = result[key];
    if (Array.isArray(value)) {
      result[key] = clone(value);
    } else if (isRecord(baseValue) && isRecord(value)) {
      result[key] = deepMerge(baseValue, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function normalizeString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return normalized.length > 0 ? Array.from(new Set(normalized)) : [...fallback];
}

function normalizeExpressionArray(value: unknown, fallback: ExpressionItem[]): ExpressionItem[] {
  if (!Array.isArray(value)) return clone(fallback);
  return value.map((item, index) => {
    const record = isRecord(item) ? item : {};
    return {
      id: normalizeString(record.id, fallback[index]?.id ?? ""),
      face: normalizeString(record.face, fallback[index]?.face ?? ""),
      full: normalizeString(record.full, fallback[index]?.full ?? ""),
    };
  });
}

function normalizeCategories(value: unknown, fallback: SongCategory[]): SongCategory[] {
  if (!Array.isArray(value)) return clone(fallback);
  const normalized = value
    .map((item, index) => {
      const record = isRecord(item) ? item : {};
      const id = normalizeString(record.id, fallback[index]?.id ?? "").trim();
      const label = normalizeString(record.label, fallback[index]?.label ?? "").trim();
      return id && label ? { id, label } : null;
    })
    .filter((item): item is SongCategory => Boolean(item));
  return normalized.length > 0 ? normalized : clone(fallback);
}

function normalizeLiveLinks(value: unknown, fallback: LiveLink[]): LiveLink[] {
  if (!Array.isArray(value)) return clone(fallback);
  return value.map((item, index) => {
    const record = isRecord(item) ? item : {};
    return {
      title: normalizeString(record.title, fallback[index]?.title ?? ""),
      url: normalizeString(record.url, fallback[index]?.url ?? ""),
      icon: normalizeString(record.icon, fallback[index]?.icon ?? "Share"),
      color: normalizeString(record.color, fallback[index]?.color ?? "gold"),
    };
  });
}

export function mergeSiteConfig(raw: unknown): EditableSiteConfig {
  return deepMerge(DEFAULT_SITE_CONFIG, raw);
}

export function sanitizeEditableSiteConfig(raw: unknown): EditableSiteConfig {
  const merged = mergeSiteConfig(raw);
  const d = DEFAULT_SITE_CONFIG;

  return {
    seo: {
      title: normalizeString(merged.seo.title, d.seo.title),
      description: normalizeString(merged.seo.description, d.seo.description),
      keywords: normalizeStringArray(merged.seo.keywords, d.seo.keywords),
      siteName: normalizeString(merged.seo.siteName, d.seo.siteName),
      playlistName: normalizeString(merged.seo.playlistName, d.seo.playlistName),
      playlistDescription: normalizeString(
        merged.seo.playlistDescription,
        d.seo.playlistDescription,
      ),
    },
    pwa: {
      manifestName: normalizeString(merged.pwa.manifestName, d.pwa.manifestName),
      manifestShortName: normalizeString(merged.pwa.manifestShortName, d.pwa.manifestShortName),
      manifestDescription: normalizeString(
        merged.pwa.manifestDescription,
        d.pwa.manifestDescription,
      ),
      installTitle: normalizeString(merged.pwa.installTitle, d.pwa.installTitle),
      installDescription: normalizeString(
        merged.pwa.installDescription,
        d.pwa.installDescription,
      ),
      installIosDescription: normalizeString(
        merged.pwa.installIosDescription,
        d.pwa.installIosDescription,
      ),
      installButton: normalizeString(merged.pwa.installButton, d.pwa.installButton),
      iosStepOne: normalizeString(merged.pwa.iosStepOne, d.pwa.iosStepOne),
      iosStepTwo: normalizeString(merged.pwa.iosStepTwo, d.pwa.iosStepTwo),
      updateTitle: normalizeString(merged.pwa.updateTitle, d.pwa.updateTitle),
      updateDescription: normalizeString(merged.pwa.updateDescription, d.pwa.updateDescription),
      updateButton: normalizeString(merged.pwa.updateButton, d.pwa.updateButton),
    },
    offline: {
      metadataTitle: normalizeString(merged.offline.metadataTitle, d.offline.metadataTitle),
      metadataDescription: normalizeString(
        merged.offline.metadataDescription,
        d.offline.metadataDescription,
      ),
      title: normalizeString(merged.offline.title, d.offline.title),
      body: normalizeString(merged.offline.body, d.offline.body),
      statusText: normalizeString(merged.offline.statusText, d.offline.statusText),
      retryButton: normalizeString(merged.offline.retryButton, d.offline.retryButton),
    },
    system: {
      configUpdatedToast: normalizeString(
        merged.system.configUpdatedToast,
        d.system.configUpdatedToast,
      ),
    },
    hero: {
      code: normalizeString(merged.hero.code, d.hero.code),
      title: normalizeString(merged.hero.title, d.hero.title),
      subtitle: normalizeString(merged.hero.subtitle, d.hero.subtitle),
      projectName: normalizeString(merged.hero.projectName, d.hero.projectName),
      startBtn: normalizeString(merged.hero.startBtn, d.hero.startBtn),
      scrollText: normalizeString(merged.hero.scrollText, d.hero.scrollText),
      statusText: normalizeString(merged.hero.statusText, d.hero.statusText),
      followersText: normalizeString(merged.hero.followersText, d.hero.followersText),
      statsLoadingText: normalizeString(merged.hero.statsLoadingText, d.hero.statsLoadingText),
      statsPendingText: normalizeString(merged.hero.statsPendingText, d.hero.statsPendingText),
      statsErrorText: normalizeString(merged.hero.statsErrorText, d.hero.statsErrorText),
      statsOfflineText: normalizeString(merged.hero.statsOfflineText, d.hero.statsOfflineText),
    },
    model: {
      titlePrefix: normalizeString(merged.model.titlePrefix, d.model.titlePrefix),
      titleSuffix: normalizeString(merged.model.titleSuffix, d.model.titleSuffix),
      syncRate: normalizeString(merged.model.syncRate, d.model.syncRate),
      facePlaceholder: normalizeString(merged.model.facePlaceholder, d.model.facePlaceholder),
      imagePlaceholderTitle: normalizeString(
        merged.model.imagePlaceholderTitle,
        d.model.imagePlaceholderTitle,
      ),
      imageMissingText: normalizeString(merged.model.imageMissingText, d.model.imageMissingText),
      expressions: normalizeExpressionArray(merged.model.expressions, d.model.expressions),
    },
    live: {
      title: normalizeString(merged.live.title, d.live.title),
      roomId: normalizeString(merged.live.roomId, d.live.roomId),
      roomPrefix: normalizeString(merged.live.roomPrefix, d.live.roomPrefix),
      liveNowText: normalizeString(merged.live.liveNowText, d.live.liveNowText),
      offlineText: normalizeString(merged.live.offlineText, d.live.offlineText),
      scheduleTitle: normalizeString(merged.live.scheduleTitle, d.live.scheduleTitle),
      rulesTitle: normalizeString(merged.live.rulesTitle, d.live.rulesTitle),
      schedule: {
        morning: normalizeString(merged.live.schedule.morning, d.live.schedule.morning),
        evening: normalizeString(merged.live.schedule.evening, d.live.schedule.evening),
        off: normalizeString(merged.live.schedule.off, d.live.schedule.off),
      },
      rules: normalizeStringArray(merged.live.rules, d.live.rules),
      links: normalizeLiveLinks(merged.live.links, d.live.links),
    },
    gallery: {
      titlePrefix: normalizeString(merged.gallery.titlePrefix, d.gallery.titlePrefix),
      titleSuffix: normalizeString(merged.gallery.titleSuffix, d.gallery.titleSuffix),
      scrollText: normalizeString(merged.gallery.scrollText, d.gallery.scrollText),
      datePrefix: normalizeString(merged.gallery.datePrefix, d.gallery.datePrefix),
    },
    api: {
      bilibili: normalizeString(merged.api.bilibili, d.api.bilibili),
    },
    song_ui: {
      titlePrefix: normalizeString(merged.song_ui.titlePrefix, d.song_ui.titlePrefix),
      titleSuffix: normalizeString(merged.song_ui.titleSuffix, d.song_ui.titleSuffix),
      serverText: normalizeString(merged.song_ui.serverText, d.song_ui.serverText),
      songsUnit: normalizeString(merged.song_ui.songsUnit, d.song_ui.songsUnit),
      searchPlaceholder: normalizeString(
        merged.song_ui.searchPlaceholder,
        d.song_ui.searchPlaceholder,
      ),
      randomizeBtn: normalizeString(merged.song_ui.randomizeBtn, d.song_ui.randomizeBtn),
      copiedPrefix: normalizeString(merged.song_ui.copiedPrefix, d.song_ui.copiedPrefix),
      copiedTag: normalizeString(merged.song_ui.copiedTag, d.song_ui.copiedTag),
      emptyText: normalizeString(merged.song_ui.emptyText, d.song_ui.emptyText),
      copyCommandPrefix: normalizeString(
        merged.song_ui.copyCommandPrefix,
        d.song_ui.copyCommandPrefix,
      ),
      categories: normalizeCategories(merged.song_ui.categories, d.song_ui.categories),
    },
    videos: {
      archiveTitle: normalizeString(merged.videos.archiveTitle, d.videos.archiveTitle),
    },
    footer: {
      text: normalizeString(merged.footer.text, d.footer.text),
    },
    errors: {
      title: normalizeString(merged.errors.title, d.errors.title),
      message: normalizeString(merged.errors.message, d.errors.message),
      retryText: normalizeString(merged.errors.retryText, d.errors.retryText),
    },
    mail: {
      entryLabel: normalizeString(merged.mail.entryLabel, d.mail.entryLabel),
      entryHint: normalizeString(merged.mail.entryHint, d.mail.entryHint),
      entryHintDisabled: normalizeString(merged.mail.entryHintDisabled, d.mail.entryHintDisabled),
      disabledBanner: normalizeString(merged.mail.disabledBanner, d.mail.disabledBanner),
      senderTitle: normalizeString(merged.mail.senderTitle, d.mail.senderTitle),
      senderTagline: normalizeString(merged.mail.senderTagline, d.mail.senderTagline),
      statusOpen: normalizeString(merged.mail.statusOpen, d.mail.statusOpen),
      statusPaused: normalizeString(merged.mail.statusPaused, d.mail.statusPaused),
      pausedMessage: normalizeString(merged.mail.pausedMessage, d.mail.pausedMessage),
      placeholderText: normalizeString(merged.mail.placeholderText, d.mail.placeholderText),
      placeholderNickname: normalizeString(
        merged.mail.placeholderNickname,
        d.mail.placeholderNickname,
      ),
      placeholderLink: normalizeString(merged.mail.placeholderLink, d.mail.placeholderLink),
      successMessage: normalizeString(merged.mail.successMessage, d.mail.successMessage),
    },
  };
}

export function withRuntimeSiteConfig(
  editableConfig: EditableSiteConfig,
  runtime: { activeTopics?: ActiveTopicSummary[]; mailEnabled?: boolean } = {},
): RuntimeSiteConfig {
  return {
    ...editableConfig,
    activeTopics: runtime.activeTopics ?? [],
    mailEnabled: runtime.mailEnabled ?? true,
  };
}
