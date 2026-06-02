"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MailSendModal, type MailTexts } from "./MailSendModal";

/**
 * 可从 admin 后台编辑的访客侧 mail 文案。
 * entry* 三字段由 SpeedDial 自用，其余透传给 MailSendModal。
 */
export type MailEntryTexts = {
  entryLabel?: string;
  entryHint?: string;
  entryHintDisabled?: string;
};

type MailSpeedDialProps = {
  texts?: MailEntryTexts & MailTexts;
  mailEnabled?: boolean;
  mailOpen?: boolean;
  onMailOpenChange?: (open: boolean) => void;
};

/**
 * Mia 版左下角发信按钮。
 * 原 UliUli 同位 speed dial 绑定了扭蛋机 + 发信箱两项；Mia 项目仅保留
 * 发信箱跳转，出金/扭蛋靠踶则全部移除。
 */
export function MailSpeedDial({
  texts,
  mailEnabled,
  mailOpen: controlledMailOpen,
  onMailOpenChange,
}: MailSpeedDialProps = {}) {
  const [expanded, setExpanded] = useState(false);
  const [uncontrolledMailOpen, setUncontrolledMailOpen] = useState(false);
  const mailOpen = controlledMailOpen ?? uncontrolledMailOpen;
  const setMailOpen = onMailOpenChange ?? setUncontrolledMailOpen;

  // ESC 收起
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const onOpenMail = () => {
    setExpanded(false);
    setMailOpen(true);
  };

  const mailDisabled = mailEnabled === false;

  return (
    <>
      {/* 主按钮 + 子按钮层 */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-3">
        {/* 主按钮（收纳态） */}
        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={expanded ? "收起菜单" : "展开菜单"}
          aria-expanded={expanded}
          className="pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-(--mia-gold) bg-(--mia-cream)/85 text-(--mia-gold-deep) shadow-[0_0_20px_rgba(196,169,110,0.35)] backdrop-blur-md transition-colors hover:bg-(--mia-gold) hover:text-(--mia-cream)"
        >
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="block"
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.span>
        </motion.button>

        {/* 子按钮：发信箱（Mia 仅保留这一项） */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="speeddial-items"
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={{
                collapsed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                expanded: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
              }}
              className="pointer-events-auto flex flex-col-reverse items-center gap-3"
            >
              <SpeedDialItem
                label={texts?.entryLabel || "发信箱"}
                hint={
                  mailDisabled
                    ? (texts?.entryHintDisabled || "发信箱暂时关闭")
                    : (texts?.entryHint || "匿名交付给 Mia")
                }
                disabled={mailDisabled}
                onClick={onOpenMail}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    <path d="m3.5 7.5 8.5 6.5 8.5-6.5" />
                  </svg>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 展开时的半透明遮罩（点击空白处收起） */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="speeddial-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* 实际弹窗 */}
      <MailSendModal
        open={mailOpen}
        onOpenChange={setMailOpen}
        texts={texts}
        enabled={mailEnabled}
      />
    </>
  );
}

type ItemProps = {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function SpeedDialItem({ label, hint, icon, onClick, disabled }: ItemProps) {
  return (
    <motion.div
      variants={{
        collapsed: { opacity: 0, y: 12, scale: 0.85 },
        expanded: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="relative flex items-center gap-3"
    >
      {/* 右侧标签 */}
      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-(--mia-gold)/45 bg-(--mia-cream)/90 px-3 py-1.5 font-serif-cn text-xs text-(--mia-gold-deep) shadow-[0_0_14px_rgba(196,169,110,0.25)] backdrop-blur-md">
        <span className="font-bold text-(--mia-ink)">{label}</span>
        <span className="ml-2 text-(--mia-gold-deep)/85">{hint}</span>
      </span>

      <motion.button
        type="button"
        onClick={disabled ? undefined : onClick}
        whileHover={disabled ? undefined : { scale: 1.08 }}
        whileTap={disabled ? undefined : { scale: 0.92 }}
        aria-label={`${label} · ${hint}`}
        aria-disabled={disabled}
        className={
          disabled
            ? "flex h-12 w-12 items-center justify-center rounded-full border-2 border-(--mia-warm-grey) bg-(--mia-cream)/65 text-(--mia-gold-deep)/55 shadow-[0_0_10px_rgba(196,169,110,0.1)] backdrop-blur-md cursor-not-allowed"
            : "flex h-12 w-12 items-center justify-center rounded-full border-2 border-(--mia-gold) bg-(--mia-cream)/85 text-(--mia-gold-deep) shadow-[0_0_16px_rgba(196,169,110,0.3)] backdrop-blur-md transition-colors hover:bg-(--mia-gold) hover:text-(--mia-cream)"
        }
      >
        {icon}
      </motion.button>
    </motion.div>
  );
}
