"use client";

import React from "react";
import {
  CaretDownIcon as ArrowDown,
  OrderDescendingIcon as ArrowDownAZ,
  CaretUpIcon as ArrowUp,
  OrderAscendingIcon as ArrowUpAZ,
  NotificationIcon as Bell,
  CalendarIcon as Calendar,
  CopyIcon as Copy,
  VideoIcon as Film,
  FolderIcon as FolderOpen,
  HomeIcon as Home,
  ImageIcon as Image,
  LinkIcon as Link,
  OrderListIcon as List,
  MailIcon as Mail,
  MusicIcon as Music,
  EditIcon as Pencil,
  AddIcon as Plus,
  Radio2Icon as Radio,
  RefreshIcon as RefreshCw,
  SearchIcon as Search,
  DeleteIcon as Trash2,
  EditIcon as Type,
  VideoIcon as Video,
  CloseIcon as X,
  CloudUploadIcon as UploadCloud,
} from "tdesign-icons-react";
import { AdminTabId, AssetFile, SiteConfig, SongItem } from "../types";

interface AdminTabContentProps {
  activeTab: AdminTabId;
  config: SiteConfig;
  songData: SongItem[];
  assetsCache: { memes: AssetFile[]; pic: AssetFile[] };
  currentAssetFolder: "memes" | "pic";
  assetSortOrder: "asc" | "desc";
  adminPassword: string;
  updateConfig: (section: string, key: string, val: unknown) => void;
  updateNested: (section: string, nestedKey: string, key: string, val: unknown) => void;
  updateArray: (section: string, arrayKey: string, index: number, key: string, val: unknown) => void;
  updateArraySimple: (section: string, arrayKey: string, index: number, val: unknown) => void;
  addArrayItem: (section: string, arrayKey: string, defaultValue: unknown) => void;
  removeArrayItem: (section: string, arrayKey: string, index: number) => void;
  addSongRow: () => void;
  removeSong: (i: number) => void;
  updateSong: (i: number, key: string, val: string) => void;
  parseBulkSongs: () => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  moveCategory: (index: number, direction: number) => void;
  fetchAssets: (folder: "memes" | "pic", password?: string) => Promise<void>;
  toggleAssetSort: () => void;
  uploadFile: (input: HTMLInputElement) => Promise<void>;
  copyPath: (path: string) => Promise<void>;
  renameFile: (oldName: string) => Promise<void>;
  deleteFile: (filename: string) => Promise<void>;
}

export function AdminTabContent(props: AdminTabContentProps) {
  const {
    activeTab,
    config,
    songData,
    assetsCache,
    currentAssetFolder,
    assetSortOrder,
    adminPassword,
    updateConfig,
    updateNested,
    updateArray,
    updateArraySimple,
    addArrayItem,
    removeArrayItem,
    addSongRow,
    removeSong,
    updateSong,
    parseBulkSongs,
    addCategory,
    removeCategory,
    moveCategory,
    fetchAssets,
    toggleAssetSort,
    uploadFile,
    copyPath,
    renameFile,
    deleteFile,
  } = props;

  return (
    <div>
      {activeTab === "hero" && (
        <div className="card">
          <div className="section-title">
            <Home className="w-4 h-4" /> 首页文字配置
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="text-xs text-gray-400">顶部项目代号</label><input type="text" className="input-dark" value={config.hero?.code || ""} onChange={(e) => updateConfig("hero", "code", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">故障文字 (Glitch Text)</label><input type="text" className="input-dark" value={config.hero?.title || ""} onChange={(e) => updateConfig("hero", "title", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-400">副标题 (书法字)</label><input type="text" className="input-dark" value={config.hero?.subtitle || ""} onChange={(e) => updateConfig("hero", "subtitle", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">项目名称说明</label><input type="text" className="input-dark" value={config.hero?.projectName || ""} onChange={(e) => updateConfig("hero", "projectName", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">开始按钮文字</label><input type="text" className="input-dark" value={config.hero?.startBtn || ""} onChange={(e) => updateConfig("hero", "startBtn", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-400">页面滚动提示文字</label><input type="text" className="input-dark" value={config.hero?.scrollText || "SCROLL"} onChange={(e) => updateConfig("hero", "scrollText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">项目状态文字</label><input type="text" className="input-dark" value={config.hero?.statusText || ""} onChange={(e) => updateConfig("hero", "statusText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">粉丝数字前缀</label><input type="text" className="input-dark" value={config.hero?.followersText || ""} onChange={(e) => updateConfig("hero", "followersText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">统计加载中</label><input type="text" className="input-dark" value={config.hero?.statsLoadingText || ""} onChange={(e) => updateConfig("hero", "statsLoadingText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">未配置 API</label><input type="text" className="input-dark" value={config.hero?.statsPendingText || ""} onChange={(e) => updateConfig("hero", "statsPendingText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">请求错误状态</label><input type="text" className="input-dark" value={config.hero?.statsErrorText || ""} onChange={(e) => updateConfig("hero", "statsErrorText", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">离线状态</label><input type="text" className="input-dark" value={config.hero?.statsOfflineText || ""} onChange={(e) => updateConfig("hero", "statsOfflineText", e.target.value)} /></div>
          </div>
        </div>
      )}

      {activeTab === "model" && (
        <>
          <div className="card">
            <div className="section-title"><Type className="w-4 h-4" /> 基础文案 (拆分修改)</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-xs text-gray-400">标题前缀 (白字)</label><input type="text" className="input-dark" value={config.model?.titlePrefix || "PROJECT"} onChange={(e) => updateConfig("model", "titlePrefix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">标题后缀 (蓝字)</label><input type="text" className="input-dark" value={config.model?.titleSuffix || "_DATA"} onChange={(e) => updateConfig("model", "titleSuffix", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">同步率文案</label><input type="text" className="input-dark" value={config.model?.syncRate || "SYNC_RATE: 100%"} onChange={(e) => updateConfig("model", "syncRate", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">缩略图占位文案</label><input type="text" className="input-dark" value={config.model?.facePlaceholder || ""} onChange={(e) => updateConfig("model", "facePlaceholder", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">立绘占位标题</label><input type="text" className="input-dark" value={config.model?.imagePlaceholderTitle || ""} onChange={(e) => updateConfig("model", "imagePlaceholderTitle", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">立绘缺图提示</label><input type="text" className="input-dark" value={config.model?.imageMissingText || ""} onChange={(e) => updateConfig("model", "imageMissingText", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><Image className="w-4 h-4" /> 表情立绘 (Expressions)</div>
            <p className="text-xs text-gray-400 mb-4">
              每个表情两张图：脸部小图（左侧缩略，放 <code>pic/face/</code>）+ 立绘大图（右侧大图，放 <code>pic/full/</code>）。建议共 6 个表情。
            </p>
            <div className="grid gap-4">
              {(config.model?.expressions || []).map((exp, i) => (
                <div key={i} className="bg-(--mia-cream-soft)/70 border border-(--mia-warm-grey)/40 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono w-8">#{i + 1}</span>
                    <input type="text" className="input-dark w-40 text-sm" placeholder="表情名称" value={exp.id} onChange={(e) => updateArray("model", "expressions", i, "id", e.target.value)} />
                    <button type="button" className="ml-auto text-red-400 hover:text-red-500" onClick={() => removeArrayItem("model", "expressions", i)} title="删除该表情">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid gap-2 pl-10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">脸部小图</span>
                      <input type="text" className="input-dark flex-1 text-sm" placeholder="pic/face/..." value={exp.face} onChange={(e) => updateArray("model", "expressions", i, "face", e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16">立绘大图</span>
                      <input type="text" className="input-dark flex-1 text-sm" placeholder="pic/full/..." value={exp.full} onChange={(e) => updateArray("model", "expressions", i, "full", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 flex items-center gap-2 px-3 py-2 text-sm rounded border border-(--mia-gold)/50 text-(--mia-gold-deep) hover:bg-(--mia-gold)/10"
              onClick={() => addArrayItem("model", "expressions", { id: "", face: "", full: "" })}
            >
              <Plus className="w-4 h-4" /> 添加表情
            </button>
          </div>
        </>
      )}

      {activeTab === "live" && (
        <>
          <div className="card">
            <div className="section-title"><Radio className="w-4 h-4" /> 直播信息标题</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-xs text-gray-400">板块标题</label><input type="text" className="input-dark" value={config.live?.title || ""} onChange={(e) => updateConfig("live", "title", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">直播间号</label><input type="text" className="input-dark" value={config.live?.roomId || ""} onChange={(e) => updateConfig("live", "roomId", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">房间号前缀文字</label><input type="text" className="input-dark" value={config.live?.roomPrefix || ""} onChange={(e) => updateConfig("live", "roomPrefix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">直播中文案</label><input type="text" className="input-dark" value={config.live?.liveNowText || ""} onChange={(e) => updateConfig("live", "liveNowText", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">离线文案</label><input type="text" className="input-dark" value={config.live?.offlineText || ""} onChange={(e) => updateConfig("live", "offlineText", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">时间表标题</label><input type="text" className="input-dark" value={config.live?.scheduleTitle || ""} onChange={(e) => updateConfig("live", "scheduleTitle", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">点歌规则标题</label><input type="text" className="input-dark" value={config.live?.rulesTitle || ""} onChange={(e) => updateConfig("live", "rulesTitle", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><Calendar className="w-4 h-4" /> 时间表文案</div>
            <div className="grid gap-2">
              <div><label className="text-xs text-gray-400">早场文案</label><input type="text" className="input-dark" placeholder="早场: 10:00 - 13:00" value={config.live?.schedule?.morning || ""} onChange={(e) => updateNested("live", "schedule", "morning", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">晚场文案</label><input type="text" className="input-dark" placeholder="晚场: 17:00 - 20:00" value={config.live?.schedule?.evening || ""} onChange={(e) => updateNested("live", "schedule", "evening", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">休息日文案 (例如: 周一休)</label><input type="text" className="input-dark" placeholder="周一休" value={config.live?.schedule?.off || ""} onChange={(e) => updateNested("live", "schedule", "off", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><List className="w-4 h-4" /> 点歌规则 (列表)</div>
            <div className="space-y-2 mb-2">
              {(config.live?.rules || []).map((rule, i) => (
                <div key={i} className="flex gap-2 items-center bg-(--mia-cream-soft)/70 border border-(--mia-warm-grey)/40 p-2 rounded">
                  <span className="text-xs font-mono text-gray-500">{i + 1}.</span>
                  <input type="text" className="input-dark flex-1" value={rule} onChange={(e) => updateArraySimple("live", "rules", i, e.target.value)} />
                  <button onClick={() => removeArrayItem("live", "rules", i)} className="delete-btn"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem("live", "rules", "新规则")} className="text-xs bg-(--mia-gold)/15 text-(--mia-gold-deep) border border-(--mia-gold)/40 px-3 py-1.5 rounded hover:bg-(--mia-gold)/25 transition flex items-center gap-1"><Plus className="w-3 h-3" /> 添加规则</button>
          </div>
          <div className="card">
            <div className="section-title"><Link className="w-4 h-4" /> 外部链接按钮</div>
            <div className="text-xs text-gray-400 mb-3">格式：按钮文案 / 链接地址 / 颜色 / 图标</div>
            <div className="space-y-2">
              {(config.live?.links || []).map((l, i) => (
                <div key={i} className="flex gap-2 bg-(--mia-cream-soft)/70 border border-(--mia-warm-grey)/40 p-3 rounded">
                  <input type="text" className="input-dark w-32 text-sm" placeholder="按钮文案" value={l.title} onChange={(e) => updateArray("live", "links", i, "title", e.target.value)} />
                  <input type="text" className="input-dark flex-1 text-sm" placeholder="https://example.com" value={l.url} onChange={(e) => updateArray("live", "links", i, "url", e.target.value)} />
                  <select className="input-dark w-24" value={l.color} onChange={(e) => updateArray("live", "links", i, "color", e.target.value)}>
                    <option value="gold">圣金</option><option value="blush">浅樱</option><option value="ink">深墨</option>
                  </select>
                  <select className="input-dark w-28" value={l.icon} onChange={(e) => updateArray("live", "links", i, "icon", e.target.value)}>
                    <option value="Radio">直播 Radio</option>
                    <option value="User">主页 User</option>
                    <option value="Mail">投信 Mail</option>
                    <option value="Group">群组 Group</option>
                    <option value="LogoQq">QQ Logo</option>
                    <option value="Music">音乐 Music</option>
                    <option value="Video">视频 Video</option>
                    <option value="Sparkles">星光 Sparkles</option>
                    <option value="Cat">天使猫 Cat</option>
                    <option value="Cloud">云 Cloud</option>
                    <option value="Church">教堂 Church</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "video" && (
        <div className="card">
          <div className="section-title"><Film className="w-4 h-4" /> 视频墙配置 (拆分修改)</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="text-xs text-gray-400">标题前缀 (白字)</label><input type="text" className="input-dark" value={config.gallery?.titlePrefix || "VISUAL"} onChange={(e) => updateConfig("gallery", "titlePrefix", e.target.value)} /></div>
            <div><label className="text-xs text-gray-400">标题后缀 (蓝字)</label><input type="text" className="input-dark" value={config.gallery?.titleSuffix || "_ARCHIVE"} onChange={(e) => updateConfig("gallery", "titleSuffix", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-400">下方滚动文字</label><input type="text" className="input-dark" value={config.gallery?.scrollText || "SCROLL TO EXPLORE >>>"} onChange={(e) => updateConfig("gallery", "scrollText", e.target.value)} /></div>
            <div className="md:col-span-2 mt-4"><label className="text-xs text-gray-400">API 地址 (需部署 Vercel 脚本)</label><input type="text" className="input-dark" value={config.api?.bilibili || ""} onChange={(e) => updateConfig("api", "bilibili", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-400">视频日期前缀 (如: DATE //)</label><input type="text" className="input-dark" value={config.gallery?.datePrefix || ""} onChange={(e) => updateConfig("gallery", "datePrefix", e.target.value)} /></div>
          </div>
        </div>
      )}

      {/* games tab removed in Mia (no mini-games) */}

      {activeTab === "footer" && (
        <div className="card">
          <div className="section-title"><Type className="w-4 h-4" /> 底部版权</div>
          <input type="text" className="input-dark" value={config.footer?.text || ""} onChange={(e) => updateConfig("footer", "text", e.target.value)} />
        </div>
      )}

      {activeTab === "mail" && (
        <>
          <div className="card">
            <div className="section-title"><Mail className="w-4 h-4" /> 主站访客入口（左下浮动菜单）</div>
            <div className="text-xs text-gray-500 mb-4">这些文字显示在主页左下角的 Speed Dial 发信按钮上，访客打开主站就能看到。</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-gray-400">按钮标题</label>
                <input type="text" className="input-dark" placeholder="发信箱" value={config.mail?.entryLabel || ""} onChange={(e) => updateConfig("mail", "entryLabel", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Tooltip（开启态）</label>
                <input type="text" className="input-dark" placeholder="匿名交付给 Mia" value={config.mail?.entryHint || ""} onChange={(e) => updateConfig("mail", "entryHint", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Tooltip（发信箱关闭时）</label>
                <input type="text" className="input-dark" placeholder="发信箱暂时关闭" value={config.mail?.entryHintDisabled || ""} onChange={(e) => updateConfig("mail", "entryHintDisabled", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title"><Type className="w-4 h-4" /> 发信弹窗主体文案</div>
            <div className="text-xs text-gray-500 mb-4">这些文字显示在访客点开发信弹窗后，看到的表单卡片上。</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-gray-400">卡片标题</label>
                <input type="text" className="input-dark" placeholder="MAIL_BOX" value={config.mail?.senderTitle || ""} onChange={(e) => updateConfig("mail", "senderTitle", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">副标题 / 招呼语</label>
                <input type="text" className="input-dark" placeholder="在云端教堂御前，把想对 Mia 说的话匿名上交" value={config.mail?.senderTagline || ""} onChange={(e) => updateConfig("mail", "senderTagline", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">状态徽章（开启）</label>
                <input type="text" className="input-dark" placeholder="ONLINE" value={config.mail?.statusOpen || ""} onChange={(e) => updateConfig("mail", "statusOpen", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">状态徽章（关闭）</label>
                <input type="text" className="input-dark" placeholder="OFFLINE" value={config.mail?.statusPaused || ""} onChange={(e) => updateConfig("mail", "statusPaused", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">发送成功提示</label>
                <input type="text" className="input-dark" placeholder="已送达云端教堂 · Mia 会在直播时读到 ~" value={config.mail?.successMessage || ""} onChange={(e) => updateConfig("mail", "successMessage", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title"><Pencil className="w-4 h-4" /> 输入框占位符</div>
            <div className="text-xs text-gray-500 mb-4">访客未填写内容时，输入框里的灰色提示文字。</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">正文输入框</label>
                <input type="text" className="input-dark" placeholder="在这里写下你想说的话…" value={config.mail?.placeholderText || ""} onChange={(e) => updateConfig("mail", "placeholderText", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">称呼输入框</label>
                <input type="text" className="input-dark" placeholder="称呼（可选）" value={config.mail?.placeholderNickname || ""} onChange={(e) => updateConfig("mail", "placeholderNickname", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">链接输入框</label>
                <input type="text" className="input-dark" placeholder="B站 / X / 外站链接（可选）" value={config.mail?.placeholderLink || ""} onChange={(e) => updateConfig("mail", "placeholderLink", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title"><Radio className="w-4 h-4" /> 关闭态文案</div>
            <div className="text-xs text-gray-500 mb-4">当后台 <code className="text-(--mia-gold-deep) font-mono">/mail</code> 页面把发信箱开关关闭时，访客会看到的提示文字。</div>
            <div className="grid gap-4">
              <div>
                <label className="text-xs text-gray-400">弹窗顶部禁用横幅</label>
                <input type="text" className="input-dark" placeholder="发信箱暂时关闭，稍后再来投递吧 ~" value={config.mail?.disabledBanner || ""} onChange={(e) => updateConfig("mail", "disabledBanner", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">表单内说明文字</label>
                <input type="text" className="input-dark" placeholder="OFFLINE · 发信箱暂时关闭，稍后再来投递吧 ~" value={config.mail?.pausedMessage || ""} onChange={(e) => updateConfig("mail", "pausedMessage", e.target.value)} />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "songs" && (
        <>
          <div className="card">
            <div className="section-title">界面标题设置</div>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div><label className="text-xs text-gray-400">标题前缀 (白字)</label><input type="text" className="input-dark" value={config.song_ui?.titlePrefix || "SONG"} onChange={(e) => updateConfig("song_ui", "titlePrefix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">标题后缀 (蓝字)</label><input type="text" className="input-dark" value={config.song_ui?.titleSuffix || "_DATABASE"} onChange={(e) => updateConfig("song_ui", "titleSuffix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">数量前缀</label><input type="text" className="input-dark" value={config.song_ui?.serverText || "SERVER:"} onChange={(e) => updateConfig("song_ui", "serverText", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">数量单位</label><input type="text" className="input-dark" value={config.song_ui?.songsUnit || ""} onChange={(e) => updateConfig("song_ui", "songsUnit", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">搜索框提示文字</label><input type="text" className="input-dark" value={config.song_ui?.searchPlaceholder || "SEARCH..."} onChange={(e) => updateConfig("song_ui", "searchPlaceholder", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">随机按钮文字</label><input type="text" className="input-dark" value={config.song_ui?.randomizeBtn || "RANDOMIZE"} onChange={(e) => updateConfig("song_ui", "randomizeBtn", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">复制提示前缀</label><input type="text" className="input-dark" value={config.song_ui?.copiedPrefix || ""} onChange={(e) => updateConfig("song_ui", "copiedPrefix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">复制命令前缀</label><input type="text" className="input-dark" value={config.song_ui?.copyCommandPrefix || ""} onChange={(e) => updateConfig("song_ui", "copyCommandPrefix", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">无数据提示</label><input type="text" className="input-dark" value={config.song_ui?.emptyText || ""} onChange={(e) => updateConfig("song_ui", "emptyText", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">已复制标识</label><input type="text" className="input-dark" value={config.song_ui?.copiedTag || ""} onChange={(e) => updateConfig("song_ui", "copiedTag", e.target.value)} /></div>
            </div>
          </div>
          <div className="card bg-(--mia-cream-soft)/85 border-dashed border-(--mia-gold)/40">
            <div className="section-title text-(--mia-gold-deep)"><Music className="w-4 h-4" /> 歌单分类设置 (Style Config)</div>
            <div className="space-y-2 mb-4">
              {(config.song_ui?.categories || []).map((cat, i) => (
                <div key={i} className="flex gap-2 items-center bg-(--mia-cream)/80 p-2 rounded border border-(--mia-warm-grey)/40">
                  <span className="text-xs text-gray-500 w-6 text-center">{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveCategory(i, -1)} disabled={i === 0} className="action-btn" style={i === 0 ? { opacity: 0.3 } : {}}><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => moveCategory(i, 1)} disabled={i === (config.song_ui?.categories?.length || 0) - 1} className="action-btn" style={i === (config.song_ui?.categories?.length || 0) - 1 ? { opacity: 0.3 } : {}}><ArrowDown className="w-3 h-3" /></button>
                  </div>
                  <input type="text" className="input-dark w-24 text-xs font-mono" value={cat.id} onChange={(e) => updateArray("song_ui", "categories", i, "id", e.target.value)} placeholder="ID (key)" />
                  <input type="text" className="input-dark flex-1 text-xs" value={cat.label} onChange={(e) => updateArray("song_ui", "categories", i, "label", e.target.value)} placeholder="Label" />
                  <button onClick={() => removeCategory(i)} className="delete-btn"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addCategory} className="w-full py-2 bg-(--mia-gold)/15 text-(--mia-gold-deep) border border-(--mia-gold)/40 text-xs font-bold rounded hover:bg-(--mia-gold)/25 transition flex items-center justify-center gap-2"><Plus className="w-3 h-3" /> 添加新风格 (Add Style)</button>
          </div>
          <div className="card">
            <div className="section-title flex justify-between"><span>歌单管理</span><div className="text-xs text-gray-400 font-normal">共 {songData.length} 首</div></div>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input type="text" className="input-dark pl-9" placeholder="快速搜寻歌名或歌手..." onInput={(e) => {
                const q = (e.target as HTMLInputElement).value.toLowerCase().trim();
                const rows = document.querySelectorAll("#song-list-container > div");
                rows.forEach((row) => {
                  const inputs = row.querySelectorAll("input");
                  if (inputs.length >= 2) {
                    const name = (inputs[0] as HTMLInputElement).value.toLowerCase();
                    const artist = (inputs[1] as HTMLInputElement).value.toLowerCase();
                    (row as HTMLElement).style.display = name.includes(q) || artist.includes(q) ? "" : "none";
                  }
                });
              }} />
            </div>
            <div className="flex gap-2 mb-4">
              <button onClick={addSongRow} className="bg-green-600 px-3 py-1 rounded text-xs font-bold hover:bg-green-500">+ 添加一行</button>
              <button onClick={() => alert("请直接修改输入框内容，保存即可")} className="bg-blue-600 px-3 py-1 rounded text-xs font-bold hover:bg-blue-500">? 如何使用</button>
            </div>
            <div className="h-[600px] min-h-[300px] resize-y overflow-y-auto custom-scrollbar space-y-2 border border-white/5 rounded p-2" id="song-list-container">
              {songData.map((s, i) => {
                const assignableCategories = config.song_ui?.categories?.filter((c) => c.id !== "all") || [];
                return (
                  <div key={i} className="flex gap-2 items-center bg-(--mia-cream-soft)/70 border border-(--mia-warm-grey)/40 p-2 rounded group">
                    <span className="text-xs text-gray-500 w-8 text-center">{i + 1}</span>
                    <select className="input-dark w-24 text-xs" value={s.category} onChange={(e) => updateSong(i, "category", e.target.value)}>
                      {assignableCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                      {!assignableCategories.find((c) => c.id === s.category) && <option value={s.category} style={{ color: "red" }}>未知({s.category})</option>}
                    </select>
                    <input type="text" className="input-dark flex-1 text-sm" value={s.name} onChange={(e) => updateSong(i, "name", e.target.value)} placeholder="歌名" />
                    <input type="text" className="input-dark w-1/3 text-sm" value={s.artist} onChange={(e) => updateSong(i, "artist", e.target.value)} placeholder="歌手" />
                    <button onClick={() => removeSong(i)} className="text-red-500 hover:text-red-400 p-1 opacity-50 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <div className="section-title">批量添加 (Excel模式)</div>
            <textarea id="bulk-songs" className="input-dark h-32 font-mono text-xs" placeholder="歌名 歌手 (每行一首，默认分类为列表第一个非All分类，需手动调整)" />
            <button onClick={parseBulkSongs} className="mt-2 bg-purple-600 px-4 py-2 rounded text-sm font-bold hover:bg-purple-500">批量导入</button>
          </div>
        </>
      )}

      {/* hidden + gacha tabs removed in Mia */}

      {activeTab === "system" && (
        <>
          <div className="card">
            <div className="section-title"><Bell className="w-4 h-4" /> 系统提示</div>
            <div className="grid gap-4">
              <div><label className="text-xs text-gray-400">配置更新 Toast</label><input type="text" className="input-dark" value={config.system?.configUpdatedToast || ""} onChange={(e) => updateConfig("system", "configUpdatedToast", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><Type className="w-4 h-4" /> SEO / 分享文案</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-xs text-gray-400">页面标题</label><input type="text" className="input-dark" value={config.seo?.title || ""} onChange={(e) => updateConfig("seo", "title", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">站点名</label><input type="text" className="input-dark" value={config.seo?.siteName || ""} onChange={(e) => updateConfig("seo", "siteName", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">页面描述</label><textarea className="input-dark h-24" value={config.seo?.description || ""} onChange={(e) => updateConfig("seo", "description", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">关键词（逗号或换行分隔）</label><textarea className="input-dark h-24" value={(config.seo?.keywords || []).join("\n")} onChange={(e) => updateConfig("seo", "keywords", e.target.value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))} /></div>
              <div><label className="text-xs text-gray-400">歌单结构化数据标题</label><input type="text" className="input-dark" value={config.seo?.playlistName || ""} onChange={(e) => updateConfig("seo", "playlistName", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">歌单结构化数据描述</label><input type="text" className="input-dark" value={config.seo?.playlistDescription || ""} onChange={(e) => updateConfig("seo", "playlistDescription", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><Type className="w-4 h-4" /> PWA 安装 / 更新提示</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-xs text-gray-400">Manifest 名称</label><input type="text" className="input-dark" value={config.pwa?.manifestName || ""} onChange={(e) => updateConfig("pwa", "manifestName", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">Manifest 短名称</label><input type="text" className="input-dark" value={config.pwa?.manifestShortName || ""} onChange={(e) => updateConfig("pwa", "manifestShortName", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">Manifest 描述</label><input type="text" className="input-dark" value={config.pwa?.manifestDescription || ""} onChange={(e) => updateConfig("pwa", "manifestDescription", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">安装卡片标题</label><input type="text" className="input-dark" value={config.pwa?.installTitle || ""} onChange={(e) => updateConfig("pwa", "installTitle", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">安装按钮</label><input type="text" className="input-dark" value={config.pwa?.installButton || ""} onChange={(e) => updateConfig("pwa", "installButton", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">安装说明（安卓/桌面）</label><input type="text" className="input-dark" value={config.pwa?.installDescription || ""} onChange={(e) => updateConfig("pwa", "installDescription", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">安装说明（iOS）</label><input type="text" className="input-dark" value={config.pwa?.installIosDescription || ""} onChange={(e) => updateConfig("pwa", "installIosDescription", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">iOS 步骤一</label><input type="text" className="input-dark" value={config.pwa?.iosStepOne || ""} onChange={(e) => updateConfig("pwa", "iosStepOne", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">iOS 步骤二</label><input type="text" className="input-dark" value={config.pwa?.iosStepTwo || ""} onChange={(e) => updateConfig("pwa", "iosStepTwo", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">更新标题</label><input type="text" className="input-dark" value={config.pwa?.updateTitle || ""} onChange={(e) => updateConfig("pwa", "updateTitle", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">更新按钮</label><input type="text" className="input-dark" value={config.pwa?.updateButton || ""} onChange={(e) => updateConfig("pwa", "updateButton", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">更新说明</label><input type="text" className="input-dark" value={config.pwa?.updateDescription || ""} onChange={(e) => updateConfig("pwa", "updateDescription", e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title"><Type className="w-4 h-4" /> 离线页 / 错误页</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="text-xs text-gray-400">离线页 Metadata 标题</label><input type="text" className="input-dark" value={config.offline?.metadataTitle || ""} onChange={(e) => updateConfig("offline", "metadataTitle", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">离线页 Metadata 描述</label><input type="text" className="input-dark" value={config.offline?.metadataDescription || ""} onChange={(e) => updateConfig("offline", "metadataDescription", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">离线页标题</label><input type="text" className="input-dark" value={config.offline?.title || ""} onChange={(e) => updateConfig("offline", "title", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">离线页状态文字</label><input type="text" className="input-dark" value={config.offline?.statusText || ""} onChange={(e) => updateConfig("offline", "statusText", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">离线页说明</label><textarea className="input-dark h-24" value={config.offline?.body || ""} onChange={(e) => updateConfig("offline", "body", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">离线页重试按钮</label><input type="text" className="input-dark" value={config.offline?.retryButton || ""} onChange={(e) => updateConfig("offline", "retryButton", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">错误页标题</label><input type="text" className="input-dark" value={config.errors?.title || ""} onChange={(e) => updateConfig("errors", "title", e.target.value)} /></div>
              <div><label className="text-xs text-gray-400">错误页重试按钮</label><input type="text" className="input-dark" value={config.errors?.retryText || ""} onChange={(e) => updateConfig("errors", "retryText", e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-400">错误页说明</label><input type="text" className="input-dark" value={config.errors?.message || ""} onChange={(e) => updateConfig("errors", "message", e.target.value)} /></div>
            </div>
          </div>
        </>
      )}

      {activeTab === "videos" && (
        <div className="card">
          <div className="section-title"><Film className="w-4 h-4" /> 视频播放区标题</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><label className="text-xs text-gray-400">本地视频标题</label><input type="text" className="input-dark" placeholder="✚ MIA · ARCHIVE ✚" value={config.videos?.archiveTitle || ""} onChange={(e) => updateConfig("videos", "archiveTitle", e.target.value)} /></div>
          </div>
        </div>
      )}

      {activeTab === "assets" && (() => {
        const files = (assetsCache[currentAssetFolder] || []).sort((a, b) => {
          const comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
          return assetSortOrder === "asc" ? comparison : -comparison;
        });
        return (
          <div className="card">
            <div className="section-title flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4" /> 资源管理器</span>
                <div className="flex bg-(--mia-cream)/80 border border-(--mia-warm-grey)/40 rounded p-1">
                  <button onClick={() => fetchAssets("memes", adminPassword)} className={`px-3 py-1 text-xs rounded transition ${currentAssetFolder === "memes" ? "bg-(--mia-gold) text-(--mia-cream) font-bold" : "text-(--mia-warm-grey-deep) hover:text-(--mia-ink)"}`}>memes (表情包)</button>
                  <button onClick={() => fetchAssets("pic", adminPassword)} className={`px-3 py-1 text-xs rounded transition ${currentAssetFolder === "pic" ? "bg-(--mia-gold) text-(--mia-cream) font-bold" : "text-(--mia-warm-grey-deep) hover:text-(--mia-ink)"}`}>pic (图片)</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleAssetSort} className="bg-(--mia-cream)/80 hover:bg-(--mia-gold)/15 border border-(--mia-warm-grey)/40 px-3 py-2 rounded text-(--mia-ink) text-xs font-bold flex items-center gap-2">
                  {assetSortOrder === "asc" ? <ArrowDownAZ className="w-4 h-4" /> : <ArrowUpAZ className="w-4 h-4" />}
                  {assetSortOrder === "asc" ? "A-Z" : "Z-A"}
                </button>
                <label className="cursor-pointer bg-(--mia-gold) hover:bg-(--mia-gold-deep) text-(--mia-cream) px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" /> 上传文件
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadFile(e.currentTarget)} />
                </label>
                <button onClick={() => fetchAssets(currentAssetFolder, adminPassword)} className="bg-(--mia-cream)/80 hover:bg-(--mia-gold)/15 border border-(--mia-warm-grey)/40 p-2 rounded text-(--mia-ink)"><RefreshCw className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-4 font-mono">当前路径: /{currentAssetFolder}/ (共 {files.length} 个文件)</div>
            <div className="asset-grid max-h-[600px] overflow-y-auto custom-scrollbar p-1">
              {files.length > 0 ? files.map((f) => (
                <div key={f.name} className="asset-item">
                  <div className="asset-img-box"><img src={`${f.path}?t=${f.time}`} className="asset-img" loading="lazy" alt={f.name} /></div>
                  <div className="asset-info truncate" title={f.name}>{f.name}</div>
                  <div className="asset-actions">
                    <button onClick={() => copyPath(f.path)} className="text-(--mia-ink) hover:text-(--mia-gold-deep)" title="复制路径"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => renameFile(f.name)} className="text-(--mia-ink) hover:text-(--mia-blush)" title="重命名"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteFile(f.name)} className="text-(--mia-ink) hover:text-(--mia-rose)" title="删除"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )) : <div className="col-span-full text-center text-gray-500 py-10">文件夹为空</div>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
