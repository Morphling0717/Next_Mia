"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ErrorTriangleIcon as AlertTriangle,
  FolderIcon as Archive,
  CopyIcon,
  EditIcon as PencilLine,
  RefreshIcon as Power,
} from "tdesign-icons-react";
import {
  DEFAULT_POSTER_CONFIG,
  WindChimeAdminPanel,
  WindChimeBlocklistPanel,
  WindChimeQrCard,
  WindChimeQrPosterEditor,
} from "@windchime/embed";
import type {
  WindChimeQrPosterConfig,
} from "@windchime/embed";
import "@windchime/embed/styles/windchime.css";
import { useWindChimeTopics, useWindChimeInbox, useWindChimeBlocklist, useWindChimeSettings } from "@windchime/embed/react";
import { mailClient } from "@/lib/windchime-client";
import { MailConnectionKeys } from "@/components/mail/MailConnectionKeys";
import {
  mailAdminTheme,
  mailBlocklistTheme,
  mailPosterEditorTheme,
  mailQrTheme,
} from "@/components/mail/mail-theme";
import { BlockedTermsPanel } from "@/components/mail/BlockedTermsPanel";
import {
  FlaggedMailPanel,
} from "@/components/mail/FlaggedMailPanel";
import { MailTopicTabs } from "@/components/mail/MailTopicTabs";
import { NewTopicModal } from "@/components/mail/NewTopicModal";
import { EditTopicModal } from "@/components/mail/EditTopicModal";
import { ArchivedTopicsDrawer } from "@/components/mail/ArchivedTopicsDrawer";
import { ArchiveConfirmModal } from "@/components/mail/ArchiveConfirmModal";
import type { Topic } from "@/components/mail/mail-topic-types";
import { formatBeijing } from "@/components/mail/mail-time";
import { fetchBilibiliData } from "@/lib/bilibili-api";

export default function MailPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdChecking, setPwdChecking] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const refreshMailSession = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/session", { cache: "no-store" });
      const j = (await r.json()) as { mail?: boolean };
      setIsAuthed(Boolean(j.mail));
    } catch {
      setIsAuthed(false);
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshMailSession();
    });
  }, [refreshMailSession]);

  const onSubmitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdInput) return;
    setPwdChecking(true);
    setPwdError(null);
    try {
      const ok = await loginMailSession(pwdInput);
      if (ok) {
        setIsAuthed(true);
        setPwdInput("");
      } else {
        setPwdError("ACCESS_DENIED · 密码错误");
      }
    } finally {
      setPwdChecking(false);
    }
  };

  const onLogout = async () => {
    setIsAuthed(false);
    setPwdInput("");
    await fetch("/api/auth/session", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: "mail" }),
    }).catch(() => {});
  };

  return (
    <>
      {/* 奶油教堂背景 + 两团圣金/暖肤光斑 + 隐约金线网格 */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-(--mia-cream)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(196,169,110,0.22),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(232,201,184,0.2),transparent_50%)]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(138,111,58,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(138,111,58,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
        <header className="flex flex-col items-center text-center">
          <div className="mb-2 font-display text-[11px] tracking-[0.4em] text-(--mia-gold-deep)/85">
            星眠MIA · MAIL · CONSOLE
          </div>
          <h1 className="font-display text-4xl font-black tracking-[0.15em] text-(--mia-ink) drop-shadow-[0_4px_12px_rgba(196,169,110,0.45)] sm:text-5xl">
            MAIL_BOX
          </h1>
          <p className="mt-3 font-display text-sm text-(--mia-gold-deep)/85">
            Mia 的匿名来信都挂在这里
          </p>
          {isAuthed && (
            <button
              type="button"
              onClick={() => void onLogout()}
              className="mt-5 rounded-md border border-(--mia-gold)/45 bg-(--mia-cream-soft)/85 px-4 py-1.5 font-display text-xs text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/12"
            >
              [ LOGOUT ]
            </button>
          )}
        </header>

        {authChecking ? (
          <div className="mx-auto w-full max-w-md rounded-2xl border border-(--mia-gold)/35 bg-(--mia-cream-soft)/90 p-8 text-center font-display text-xs tracking-[0.2em] text-(--mia-gold-deep)">
            VERIFYING...
          </div>
        ) : !isAuthed ? (
          <PasswordGate
            value={pwdInput}
            onChange={setPwdInput}
            onSubmit={onSubmitPwd}
            error={pwdError}
            loading={pwdChecking}
          />
        ) : (
          <MailContent onUnauthorized={() => void onLogout()} />
        )}
      </main>
    </>
  );
}

function PasswordGate({
  value,
  onChange,
  onSubmit,
  error,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md rounded-2xl border border-(--mia-gold)/45 bg-(--mia-cream-soft)/95 p-8 shadow-[0_18px_50px_-26px_rgba(196,169,110,0.4)] backdrop-blur-xl"
    >
      <label
        htmlFor="mail-pwd"
        className="mb-2 block font-display text-xs uppercase tracking-[0.25em] text-(--mia-gold-deep)"
      >
        ADMIN_KEY
      </label>
      <input
        id="mail-pwd"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        autoFocus
        className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-5 py-3 font-display text-sm text-(--mia-ink) placeholder:text-(--mia-warm-grey-deep)/70 outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
        placeholder="请输入管理员密码"
      />
      {error && (
        <p className="mt-3 rounded-lg border border-(--mia-rose)/55 bg-(--mia-rose)/10 px-4 py-2 font-display text-xs text-(--mia-rose)">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !value}
        className="mt-5 w-full rounded-lg border border-(--mia-gold-deep) bg-(--mia-gold) px-5 py-3 font-display text-sm font-bold tracking-[0.2em] text-(--mia-cream) shadow-[0_8px_24px_-12px_rgba(138,111,58,0.55)] transition hover:bg-(--mia-gold-deep) hover:shadow-[0_10px_28px_-10px_rgba(138,111,58,0.65)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "VERIFYING..." : "ENTER"}
      </button>
    </form>
  );
}

async function loginMailSession(pwd: string): Promise<boolean> {
  try {
    const r = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: "mail", password: pwd }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

function MailContent({
  onUnauthorized,
}: {
  onUnauthorized: () => void;
}) {
  const settings = useWindChimeSettings(mailClient, { pollIntervalMs: 3000 });
  const blockedTermsEnabled = settings.data?.blockedTermsEnabled === true;
  const topicsApi = useWindChimeTopics(mailClient, { includeArchived: false, pollIntervalMs: 3000 });
  const topics = topicsApi.items.map(topic => blockedTermsEnabled ? topic : { ...topic, flaggedCount: 0 });
  const [selectedTopicId, setActiveTopicId] = useState("default");
  const activeTopicId = topics.length && !topics.some(topic => topic.id === selectedTopicId) ? "default" : selectedTopicId;
  const inbox = useWindChimeInbox(mailClient, { topicId: activeTopicId, pollIntervalMs: 3000 });
  const flaggedInbox = useWindChimeInbox(mailClient, { topicId: activeTopicId, filter: "flagged", enabled: blockedTermsEnabled, pollIntervalMs: 3000 });
  const blocked = useWindChimeBlocklist(mailClient, { pollIntervalMs: 3000 });
  const items = blockedTermsEnabled ? inbox.items : inbox.items.map(item => ({ ...item, isFlagged: false }));
  const counts = inbox.counts;
  const loading = inbox.isLoading;
  const listError = inbox.error?.message || inbox.mutationError?.message || null;
  const blocklist = blocked.items;
  const blLoading = blocked.isLoading;
  const blError = blocked.error?.message || blocked.mutationError?.message || null;
  const enabledSaving = topicsApi.pending;
  const enabledError = topicsApi.mutationError?.message;
  const [actionError, setActionError] = useState<string | null>(null);
  const topicsError = topicsApi.error?.message || actionError;
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showArchivedDrawer, setShowArchivedDrawer] = useState(false);
  const [archiveConfirmTopic, setArchiveConfirmTopic] = useState<Topic | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const archiveBusy = topicsApi.pending;
  const [copiedToast, setCopiedToast] = useState(false);
  const authHeader = useMemo<Record<string, string>>(() => ({}), []);
  const activeTopic = topics.find(topic => topic.id === activeTopicId) ?? null;
  const editingTopic = topics.find(topic => topic.id === editingTopicId) ?? null;
  const reload = inbox.reload;
  const reloadTopics = topicsApi.reload;
  const reloadBlocklist = blocked.reload;

  useEffect(() => {
    window.addEventListener("mail:unauthorized", onUnauthorized);
    return () => window.removeEventListener("mail:unauthorized", onUnauthorized);
  }, [onUnauthorized]);
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topicId");
    if (topic && topic.length <= 200) queueMicrotask(() => setActiveTopicId(topic));
  }, []);

  const toggleCurrentTopicEnabled = async (enabled: boolean) => {
    if (activeTopic) await topicsApi.update(activeTopic.id, { isEnabled: enabled }).catch(() => {});
  };
  const onDelete = async (id: string) => { await inbox.deleteMessage(id); };
  const onToggleRead = async (id: string, isRead: boolean) => { await inbox.update(id, { isRead }); };
  const onToggleFavorite = async (id: string, isFavorited: boolean) => { await inbox.update(id, { isFavorited }); };
  const onBlockSender = async (id: string) => { await inbox.blockSender(id); };
  const onBatchDelete = async (ids: string[]) => { await inbox.batch("delete", ids); };
  const onBatchMarkRead = async (ids: string[]) => { await inbox.batch("markRead", ids); };
  const onUnblock = async (hash: string) => { await blocked.unblock(hash); };
  const onCreatedTopic = (topic: Topic) => { setActiveTopicId(topic.id); void reloadTopics(); };
  const onUpdatedTopic = () => { setEditingTopicId(null); void reloadTopics(); };
  const onRestoredTopic = (topic: Topic) => { setActiveTopicId(topic.id); setShowArchivedDrawer(false); void reloadTopics(); };
  const performArchive = async (topic: Topic, markReadFirst: boolean) => {
    setActionError(null);
    try {
      await topicsApi.archive(topic.id, { markReadFirst });
      if (activeTopicId === topic.id) setActiveTopicId("default");
      setArchiveConfirmTopic(null);
    } catch (error) { setActionError(error instanceof Error ? error.message : "归档失败"); }
  };
  const handleArchiveIntent = (topic: Topic) => {
    if (topic.isDefault) return;
    if ((topic.unreadCount ?? 0) + (topic.flaggedCount ?? 0) > 0) setArchiveConfirmTopic(topic);
    else void performArchive(topic, false);
  };

  const onCopyShareLink = async () => {
    if (!activeTopic) return;
    const origin = window.location.origin;
    const url = activeTopic.isDefault
      ? origin
      : `${origin}/m/${activeTopic.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToast(true);
      window.setTimeout(() => setCopiedToast(false), 1500);
    } catch {
      alert(`请手动复制：${url}`);
    }
  };

  const shareUrl = useMemo(() => {
    if (!activeTopic || typeof window === "undefined") return "";
    const origin = window.location.origin;
    return activeTopic.isDefault ? origin : `${origin}/m/${activeTopic.slug}`;
  }, [activeTopic]);

  const [poster, setPoster] = useState<WindChimeQrPosterConfig>(() => ({
    ...DEFAULT_POSTER_CONFIG,
    heading: "给 Mia 匿名投一封信",
    body: "扫码发信，你的留言可能会在直播里被读到哦 ~",
  }));

  // 首次挂载时从 B 站 API 拉头像作为默认值（PosterEditor 已有 storageKey，
  // 会优先读 localStorage，所以这里仅在用户还没自定义头像时才填充）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await fetchBilibiliData("/api/bilibili");
        const face = d?.user?.face;
        if (!cancelled && face) {
          setPoster((p) => (p.avatarSrc ? p : { ...p, avatarSrc: face }));
        }
      } catch {
        /* 忽略：头像是增强项，不阻塞页面 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const inboxTitle = activeTopic
    ? `INBOX · ${activeTopic.title}`
    : "INBOX · 收件箱";
  const statusCaption = !activeTopic
    ? "加载中…"
    : activeTopic.isDefault
      ? activeTopic.isEnabled
        ? "常规信箱已开启，访客可正常投递。"
        : "常规信箱已关闭，主站入口变灰并禁止发送。"
      : activeTopic.isEnabled
        ? `「${activeTopic.title}」已开启，访客可通过 /m/${activeTopic.slug} 投信。`
        : `「${activeTopic.title}」暂停中，访客看到"活动暂停"提示。`;

  return (
    <div className="flex flex-col gap-10">
      {/* 主题 Tab 栏（方案 §6.1） */}
      <section>
        <MailTopicTabs
        showGlobalSettings={blockedTermsEnabled}
          topics={topics}
          activeTopicId={activeTopicId}
          onSwitch={setActiveTopicId}
          onOpenNewTopic={() => setShowNewTopicModal(true)}
          onOpenArchivedDrawer={() => setShowArchivedDrawer(true)}
          onScrollToGlobalSettings={() => {
            document
              .getElementById("global-settings")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onQuickArchive={(topicId) => {
            const t = topics.find((x) => x.id === topicId);
            if (t) handleArchiveIntent(t);
          }}
        />
        {topicsError && (
          <div className="mt-2 font-mono text-[11px] text-(--mia-rose)">
            {topicsError}
          </div>
        )}
      </section>

      {/* 当前主题 · 开关 / 归档 / 分享链接 */}
      {activeTopic && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--mia-gold)/45 bg-(--mia-cream-soft)/85 p-5 shadow-[0_14px_40px_-22px_rgba(196,169,110,0.32)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-3">
              <Power
                className="h-6 w-6 text-(--mia-gold-deep) drop-shadow-[0_2px_6px_rgba(196,169,110,0.45)]"
                aria-hidden
              />
              <div>
                <div className="font-display text-sm font-bold tracking-[0.12em] text-(--mia-ink)">
                  {activeTopic.title} · STATUS
                </div>
                <div className="mt-1 font-mono text-xs text-(--mia-gold-deep)/75">
                  {statusCaption}
                </div>
                {!activeTopic.isDefault && activeTopic.startsAt && activeTopic.endsAt && (
                  <div className="mt-0.5 font-mono text-[11px] text-(--mia-warm-grey-deep)">
                    活动期: {formatBeijing(activeTopic.startsAt)} ~{" "}
                    {formatBeijing(activeTopic.endsAt)}
                  </div>
                )}
                {enabledError && (
                  <div className="mt-1 font-mono text-xs text-(--mia-rose)">
                    {enabledError}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingTopicId(activeTopic.id)}
                className="flex items-center gap-1.5 rounded-lg border border-(--mia-gold)/45 bg-(--mia-cream)/80 px-3 py-1.5 font-display text-xs text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/15 hover:text-(--mia-ink)"
              >
                <PencilLine className="h-3.5 w-3.5" />
                编辑主题
              </button>

              <button
                type="button"
                onClick={onCopyShareLink}
                className="flex items-center gap-1.5 rounded-lg border border-(--mia-gold)/45 bg-(--mia-cream)/80 px-3 py-1.5 font-display text-xs text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/15 hover:text-(--mia-ink)"
                title={
                  activeTopic.isDefault
                    ? "复制主站链接"
                    : `复制 /m/${activeTopic.slug} 分享链接`
                }
              >
                <CopyIcon className="h-3.5 w-3.5" />
                {copiedToast ? "已复制 ✓" : "复制分享链接"}
              </button>

              {!activeTopic.isDefault && (
                <button
                  type="button"
                  onClick={() => handleArchiveIntent(activeTopic)}
                  className="flex items-center gap-1.5 rounded-lg border border-(--mia-rose)/45 bg-(--mia-cream)/80 px-3 py-1.5 font-display text-xs text-(--mia-rose) transition hover:bg-(--mia-rose)/12"
                >
                  <Archive className="h-3.5 w-3.5" />
                  归档主题
                </button>
              )}

              <button
                type="button"
                role="switch"
                aria-checked={activeTopic.isEnabled}
                disabled={enabledSaving}
                onClick={() => toggleCurrentTopicEnabled(!activeTopic.isEnabled)}
                className={
                  "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 " +
                  (activeTopic.isEnabled
                    ? "border-(--mia-gold-deep) bg-(--mia-gold) shadow-[0_4px_18px_-8px_rgba(196,169,110,0.6)]"
                    : "border-(--mia-warm-grey) bg-(--mia-warm-grey)/55")
                }
              >
                <span
                  className={
                    "inline-block h-6 w-6 transform rounded-full bg-(--mia-cream) shadow transition " +
                    (activeTopic.isEnabled ? "translate-x-7" : "translate-x-1")
                  }
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 外链安全提示（匿名访客可填链接，提醒主播谨防钓鱼） */}
      <section className="rounded-xl border border-(--mia-gold)/35 bg-(--mia-gold)/8 px-4 py-3 backdrop-blur">
        <div className="flex items-start gap-2 font-mono text-xs leading-relaxed">
          <AlertTriangle
            className="h-4 w-4 shrink-0 translate-y-0.5 text-(--mia-gold-deep)"
            aria-hidden
          />
          <div className="text-(--mia-ink)/85">
            <span className="font-bold tracking-wide text-(--mia-gold-deep)">
              SECURITY · 外链安全提醒：
            </span>
            留言里的链接由匿名访客填入，存在钓鱼站风险。所有外链已强制在新标签页打开并切断
            <code className="mx-1 rounded bg-(--mia-cream-soft)/65 px-1 text-(--mia-gold-deep)">opener</code>
            引用，点击前请留意域名（例如{" "}
            <code className="rounded bg-(--mia-cream-soft)/65 px-1 text-(--mia-gold-deep)">bilibili.com</code>{" "}
            被写成{" "}
            <code className="rounded bg-(--mia-cream-soft)/65 px-1 text-(--mia-rose)">bili-bili.com</code>
            就是伪造）。
          </div>
        </div>
      </section>

      <MailConnectionKeys topicId={activeTopicId} topicTitle={activeTopic?.title} />
      {settings.error ? <p role="alert">设置同步失败：{settings.error.message}</p> : null}
      {/* 收件箱（跟随当前主题） */}
      <section>
        <WindChimeAdminPanel
          title={inboxTitle}
          emptyText={
            activeTopic?.isDefault
              ? "暂无来信。"
              : "该主题暂无来信。"
          }
          items={items}
          counts={counts}
          autoClientFilter
          isLoading={loading}
          error={listError}
          onReload={() => void reload()}
          onDelete={onDelete}
          onToggleRead={onToggleRead}
          onToggleFavorite={onToggleFavorite}
          onBlockSender={onBlockSender}
          onBatchDelete={onBatchDelete}
          onBatchMarkRead={onBatchMarkRead}
          theme={mailAdminTheme}
        />
      </section>

      {/* 待审核（命中敏感词的留言，默认折叠，点击查看原文） */}
      {blockedTermsEnabled ? <section>
        <FlaggedMailPanel
          key={activeTopicId}
          items={flaggedInbox.items}
          authHeader={authHeader}
          topicId={activeTopicId}
          onUnauthorized={onUnauthorized}
          onAfterAction={() => {
            void reload();
            void reloadTopics();
            void flaggedInbox.reload();
            void reloadBlocklist();
          }}
        />
      </section> : null}

      {/* 黑名单（全局，跨主题共享） */}
      <section>
        <WindChimeBlocklistPanel
          title="BLOCKLIST · 黑名单（全局）"
          emptyText="尚未拉黑任何发送者。"
          items={blocklist}
          isLoading={blLoading}
          error={blError}
          onReload={() => void reloadBlocklist()}
          onUnblock={onUnblock}
          theme={mailBlocklistTheme}
        />
      </section>

      {/* 分享二维码 + 海报编辑（URL 跟随当前主题） */}
      {shareUrl && (
        <section className="flex flex-col gap-6">
          <WindChimeQrCard
            url={shareUrl}
            title={
              activeTopic?.isDefault
                ? "SHARE · MAIL_BOX"
                : `SHARE · ${activeTopic?.title ?? "TOPIC"}`
            }
            subtitle={`扫码前往 ${shareUrl.replace(/^https?:\/\//, "")} 给 Mia 投信`}
            size={260}
            foreground="#2b2620"
            background="#fbf6ec"
            downloadName={
              activeTopic?.isDefault
                ? "mia-mail-qr"
                : `mia-topic-${activeTopic?.slug ?? "topic"}-qr`
            }
            theme={mailQrTheme}
            poster={{
              enabled: true,
              heading: poster.heading,
              body: poster.body,
              footer: poster.footer || shareUrl.replace(/^https?:\/\//, ""),
              gradient: ["#fbf6ec", "#f3e9d0"],
              backgroundImageSrc: "/Background.webp",
              backgroundImageOverlay: "rgba(251,246,236,0.45)",
              avatarSrc: avatarSrcForCanvas(poster.avatarSrc) || undefined,
            }}
          />

          <WindChimeQrPosterEditor
            value={poster}
            onChange={setPoster}
            storageKey="mia:mail:poster"
            theme={mailPosterEditorTheme}
            placeholders={{
              heading: "给 Mia 匿名投一封信",
              body: "扫码后匿名留言，Mia 直播时会念出来 ~",
              footer: "—— 星眠Mia",
            }}
          />
        </section>
      )}

      {/* 全局设置：敏感词（跨主题共享，低频配置） */}
      {blockedTermsEnabled ? <section id="global-settings">
        <BlockedTermsPanel />
      </section> : null}

      {/* ===== 模态 / 抽屉 ===== */}
      <NewTopicModal
        open={showNewTopicModal}
        onClose={() => setShowNewTopicModal(false)}
        authHeader={authHeader}
        onCreated={onCreatedTopic}
      />
      <EditTopicModal
        open={!!editingTopicId && !!editingTopic}
        topic={editingTopic}
        authHeader={authHeader}
        onClose={() => setEditingTopicId(null)}
        onUpdated={onUpdatedTopic}
      />
      <ArchivedTopicsDrawer
        open={showArchivedDrawer}
        onClose={() => setShowArchivedDrawer(false)}
        authHeader={authHeader}
        onRestored={onRestoredTopic}
      />
      <ArchiveConfirmModal
        blockedTermsEnabled={blockedTermsEnabled}
        open={!!archiveConfirmTopic}
        topic={archiveConfirmTopic}
        busy={archiveBusy}
        onCancel={() => !archiveBusy && setArchiveConfirmTopic(null)}
        onMarkReadThenArchive={() =>
          archiveConfirmTopic && performArchive(archiveConfirmTopic, true)
        }
        onArchiveAnyway={() =>
          archiveConfirmTopic && performArchive(archiveConfirmTopic, false)
        }
      />
    </div>
  );
}

/**
 * 把 B 站 hdslb.com 域名的头像 URL 自动改写为同源代理，避免
 * `<WindChimeQrCard>` 用 `crossOrigin='anonymous'` 跨域加载失败。
 * 非 B 站域名直接原样返回，便于用户手动填其它图床。
 */
function avatarSrcForCanvas(src: string | undefined | null): string {
  const s = src?.trim();
  if (!s) return "";
  if (s.startsWith("/api/mail/proxy-image")) return s;
  try {
    const u = new URL(s);
    if (u.hostname.endsWith("hdslb.com")) {
      return `/api/mail/proxy-image?src=${encodeURIComponent(s)}`;
    }
  } catch {
    /* 非合法 URL，原样返回 */
  }
  return s;
}
