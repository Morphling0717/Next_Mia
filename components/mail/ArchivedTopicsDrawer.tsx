"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FolderIcon as ArchiveIcon,
  RefreshIcon as RotateCcwIcon,
  DeleteIcon as Trash2Icon,
  CloseIcon,
} from "tdesign-icons-react";
import type { Topic } from "./mail-topic-types";
import { useWindChimeTopics } from "@windchime/embed/react";
import { mailClient } from "@/lib/windchime-client";
import { formatBeijing } from "./mail-time";

type Props = {
  open: boolean;
  onClose: () => void;
  authHeader: Record<string, string>;
  onRestored: (topic: Topic) => void;
};

/**
 * 往期活动抽屉：打开时请求 `/api/mail/topics?include=archived` 拿全部主题，
 * 过滤出归档项展示；支持按 title/slug 搜索 + 一键恢复。
 *
 * v1 不实现"原位查看归档信件"——主播如果要看，恢复后在主 tab 栏切入即可。
 */
export function ArchivedTopicsDrawer({
  open,
  onClose,
  onRestored,
}: Props) {
  const resource = useWindChimeTopics(mailClient, { includeArchived: true, enabled: open, pollIntervalMs: 3000 });
  const { restore, purge } = resource;
  const loading = resource.isLoading;
  const error = resource.error?.message;
  const items = useMemo(() => resource.items.filter(topic => topic.state === "archived"), [resource.items]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<{
    id: string;
    action: "restore" | "delete";
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) queueMicrotask(() => { setSearch(""); setDeleteTarget(null); setDeleteError(null); });
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deleteTarget) {
        if (busy?.action !== "delete") {
          setDeleteTarget(null);
          setDeleteError(null);
        }
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, deleteTarget, open, onClose]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
    );
  }, [items, search]);

  const onRestore = useCallback(
    async (topic: Topic) => {
      setBusy({ id: topic.id, action: "restore" });
      try {
        const restored = await restore(topic.id);
        onRestored(restored);
      } catch (e) {
        alert(e instanceof Error ? e.message : "恢复失败");
      } finally {
        setBusy(null);
      }
    },
    [restore, onRestored],
  );

  const openDeleteConfirm = useCallback((topic: Topic) => {
    setDeleteError(null);
    setDeleteTarget(topic);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (busy?.action === "delete") return;
    setDeleteTarget(null);
    setDeleteError(null);
  }, [busy]);

  const onDelete = useCallback(
    async () => {
      if (!deleteTarget) return;

      setBusy({ id: deleteTarget.id, action: "delete" });
      setDeleteError(null);
      try {
        await purge(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) {
        setDeleteError(e instanceof Error ? e.message : "删除失败");
      } finally {
        setBusy(null);
      }
    },
    [purge, deleteTarget],
  );

  const deleteBusy =
    !!deleteTarget &&
    busy?.id === deleteTarget.id &&
    busy.action === "delete";

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="archived-topics-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1100] flex items-stretch justify-end bg-(--mia-ink)/45 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="relative flex h-full w-full max-w-lg flex-col border-l border-(--mia-gold)/45 bg-(--mia-cream-soft)/95 shadow-[-10px_18px_44px_-22px_rgba(196,169,110,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-(--mia-gold)/55 bg-(--mia-cream)/95 text-(--mia-gold-deep) transition hover:bg-(--mia-gold) hover:text-(--mia-cream)"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="border-b border-(--mia-gold)/30 px-5 py-4">
              <div className="flex items-center gap-2">
                <ArchiveIcon className="h-5 w-5 text-(--mia-gold-deep)" />
                <div className="font-display text-sm font-bold tracking-[0.12em] text-(--mia-gold-deep)">
                  ARCHIVE · 往期活动
                </div>
              </div>
              <div className="mt-1 font-mono text-[11px] text-(--mia-gold-deep)/75">
                点「恢复」后主题会重新出现在主 tab 栏（状态按当前时间重新判定）
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 按标题 / slug 搜索…"
                  className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-mono text-xs text-(--mia-ink) placeholder:text-(--mia-warm-grey-deep)/70 outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="py-10 text-center font-display text-sm text-(--mia-gold-deep)/85">
                  LOADING…
                </div>
              )}
              {error && (
                <div className="rounded border border-rose-500/50 bg-rose-500/10 px-3 py-2 font-mono text-xs text-(--mia-rose)">
                  {error}
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="py-10 text-center font-mono text-sm text-(--mia-warm-grey-deep)">
                  {items.length === 0
                    ? "EMPTY · 暂无归档主题"
                    : `NO MATCH · "${search}" 无匹配`}
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <ul className="space-y-2">
                  {filtered.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-lg border border-(--mia-warm-grey)/60 bg-(--mia-warm-grey)/10 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-sans text-sm font-bold text-(--mia-ink)">
                            {t.title}
                          </div>
                          <div className="mt-0.5 truncate font-mono text-[11px] text-(--mia-warm-grey-deep)">
                            /m/{t.slug}
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-(--mia-warm-grey-deep)">
                            归档于 {formatBeijing(t.archivedAt)}
                          </div>
                          {t.startsAt && t.endsAt && (
                            <div className="font-mono text-[11px] text-(--mia-warm-grey-deep)">
                              活动期: {formatBeijing(t.startsAt)} ~{" "}
                              {formatBeijing(t.endsAt)}
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <button
                            type="button"
                            disabled={busy?.id === t.id}
                            onClick={() => onRestore(t)}
                            className="flex items-center gap-1 rounded-lg border border-(--mia-gold)/55 bg-(--mia-gold)/12 px-3 py-1.5 font-display text-xs text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/22 hover:text-(--mia-ink) disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <RotateCcwIcon className="h-3.5 w-3.5" />
                            {busy?.id === t.id && busy.action === "restore"
                              ? "恢复中"
                              : "恢复"}
                          </button>
                          <button
                            type="button"
                            disabled={busy?.id === t.id}
                            onClick={() => openDeleteConfirm(t)}
                            className="flex items-center gap-1 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 font-mono text-xs text-(--mia-rose) transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2Icon className="h-3.5 w-3.5" />
                            {busy?.id === t.id && busy.action === "delete"
                              ? "删除中"
                              : "永久删除"}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      {open && deleteTarget && (
        <motion.div
          key={`archived-topic-delete-confirm-${deleteTarget.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[1150] flex items-center justify-center bg-(--mia-cream-soft)/95 p-4 backdrop-blur-md"
          onClick={closeDeleteConfirm}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-md rounded-2xl border border-rose-500/60 bg-(--mia-cream-soft)/95 p-6 shadow-[0_18px_50px_-20px_rgba(184,80,106,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDeleteConfirm}
              aria-label="关闭"
              disabled={deleteBusy}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-(--mia-rose)/60 bg-(--mia-cream)/95 text-(--mia-rose) transition hover:bg-(--mia-rose) hover:text-(--mia-cream) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="mb-2 flex items-center gap-2">
              <Trash2Icon className="h-5 w-5 text-(--mia-rose)" />
              <div className="font-display text-sm font-bold tracking-[0.12em] text-(--mia-rose)">
                CONFIRM · 永久删除
              </div>
            </div>

            <p className="mt-3 font-sans text-[14px] leading-relaxed text-(--mia-ink)/85">
              你将永久删除主题
              <span className="mx-1 font-bold text-(--mia-rose)">「{deleteTarget.title}」</span>
              。这个操作会连同该主题下的所有留言一起清空，且无法恢复。
            </p>

            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.06] p-3 font-mono text-[11px] text-(--mia-ink)/80">
              <div>
                主题入口：<span className="text-(--mia-rose)">/m/{deleteTarget.slug}</span>
              </div>
              <div className="mt-1">
                归档时间：<span className="text-(--mia-rose)">{formatBeijing(deleteTarget.archivedAt)}</span>
              </div>
              <div className="mt-2 text-(--mia-rose)/80">
                建议仅用于清理测试主题或确认彻底废弃的旧活动。
              </div>
            </div>

            {deleteError && (
              <div className="mt-4 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 font-mono text-xs text-(--mia-rose)">
                {deleteError}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={deleteBusy}
                className="rounded-lg border border-(--mia-warm-grey) bg-(--mia-cream-soft)/85 px-4 py-2 font-mono text-xs text-(--mia-ink)/85 transition hover:bg-(--mia-warm-grey)/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => void onDelete()}
                disabled={deleteBusy}
                className="rounded-lg border border-rose-500/60 bg-rose-500/10 px-4 py-2 font-mono text-xs text-(--mia-rose) transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleteBusy ? "正在永久删除…" : "确认永久删除"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
