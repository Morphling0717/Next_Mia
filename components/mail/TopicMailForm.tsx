"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon as ArrowLeftIcon,
  CalendarIcon as CalendarClockIcon,
  StarIcon as SparklesIcon,
} from "tdesign-icons-react";
import { WindChimeSender } from "@windchime/embed";
import type { WindChimeSubmitPayload } from "@windchime/embed";
import "@windchime/embed/styles/windchime.css";
import { mailSenderTheme } from "./mail-theme";
import { playSentSfx } from "@/lib/mail-sfx";
import { formatBeijing } from "./mail-time";
import type { Topic } from "./mail-topic-types";

type Props = {
  topic: Topic;
  /** 从 `/api/config` 读到的 siteConfig.mail；传 undefined 则全部走默认。 */
  texts?: {
    placeholderText?: string;
    placeholderNickname?: string;
    placeholderLink?: string;
    successMessage?: string;
  };
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
 * 访客投信页的表单主体（活动主题专属）。
 *
 * - 顶部展示 banner（title / description / 活动期限）
 * - 内嵌 `WindChimeSender`，提交时把 `topicSlug: topic.slug` 附到 payload 里
 *   走 `/api/mail/messages` POST；服务端会二次校验主题状态
 *   (isEnabled / startsAt / endsAt / archivedAt)
 * - 成功反馈复用 WindChimeSender 内置 success banner；再加 `playSentSfx()`
 *   播个提交音效。访客可以连续投（WindChimeSender 2s 后自动回到空表单）。
 */
export function TopicMailForm({ topic, texts }: Props) {
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
          topicSlug: topic.slug,
        }),
      });
      // 注意：blocklist 命中时服务端返回 202 + { ok: true }（对外伪成功）
      if (!r.ok && r.status !== 202) {
        throw new Error(await readError(r));
      }
      playSentSfx();
    },
    [topic.slug],
  );

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined;

  const endsHint = useMemo(() => {
    if (!topic.endsAt) return null;
    return `活动截止 · ${formatBeijing(topic.endsAt)}`;
  }, [topic.endsAt]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-(--mia-cream) via-(--mia-cream-soft) to-(--mia-cream) text-(--mia-ink)">
      {/* 背景装饰：隐约金纹网格 + 两团圣金/暖肤光斑 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,111,58,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(138,111,58,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-20 h-[28rem] w-[28rem] rounded-full bg-(--mia-gold)/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-(--mia-blush)/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:py-12">
        {/* 顶部导航：返回活动列表（/m），而非直接跳回主站。
            在 /m 页面里还有一个「返回主站」按钮负责最后一跳，形成
            /  ←  /m  ←  /m/{slug} 的三级层级。 */}
        <div className="mb-6">
          <Link
            href="/m"
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--mia-gold)/45 bg-(--mia-cream)/70 px-3 py-1.5 font-display text-[11px] text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/15 hover:text-(--mia-ink)"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            返回活动列表
          </Link>
        </div>

        {/* 活动 Banner */}
        <section className="mb-6 rounded-2xl border border-(--mia-gold)/45 bg-(--mia-cream)/90 p-6 shadow-[0_18px_44px_-22px_rgba(196,169,110,0.4)] backdrop-blur-xl">
          <div className="flex items-center gap-2 font-display text-[11px] tracking-[0.25em] text-(--mia-gold-deep)/85">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>EVENT · 活动进行中</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-wide text-(--mia-ink) sm:text-3xl">
            {topic.title}
          </h1>
          {topic.description && (
            <p className="mt-3 font-sans text-sm leading-relaxed text-(--mia-ink)/85">
              {topic.description}
            </p>
          )}
          {endsHint && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-(--mia-gold)/45 bg-(--mia-gold)/12 px-3 py-1 font-display text-[11px] text-(--mia-gold-deep)">
              <CalendarClockIcon className="h-3 w-3" />
              {endsHint}
            </div>
          )}
        </section>

        {/* WindChimeSender 表单 */}
        <section className="flex-1">
          <WindChimeSender
            enableImages
            topicSlug={topic.slug}
            title={`MAIL · ${topic.title}`}
            tagline="在这里匿名写下你想说的话 ~"
            statusOpenLabel="ONLINE"
            statusPausedLabel="OFFLINE"
            pausedMessage="活动暂停中，稍后再来吧 ~"
            collectNickname
            collectLinkUrl
            placeholder={
              texts?.placeholderText || "在这里写下你想说的话…"
            }
            nicknamePlaceholder={
              texts?.placeholderNickname || "称呼（可选）"
            }
            linkPlaceholder={
              texts?.placeholderLink || "B站 / X / 外站链接（可选）"
            }
            successMessage={
              texts?.successMessage ||
              "已送达云端教堂 · Mia 会在直播时读到 ~"
            }
            rateLimit={{
              max: 3,
              windowMs: 60_000,
              storageKey: `mia:mail:rl:${topic.slug}`,
            }}
            turnstileSiteKey={turnstileSiteKey}
            enableSwayAnimation={false}
            theme={mailSenderTheme}
            onSubmit={onSubmit}
          />
        </section>

        {/* 页脚小字 */}
        <div className="mt-8 text-center font-mono text-[11px] tracking-[0.2em] text-(--mia-warm-grey-deep)">
          Mia · MAIL_TOPICS · /m/{topic.slug}
        </div>
      </div>
    </main>
  );
}
