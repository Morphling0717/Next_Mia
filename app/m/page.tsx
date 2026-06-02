import type { Metadata } from "next";
import Link from "next/link";
import { listTopics, type Topic } from "@/lib/mail-topics";
import { formatBeijing } from "@/components/mail/mail-time";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const topics = await listTopics({ onlyPublicActive: true });
  const count = topics.length;
  const title =
    count > 0 ? `${count} 个活动进行中 · 星眠Mia` : "活动信箱 · 星眠Mia";
  const description =
    count > 0
      ? `星眠Mia 的活动信箱聚合页，当前有 ${count} 个活动可参与投信`
      : "星眠Mia 当前没有进行中的活动";

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    robots: { index: false, follow: false },
  };
}

export default async function TopicListPage() {
  const topics = await listTopics({ onlyPublicActive: true });

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-(--mia-cream) via-(--mia-cream-soft) to-(--mia-cream) text-(--mia-ink)">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,169,110,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(196,169,110,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-(--mia-gold)/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-(--mia-blush)/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--mia-gold)/45 bg-(--mia-cream)/75 px-3 py-1.5 font-display text-[11px] text-(--mia-gold-deep) transition hover:bg-(--mia-gold)/15 hover:text-(--mia-ink)"
          >
            <span aria-hidden>←</span>
            返回主站
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-2 font-display text-[11px] tracking-[0.25em] text-(--mia-gold-deep)/85">
            <span aria-hidden>✦</span>
            <span>EVENTS · 活动信箱</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-(--mia-ink) sm:text-4xl">
            {topics.length > 0
              ? `${topics.length} 个活动进行中`
              : "当前没有进行中的活动"}
          </h1>
          <p className="mt-3 font-serif-cn text-sm leading-relaxed text-(--mia-gold-deep)">
            {topics.length > 0
              ? "选一个你想参与的活动，匿名写下想对 Mia 说的话 ~"
              : "下次来可能就有惊喜了。你也可以从主站左下角给常规信箱投信。"}
          </p>
        </header>

        {topics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topics.map((t) => (
              <TopicCard key={t.id} topic={t} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <div className="mt-12 text-center font-display text-[11px] tracking-[0.2em] text-(--mia-warm-grey-deep)">
          星眠Mia · MAIL_TOPICS
        </div>
      </div>
    </main>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/m/${topic.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-(--mia-gold)/35 bg-(--mia-cream)/85 p-5 shadow-[0_18px_44px_-26px_rgba(196,169,110,0.55)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-(--mia-gold)/65 hover:bg-(--mia-cream-soft)/90 hover:shadow-[0_20px_48px_-24px_rgba(196,169,110,0.75)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-display text-[10px] tracking-[0.25em] text-(--mia-gold-deep)/80">
            EVENT
          </div>
          <h2 className="mt-1 truncate font-serif-cn text-lg font-bold text-(--mia-ink) group-hover:text-(--mia-gold-deep)">
            {topic.title}
          </h2>
        </div>
        <span
          className="shrink-0 font-display text-lg text-(--mia-gold-deep) transition group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </div>

      {topic.description && (
        <p className="line-clamp-3 font-serif-cn text-sm leading-relaxed text-(--mia-ink)/80">
          {topic.description}
        </p>
      )}

      {topic.endsAt && (
        <div className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-(--mia-gold)/45 bg-(--mia-gold)/12 px-2.5 py-1 font-display text-[10px] text-(--mia-gold-deep)">
          <span aria-hidden>✚</span>
          截止 · {formatBeijing(topic.endsAt)}
        </div>
      )}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-(--mia-gold)/25 bg-(--mia-cream)/75 p-10 text-center shadow-[0_18px_44px_-26px_rgba(196,169,110,0.45)] backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-(--mia-gold)/35 bg-(--mia-gold)/10">
        <span className="text-2xl text-(--mia-gold-deep)/75" aria-hidden>
          ✦
        </span>
      </div>
      <p className="font-serif-cn text-sm text-(--mia-ink)">
        当前暂无进行中的活动
      </p>
      <p className="mt-2 font-serif-cn text-xs text-(--mia-gold-deep)/75">
        主站左下角仍可给 Mia 投一封常规来信 ~
      </p>
    </div>
  );
}
