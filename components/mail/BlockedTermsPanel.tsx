"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  authHeader: Record<string, string>;
  onUnauthorized: () => void;
};

async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    return j?.error ?? res.statusText;
  }
  return (await res.text().catch(() => "")) || res.statusText;
}

/**
 * 敏感词管理：一段输入框（逗号或换行分隔）+ 保存按钮。
 * 数据来自 GET /api/mail/blocked-terms，PUT 覆盖保存。
 */
export function BlockedTermsPanel({ authHeader, onUnauthorized }: Props) {
  const [terms, setTerms] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const handleAuthError = useCallback(
    (res: Response): boolean => {
      if (res.status === 401) {
        onUnauthorized();
        return true;
      }
      return false;
    },
    [onUnauthorized],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/mail/blocked-terms", {
        headers: authHeader,
        cache: "no-store",
      });
      if (handleAuthError(r)) return;
      if (!r.ok) throw new Error(await readError(r));
      const j = (await r.json()) as { terms?: string[] };
      const list = Array.isArray(j.terms) ? j.terms : [];
      setTerms(list);
      setDraft(list.join(", "));
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [authHeader, handleAuthError]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const parsed = useMemo(
    () =>
      Array.from(
        new Set(
          draft
            .split(/[,，\n]+/)
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
        ),
      ),
    [draft],
  );

  const dirty = useMemo(() => {
    if (parsed.length !== terms.length) return true;
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i] !== terms[i]) return true;
    }
    return false;
  }, [parsed, terms]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/mail/blocked-terms", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ terms: parsed }),
      });
      if (handleAuthError(r)) return;
      if (!r.ok) throw new Error(await readError(r));
      const j = (await r.json()) as { terms?: string[] };
      const list = Array.isArray(j.terms) ? j.terms : [];
      setTerms(list);
      setDraft(list.join(", "));
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }, [authHeader, handleAuthError, parsed]);

  return (
    <div className="rounded-2xl border border-(--mia-gold)/45 bg-(--mia-cream-soft)/85 p-5 shadow-[0_18px_44px_-22px_rgba(196,169,110,0.4)] backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="font-display text-sm font-bold tracking-[0.12em] text-(--mia-ink)">
            BLOCKED_TERMS · 敏感词
          </div>
          <div className="mt-1 font-mono text-xs text-(--mia-gold-deep)/75">
            命中任一词的留言会被<span className="text-(--mia-rose)">折叠遮盖</span>，
            主播在下方「待审核」区点击才能看到原文。不拦截发送。
          </div>
        </div>
        {loading && (
          <span className="font-display text-[10px] text-(--mia-gold-deep)/75">LOADING…</span>
        )}
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="例如：色情, 赌博, 微信, 加我, 裸聊"
        rows={3}
        className="w-full resize-y rounded-lg border border-(--mia-warm-grey) bg-white/70 px-3 py-2 font-mono text-sm leading-relaxed text-(--mia-ink) placeholder:text-(--mia-warm-grey-deep)/70 outline-none transition focus:border-(--mia-gold) focus:bg-white focus:ring-2 focus:ring-(--mia-gold)/20"
      />
      <div className="mt-2 font-mono text-[11px] text-(--mia-warm-grey-deep)">
        用逗号或换行分隔，大小写不敏感。当前共 {parsed.length} 个词。
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2 font-mono text-xs text-(--mia-rose)">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {parsed.slice(0, 20).map((t) => (
            <span
              key={t}
              className="rounded-md border border-(--mia-gold)/40 bg-(--mia-gold)/10 px-2 py-0.5 font-mono text-[11px] text-(--mia-gold-deep)"
            >
              {t}
            </span>
          ))}
          {parsed.length > 20 && (
            <span className="font-mono text-[11px] text-(--mia-warm-grey-deep)">
              … 还有 {parsed.length - 20} 个
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedAt && !dirty && (
            <span className="font-mono text-[11px] text-emerald-700">
              已保存 ✓
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving || loading || !dirty}
            className="rounded-lg border border-(--mia-gold-deep) bg-(--mia-gold) px-4 py-1.5 font-display text-xs font-bold tracking-[0.15em] text-(--mia-cream) shadow-[0_8px_24px_-12px_rgba(138,111,58,0.55)] transition hover:bg-(--mia-gold-deep) hover:shadow-[0_10px_28px_-10px_rgba(138,111,58,0.65)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}
