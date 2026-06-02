import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTopicBySlug, type Topic } from "@/lib/mail-topics";
import { TopicMailForm } from "@/components/mail/TopicMailForm";
import { TopicStatePage } from "@/components/mail/TopicStatePage";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

type Variant = "redirect-home" | "active" | "ended" | "disabled" | "scheduled";

function resolveVariant(topic: Topic, nowMs: number = Date.now()): Variant {
  if (topic.isDefault) return "redirect-home";
  if (topic.archivedAt) return "ended";
  if (!topic.isEnabled) return "disabled";
  if (topic.startsAt && nowMs < Date.parse(topic.startsAt)) return "scheduled";
  if (topic.endsAt && nowMs > Date.parse(topic.endsAt)) return "ended";
  return "active";
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "找不到该活动 · 星眠Mia",
      robots: { index: false, follow: false },
    };
  }

  if (topic.isDefault) {
    return { title: "星眠Mia", robots: { index: false, follow: false } };
  }

  const variant = resolveVariant(topic);
  const siteName = "星眠Mia";
  const titleMap: Record<Variant, string> = {
    "redirect-home": siteName,
    active: `${topic.title} · ${siteName}`,
    ended: `${topic.title}（活动已结束） · ${siteName}`,
    disabled: `${topic.title}（暂停中） · ${siteName}`,
    scheduled: `${topic.title}（即将开始） · ${siteName}`,
  };
  const description =
    topic.description ||
    (variant === "active"
      ? "活动进行中 · 欢迎给 Mia 投一封信"
      : "星眠Mia 的活动信箱");

  return {
    title: titleMap[variant],
    description,
    openGraph: {
      title: titleMap[variant],
      description,
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

export default async function TopicPage({ params }: RouteProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const variant = resolveVariant(topic);

  if (variant === "redirect-home") {
    redirect("/");
  }

  if (variant === "active") {
    return <TopicMailForm topic={topic} />;
  }

  return (
    <TopicStatePage
      variant={variant}
      topicTitle={topic.title}
      topicDescription={topic.description}
      startsAt={topic.startsAt}
      endsAt={topic.endsAt}
    />
  );
}
