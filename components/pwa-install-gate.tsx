"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  DownloadIcon as Download,
  ShareIcon as Share2,
  CloseIcon as X,
  AddRectangleIcon as PlusSquare,
} from "tdesign-icons-react";
import type { EditableSiteConfig } from "@/lib/site-config";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISS_KEY = "mia:pwa-install:dismissed-at";
const INSTALLED_KEY = "mia:pwa-install:installed";
// 将用户主动关闭后的免打扰时间延长到 14 天
const DISMISS_TTL = 1000 * 60 * 60 * 24 * 14;

function readDismissedAt(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(DISMISS_KEY) || 0);
  } catch {
    return 0;
  }
}

function rememberDismissed() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {}
}

function markAsInstalled() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INSTALLED_KEY, "true");
  } catch {}
}

function isMarkedAsInstalled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INSTALLED_KEY) === "true";
  } catch {
    return false;
  }
}

function detectIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform;
  return /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

type PwaInstallGateProps = {
  texts: EditableSiteConfig["pwa"];
};

export function PwaInstallGate({ texts }: PwaInstallGateProps) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos] = useState(detectIosDevice);
  const [hiddenByDismiss, setHiddenByDismiss] = useState(() => Date.now() - readDismissedAt() < DISMISS_TTL);
  const [alreadyInstalled, setAlreadyInstalled] = useState(isMarkedAsInstalled);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStandalone = () => {
      const standaloneByMedia = window.matchMedia("(display-mode: standalone)").matches;
      const standaloneByNavigator = Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
      if (standaloneByMedia || standaloneByNavigator) {
        setIsStandalone(true);
        markAsInstalled(); // 如果检测到 standalone，顺手标记为已安装
      }
    };

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    updateStandalone();
    mediaQuery.addEventListener("change", updateStandalone);

    return () => {
      mediaQuery.removeEventListener("change", updateStandalone);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      // 如果浏览器触发了这个事件，说明确定没安装。我们可以覆盖掉可能错误的 installed 标记
      if (isMarkedAsInstalled()) {
          try { window.localStorage.removeItem(INSTALLED_KEY); } catch {}
          setAlreadyInstalled(false);
      }
      setDeferredPrompt(installEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      markAsInstalled();
      setAlreadyInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const shouldRender = useMemo(() => {
    // 不在主页不弹
    if (pathname !== "/") return false;
    // PWA 模式下不弹
    if (isStandalone) return false;
    // 已经明确记录安装过不弹
    if (alreadyInstalled) return false;
    // 用户近期主动关掉过不弹
    if (hiddenByDismiss) return false;
    
    // 只有拿到了安装事件 (安卓/PC)，或者是在 iOS Safari (且未忽略未安装) 时才弹
    return Boolean(deferredPrompt) || isIos;
  }, [deferredPrompt, hiddenByDismiss, isIos, isStandalone, pathname, alreadyInstalled]);

  const handleDismiss = () => {
    setHiddenByDismiss(true);
    rememberDismissed();
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") {
      markAsInstalled();
      setAlreadyInstalled(true);
      return;
    }
    // 用户在系统弹窗里拒绝了，当做 Dismiss 处理
    setHiddenByDismiss(true);
    rememberDismissed();
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed inset-x-3 z-[9999] sm:inset-x-auto sm:right-6 sm:w-[380px]"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
      >
        {/* 高级玻璃态卡片 */}
        <div className="relative overflow-hidden rounded-[24px] border border-(--mia-gold)/35 bg-(--mia-cream)/95 p-5 shadow-[0_24px_60px_-24px_rgba(196,169,110,0.45)] backdrop-blur-xl">
          {/* 柔和的顶部光晕 */}
          <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-32 -translate-x-1/2 rounded-full bg-(--mia-gold)/25 blur-2xl"></div>
          
          <div className="relative flex items-start justify-between gap-4">
            {/* App Icon 区域 */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-(--mia-gold)/30 bg-gradient-to-b from-(--mia-gold)/12 to-(--mia-cream-soft) shadow-inner">
              {/* 这里使用 eslint 忽略 img 警告，因为图标就是原生尺寸不用图片加载器 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app.jpg" alt="App Icon" className="h-10 w-10 rounded-[10px] object-cover" />
            </div>

            {/* 文字信息 */}
            <div className="flex-1 pt-1">
              <h3 className="text-[15px] font-semibold leading-tight text-(--mia-ink) tracking-wide font-display">
                {texts.installTitle}
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-(--mia-warm-grey-deep)">
                {deferredPrompt
                  ? texts.installDescription
                  : texts.installIosDescription}
              </p>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleDismiss}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--mia-cream-soft) text-(--mia-warm-grey-deep) transition-colors hover:bg-(--mia-gold)/15 hover:text-(--mia-ink) active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 底部操作区 */}
          <div className="mt-5">
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--mia-gold) py-3 text-[14px] font-semibold text-(--mia-cream) shadow-[0_8px_22px_-10px_rgba(196,169,110,0.55)] transition-transform hover:bg-(--mia-gold-deep) active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                {texts.installButton}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-(--mia-warm-grey)/50 bg-(--mia-cream-soft)/85 py-3 text-[13px] font-medium text-(--mia-ink)">
                <span>{texts.iosStepOne}</span>
                <Share2 className="h-4 w-4 text-(--mia-gold-deep)" />
                <span className="mx-1 opacity-50">|</span>
                <span>{texts.iosStepTwo}</span>
                <PlusSquare className="h-4 w-4 text-(--mia-gold-deep)" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
