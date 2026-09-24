"use client";

import { useEffect, useState } from "react";
import { WindChimeConnectionKeys } from "@windchime/embed/broadcast";
import { mailLiveClient } from "@/lib/windchime-client";

export function MailConnectionKeys({ topicId, topicTitle }: { topicId: string; topicTitle?: string }) {
  const [userCode, setUserCode] = useState("");
  useEffect(() => { const query = new URLSearchParams(window.location.search); queueMicrotask(() => setUserCode((query.get("userCode") || query.get("deviceCode") || "").slice(0, 32))); }, []);
  return <WindChimeConnectionKeys key={topicId} client={mailLiveClient} topicId={topicId} topicTitle={topicTitle} userCode={userCode} className="rounded-2xl border border-(--mia-gold)/45 bg-(--mia-cream-soft)/85 p-5 text-sm text-(--mia-ink) shadow-[0_18px_44px_-22px_rgba(196,169,110,0.4)] backdrop-blur-xl sm:p-6" />;
}
