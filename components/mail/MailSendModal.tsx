"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon, NotificationIcon as RadioIcon } from "tdesign-icons-react";
import { WindChimeSender } from "@windchime/embed";
import type { WindChimeSubmitPayload } from "@windchime/embed";
import "@windchime/embed/styles/windchime.css";
import { mailSenderTheme } from "./mail-theme";
import { playSentSfx } from "@/lib/mail-sfx";

/**
 * 可从 admin 后台（/admin · 发信箱 tab）编辑的访客侧文案。
 * 默认值由共享 site_config schema 合并，组件内不再维护可见文案 fallback。
 */
export type MailTexts = {
  disabledBanner?: string;
  senderTitle?: string;
  senderTagline?: string;
  statusOpen?: string;
  statusPaused?: string;
  pausedMessage?: string;
  placeholderText?: string;
  placeholderNickname?: string;
  placeholderLink?: string;
  successMessage?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 从 /api/config 读到的 siteConfig.mail。 */
  texts?: MailTexts;
  enabled?: boolean;
};

/** 提交成功后，给用户看 success banner 的时长；到点自动关弹窗。 */
const AUTO_CLOSE_MS = 1800;

async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    return j?.error ?? res.statusText;
  }
  return (await res.text().catch(() => "")) || res.statusText;
}

export function MailSendModal({ open, onOpenChange, texts, enabled }: Props) {
  const closeTimerRef = useRef<number | null>(null);

  // ESC 关闭 + 锁滚动
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  // 弹窗关闭或卸载时清掉自动关闭 timer，避免无谓的 setState
  useEffect(() => {
    if (open) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const onSubmit = useCallback(
    async (payload: WindChimeSubmitPayload) => {
      const r = await fetch("/api/mail/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: payload.text,
          nickname: payload.nickname,
          linkUrl: payload.linkUrl,
          senderFingerprint: payload.senderFingerprint,
          turnstileToken: payload.turnstileToken,
          attachments: payload.attachments,
        }),
      });
      if (!r.ok && r.status !== 202) {
        throw new Error(await readError(r));
      }
      // 成功：在 WindChimeSender 展示 success banner 的间隙播音效并自动关窗
      playSentSfx();
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        onOpenChange(false);
      }, AUTO_CLOSE_MS);
    },
    [onOpenChange],
  );

  // Cloudflare Turnstile：env 配了 NEXT_PUBLIC_TURNSTILE_SITE_KEY 就启用人机校验
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined;

  const isDisabled = enabled === false;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-(--mia-ink)/45 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="关闭"
              className="absolute -top-2 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-(--mia-gold)/60 bg-(--mia-cream)/95 text-(--mia-gold-deep) shadow-[0_8px_22px_-10px_rgba(196,169,110,0.55)] transition hover:bg-(--mia-gold) hover:text-(--mia-cream) hover:shadow-[0_10px_26px_-10px_rgba(196,169,110,0.65)] sm:-top-3 sm:-right-3"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {isDisabled && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-(--mia-rose)/55 bg-(--mia-rose)/10 p-4 text-center font-display text-sm text-(--mia-rose) shadow-[0_8px_22px_-10px_rgba(184,80,106,0.4)] backdrop-blur-md">
                <RadioIcon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{texts?.disabledBanner ?? ""}</span>
              </div>
            )}

            <div
              className={isDisabled ? "pointer-events-none select-none opacity-60 grayscale" : undefined}
              aria-disabled={isDisabled}
            >
              <WindChimeSender
                enableImages
                title={texts?.senderTitle ?? ""}
                tagline={texts?.senderTagline ?? ""}
                statusOpenLabel={texts?.statusOpen ?? ""}
                statusPausedLabel={texts?.statusPaused ?? ""}
                pausedMessage={texts?.pausedMessage ?? ""}
                collectNickname
                collectLinkUrl
                placeholder={texts?.placeholderText ?? ""}
                nicknamePlaceholder={texts?.placeholderNickname ?? ""}
                linkPlaceholder={texts?.placeholderLink ?? ""}
                successMessage={texts?.successMessage ?? ""}
                rateLimit={{
                  max: 3,
                  windowMs: 60_000,
                  storageKey: "mia:mail:rl",
                }}
                turnstileSiteKey={turnstileSiteKey}
                enableSwayAnimation={false}
                theme={mailSenderTheme}
                onSubmit={onSubmit}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
