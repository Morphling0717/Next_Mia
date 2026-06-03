"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshIcon as RefreshCw, StarIcon as Sparkles } from "tdesign-icons-react";
import type { EditableSiteConfig } from "@/lib/site-config";

type PwaUpdateBannerProps = {
  texts: EditableSiteConfig["pwa"];
};

export function PwaUpdateBanner({ texts }: PwaUpdateBannerProps) {
  const [updateReady, setUpdateReady] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // dev 模式下 Next.js chunks 没有内容 hash，
    // 一旦被 SW 缓存就会让 HMR 失效、导致用户看到老代码。
    // 所以只在生产环境注册 SW，dev 模式主动注销已存在的 SW。
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if (window.caches) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    let cancelled = false;

    const watchRegistration = (reg: ServiceWorkerRegistration) => {
      setRegistration(reg);

      if (reg.waiting) {
        setUpdateReady(true);
      }

      const trackInstalling = (sw: ServiceWorker) => {
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            setUpdateReady(true);
          }
        });
      };

      if (reg.installing) trackInstalling(reg.installing);

      reg.addEventListener("updatefound", () => {
        if (reg.installing) trackInstalling(reg.installing);
      });
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        if (cancelled) return;
        watchRegistration(reg);
        // 主动 ping 一下，看看有没有更新
        reg.update().catch(() => {});
      })
      .catch(() => {});

    const onControllerChange = () => {
      // 新 SW 接管页面时刷新，确保拿到最新代码
      if (refreshing) return;
      setRefreshing(true);
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    // 周期性主动检查更新（粉丝群体 ~20 人，频率不用太高）
    const intervalId = window.setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.update().catch(() => {});
      });
    }, 60 * 60 * 1000);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.clearInterval(intervalId);
    };
  }, [refreshing]);

  const handleApply = () => {
    if (!registration?.waiting) {
      window.location.reload();
      return;
    }
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };

  if (!updateReady) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="fixed inset-x-3 z-[10000] sm:inset-x-auto sm:right-6 sm:w-[360px]"
        style={{ top: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-(--mia-gold)/40 bg-(--mia-cream)/95 p-4 shadow-[0_18px_44px_-22px_rgba(196,169,110,0.45)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-8 right-8 h-16 w-24 rounded-full bg-(--mia-gold)/25 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--mia-gold)/45 bg-(--mia-gold)/15 text-(--mia-gold-deep)">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-(--mia-ink)">{texts.updateTitle}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-(--mia-warm-grey-deep)">
                {texts.updateDescription}
              </div>
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="flex shrink-0 items-center gap-1 rounded-full bg-(--mia-gold) px-3 py-2 text-xs font-semibold text-(--mia-cream) shadow-[0_6px_16px_-8px_rgba(196,169,110,0.55)] transition hover:bg-(--mia-gold-deep) active:scale-[0.96]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {texts.updateButton}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
