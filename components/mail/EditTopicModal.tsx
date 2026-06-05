"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "tdesign-icons-react";
import type { Topic } from "./mail-topic-types";
import {
  beijingLocalToUtcIso,
  nowAsBeijingLocal,
  plusDaysAsBeijingLocal,
  utcIsoToBeijingLocal,
} from "./mail-time";

type Props = {
  open: boolean;
  topic: Topic | null;
  authHeader: Record<string, string>;
  onClose: () => void;
  onUpdated: (topic: Topic) => void;
};

export function EditTopicModal({
  open,
  topic,
  authHeader,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [useTimeWindow, setUseTimeWindow] = useState(true);
  const [startsLocal, setStartsLocal] = useState(() => nowAsBeijingLocal());
  const [endsLocal, setEndsLocal] = useState(() => plusDaysAsBeijingLocal(7));
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !topic) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setTitle(topic.title);
      setDescription(topic.description ?? "");
      setNote(topic.note ?? "");
      const hasWindow = !topic.isDefault && (!!topic.startsAt || !!topic.endsAt);
      setUseTimeWindow(hasWindow);
      setStartsLocal(
        topic.startsAt ? utcIsoToBeijingLocal(topic.startsAt) : nowAsBeijingLocal(),
      );
      setEndsLocal(
        topic.endsAt ? utcIsoToBeijingLocal(topic.endsAt) : plusDaysAsBeijingLocal(7),
      );
      setSubmitting(false);
      setServerError(null);
    });
    return () => {
      cancelled = true;
    };
  }, [open, topic]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const titleError = useMemo(() => {
    const t = title.trim();
    if (!t) return null;
    if (t.length > 64) return "标题超过 64 字符";
    return null;
  }, [title]);

  const timeRangeError = useMemo(() => {
    if (!topic || topic.isDefault || !useTimeWindow) return null;
    if (!startsLocal || !endsLocal) return null;
    if (startsLocal >= endsLocal) return "开始时间不能晚于或等于结束时间";
    return null;
  }, [topic, useTimeWindow, startsLocal, endsLocal]);

  const canSubmit =
    !!topic &&
    !!title.trim() &&
    !titleError &&
    !timeRangeError &&
    !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !canSubmit) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || null,
      };

      if (!topic.isDefault) {
        body.note = note.trim() || null;
        if (useTimeWindow) {
          body.startsAt = beijingLocalToUtcIso(startsLocal);
          body.endsAt = beijingLocalToUtcIso(endsLocal);
        } else {
          body.startsAt = null;
          body.endsAt = null;
        }
      }

      const r = await fetch(`/api/mail/topics/${encodeURIComponent(topic.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(j?.error ?? `保存失败（HTTP ${r.status}）`);
      }
      const updated = (await r.json()) as Topic;
      onUpdated(updated);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSubmitting(false);
    }
  };

  if (typeof document === "undefined") return null;
  if (!open || !topic) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1100] flex items-center justify-center bg-(--mia-ink)/55 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.form
          onSubmit={onSubmit}
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="relative w-full max-w-xl rounded-2xl border border-(--mia-gold)/55 bg-(--mia-cream)/95 p-6 shadow-[0_18px_50px_-22px_rgba(196,169,110,0.4)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-(--mia-gold)/55 bg-(--mia-cream)/90 text-(--mia-gold-deep) transition hover:bg-(--mia-gold) hover:text-(--mia-cream)"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          <div className="mb-1 font-display text-[11px] tracking-[0.25em] text-(--mia-gold-deep)/85">
            EDIT TOPIC · 编辑主题
          </div>
          <h2 className="font-display text-lg font-bold tracking-wide text-(--mia-ink)">
            {topic.isDefault ? "编辑常规信箱" : `编辑 ${topic.title}`}
          </h2>

          <div className="mt-5 space-y-4">
            <Field
              label="URL slug"
              hint={
                topic.isDefault
                  ? "默认主题固定为首页入口，不可修改"
                  : `访客链接为 /m/${topic.slug}；创建后不可修改`
              }
            >
              <input
                type="text"
                value={topic.slug}
                disabled
                className="w-full rounded-lg border border-(--mia-warm-grey)/60 bg-(--mia-cream)/60 px-3 py-2 font-mono text-sm text-(--mia-gold-deep)/75 outline-none"
              />
            </Field>

            <Field label="主题标题 *" hint="活动顶部与后台标题都会同步更新">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={64}
                className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-sans text-sm text-(--mia-ink) placeholder:text-(--mia-warm-grey-deep)/70 outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
              />
              {titleError && <ErrLine msg={titleError} />}
            </Field>

            <Field label="说明（访客可见）" hint="出现在投信页的副标题，简短提示">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-sans text-sm text-(--mia-ink) placeholder:text-(--mia-warm-grey-deep)/70 outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
              />
            </Field>

            {!topic.isDefault && (
              <>
                <Field label="备注（仅主播可见）" hint="给自己记笔记，访客看不到">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={500}
                    className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-sans text-sm text-(--mia-ink) outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
                  />
                </Field>

                <div className="rounded-lg border border-(--mia-gold)/30 bg-(--mia-gold)/[0.06] p-3">
                  <label className="flex items-center gap-2 font-display text-xs text-(--mia-gold-deep)">
                    <input
                      type="checkbox"
                      checked={useTimeWindow}
                      onChange={(e) => setUseTimeWindow(e.target.checked)}
                      className="h-4 w-4 accent-(--mia-gold-deep)"
                    />
                    启用时间窗（按 <strong className="mx-0.5 text-(--mia-ink)">北京时间</strong> 理解）
                  </label>

                  {useTimeWindow && (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <TimeField label="开始时间" value={startsLocal} onChange={setStartsLocal} />
                      <TimeField label="结束时间" value={endsLocal} onChange={setEndsLocal} />
                    </div>
                  )}
                  {timeRangeError && (
                    <div className="mt-2">
                      <ErrLine msg={timeRangeError} />
                    </div>
                  )}
                  {!useTimeWindow && (
                    <div className="mt-2 font-display text-[11px] text-(--mia-rose)">
                      ⚠ 无时间窗 = 只要开关开着就一直可投信
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {serverError && (
            <div className="mt-4 rounded-lg border border-(--mia-rose)/55 bg-(--mia-rose)/10 px-3 py-2 font-display text-xs text-(--mia-rose)">
              {serverError}
            </div>
          )}

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-(--mia-warm-grey) bg-(--mia-cream-soft)/85 px-4 py-2 font-mono text-xs text-(--mia-ink)/85 transition hover:bg-(--mia-warm-grey)/40"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg border border-(--mia-gold-deep) bg-(--mia-gold) px-4 py-2 font-display text-xs font-bold tracking-[0.15em] text-(--mia-cream) shadow-[0_8px_24px_-12px_rgba(138,111,58,0.55)] transition hover:bg-(--mia-gold-deep) hover:shadow-[0_10px_28px_-10px_rgba(138,111,58,0.65)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 font-display text-[11px] uppercase tracking-[0.2em] text-(--mia-gold-deep)/85">
        {label}
      </div>
      {children}
      {hint && (
        <div className="mt-1 font-mono text-[11px] text-(--mia-warm-grey-deep)">{hint}</div>
      )}
    </label>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 font-display text-[11px] text-(--mia-gold-deep)/85">{label}</div>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-mono text-xs text-(--mia-ink) outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
      />
    </label>
  );
}

function ErrLine({ msg }: { msg: string }) {
  return <div className="mt-1 font-display text-[11px] text-(--mia-rose)">✕ {msg}</div>;
}
