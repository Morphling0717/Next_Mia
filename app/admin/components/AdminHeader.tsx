"use client";

import {
  ShareIcon as ExternalLink,
  RefreshIcon as RefreshCw,
  SaveIcon as Save,
  TerminalIcon as Terminal,
} from "tdesign-icons-react";

interface AdminHeaderProps {
  onSave: () => void;
  onReload: () => void;
  currentVersion: number;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  historyCount: number;
  editorName: string;
  onEditorNameChange: (value: string) => void;
}

function formatDateTime(value: string | null): string {
  if (!value) return "尚无保存记录";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

export function AdminHeader({
  onSave,
  onReload,
  currentVersion,
  lastUpdatedAt,
  lastUpdatedBy,
  historyCount,
  editorName,
  onEditorNameChange,
}: AdminHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-(--mia-ink)">
            <Terminal className="text-(--mia-gold-deep)" />
            MIA · ADMIN
          </h1>
          <p className="mt-1 font-serif-cn text-xs text-(--mia-gold-deep)">
            云端教堂 · 后台配置中心
          </p>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="rounded-full border border-(--mia-gold)/35 bg-(--mia-gold)/12 px-3 py-1 text-(--mia-gold-deep)">
              VERSION #{currentVersion}
            </span>
            <span className="rounded-full border border-(--mia-warm-grey)/55 bg-(--mia-cream-soft) px-3 py-1 text-(--mia-gold-deep)">
              BACKUPS {historyCount}
            </span>
            <span className="rounded-full border border-(--mia-warm-grey)/55 bg-(--mia-cream-soft) px-3 py-1 text-(--mia-gold-deep)">
              LAST SAVE {formatDateTime(lastUpdatedAt)}
              {lastUpdatedAt ? ` · ${lastUpdatedBy || "未知"}` : ""}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-105">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-(--mia-gold-deep)">
              EDITOR_NAME
            </span>
            <input
              type="text"
              value={editorName}
              onChange={(e) => onEditorNameChange(e.target.value)}
              placeholder="例如：Mia / 云端 / 运营"
              className="rounded-lg border border-(--mia-warm-grey) bg-(--mia-cream-soft) px-4 py-2 text-sm text-(--mia-ink) outline-none transition focus:border-(--mia-gold) focus:bg-white/95"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-lg border border-(--mia-warm-grey) bg-(--mia-cream-soft) px-4 py-2 text-sm text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/10"
            >
              <ExternalLink className="h-4 w-4" /> PREVIEW
            </a>
            <button
              onClick={onReload}
              className="flex items-center gap-2 rounded-lg border border-(--mia-warm-grey) bg-(--mia-cream-soft) px-4 py-2 text-sm text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/10"
            >
              <RefreshCw className="h-4 w-4" /> RELOAD LATEST
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-2 rounded-lg bg-(--mia-gold) px-6 py-2 font-bold text-(--mia-cream) shadow-[0_0_20px_rgba(196,169,110,0.4)] transition hover:bg-(--mia-gold-deep)"
            >
              <Save className="h-4 w-4" /> SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
