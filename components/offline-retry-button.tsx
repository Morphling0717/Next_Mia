"use client";

import { useEffect, useState } from "react";
import { RefreshIcon } from "tdesign-icons-react";

export function OfflineRetryButton() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setOnline(window.navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (online) {
      window.location.reload();
    }
  }, [online]);

  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--mia-gold) px-5 py-2.5 text-xs font-semibold text-(--mia-cream) transition hover:bg-(--mia-gold-deep) active:scale-[0.97]"
    >
      <RefreshIcon className="h-3.5 w-3.5" />
      重新连接
    </button>
  );
}
