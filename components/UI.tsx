"use client";

import React from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  MusicIcon,
  CalendarIcon,
  SearchIcon,
  StarIcon,
  ShareIcon,
  CopyIcon,
  CheckIcon,
  ChevronLeftIcon,
  WifiOffIcon,
  InfoCircleIcon,
  VideoIcon,
  SoundIcon,
  CloseIcon,
  ChurchIcon,
  CatIcon,
  CloudIcon,
  Radio1Icon,
  UserCircleIcon,
  MailIcon,
  UsergroupIcon,
  LogoQqIcon,
} from 'tdesign-icons-react';

// --- Types ---
export interface IconProps {
  className?: string;
  size?: number | string;
}

export interface ToastNotificationProps {
  id: string | number;
  message: string;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** 跳过进入动画。在动态 overlay （如 FeaturePanel）里使用 GlassCard 时，
   * IntersectionObserver 可能漏探入场事件导致卸在 opacity 0，需要跳过。 */
  disableAnimation?: boolean;
}

// --- 1. 图标系统（tdesign-icons-react 包装） ---
// 原 UliUli 项目里用 size 控制、反复调用 <Icons.X size={20} /> 。tdesign 原生是 size="24px"
// 字符串接口，这里重新包装一层让传数字也能用，代码调用点零修改。
function wrapTd(
  IconCmp: React.ComponentType<{ className?: string; size?: string | number }>,
): React.FC<IconProps> {
  const WrappedIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
    <IconCmp className={className} size={typeof size === 'number' ? `${size}px` : size} />
  );

  WrappedIcon.displayName = `WrappedIcon(${IconCmp.displayName || IconCmp.name || 'Icon'})`;
  return WrappedIcon;
}

export const Icons = {
  Music: wrapTd(MusicIcon),
  Calendar: wrapTd(CalendarIcon),
  Search: wrapTd(SearchIcon),
  Sparkles: wrapTd(StarIcon),
  ExternalLink: wrapTd(ShareIcon),
  Copy: wrapTd(CopyIcon),
  Check: wrapTd(CheckIcon),
  ArrowLeft: wrapTd(ChevronLeftIcon),
  WifiOff: wrapTd(WifiOffIcon),
  Info: wrapTd(InfoCircleIcon),
  Video: wrapTd(VideoIcon),
  Volume2: wrapTd(SoundIcon),
  VolumeX: wrapTd(SoundIcon),
  X: wrapTd(CloseIcon),
  // Mia 主题限定：教堂 / 天使猫 / 云 取代原型 'Swords' 为默认 entry。
  Church: wrapTd(ChurchIcon),
  Cat: wrapTd(CatIcon),
  Cloud: wrapTd(CloudIcon),
  // 直播间 / B站主页 / 投信箱 / QQ群 四宫格快捷入口
  Radio: wrapTd(Radio1Icon),
  User: wrapTd(UserCircleIcon),
  Mail: wrapTd(MailIcon),
  Group: wrapTd(UsergroupIcon),
  LogoQq: wrapTd(LogoQqIcon),
};

// --- 2. Toast 通知组件 ---
export const ToastContainer: React.FC<{ notifications: ToastNotificationProps[] }> = ({ notifications }) => (
  <div className="fixed top-24 right-4 z-11000 flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          exit={{ opacity: 0 }}
          className="bg-(--mia-cream)/95 backdrop-blur-md border-l-4 border-(--mia-gold) text-(--mia-ink) px-6 py-4 rounded-lg shadow-[0_10px_30px_-12px_rgba(196,169,110,0.45)] flex items-center gap-3 min-w-60"
        >
          <Icons.Check size={18} className="text-(--mia-gold-deep)" />
          <div className="text-sm font-bold tracking-wider font-display">
            {n.message}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- 3. 玻璃拟态卡片组件 ---
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick, disableAnimation = false }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mia 香槟金鼎制柔光
  const bgGlow = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseX}px ${mouseY}px,
      rgba(196, 169, 110, 0.18),
      transparent 80%
    )
  `;

  const borderGlow = useMotionTemplate`
    radial-gradient(
      250px circle at ${mouseX}px ${mouseY}px,
      rgba(196, 169, 110, 0.28),
      transparent 60%
    )
  `;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  return (
    <motion.div
      initial={disableAnimation ? false : undefined}
      whileInView={disableAnimation ? undefined : { opacity: [0, 1], y: [20, 0] }}
      viewport={disableAnimation ? undefined : { once: true }}
      transition={disableAnimation ? { duration: 0 } : { duration: 0.5 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`
        relative overflow-hidden rounded-xl group
        bg-(--glass-bg,rgba(255,252,244,0.78)) backdrop-blur-xl border border-(--mia-warm-grey)
        hover:border-(--mia-gold)/60 hover:shadow-[0_0_22px_rgba(196,169,110,0.25)]
        transition-all duration-300
        ${className}
      `}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{ background: bgGlow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          boxShadow: "inset 0 0 1px 1px rgba(196, 169, 110, 0.35)",
          background: borderGlow
        }}
      />
      {/* 黑十字 ✕ 角标（取代 UliUli 的霓虹青色边角） */}
      <div className="absolute top-1 left-1 text-(--mia-ink)/55 group-hover:text-(--mia-ink)/85 text-[10px] font-bold transition-colors z-20 pointer-events-none">✚</div>
      <div className="absolute bottom-1 right-1 text-(--mia-gold-deep)/55 group-hover:text-(--mia-gold-deep)/85 text-[10px] font-bold transition-colors z-20 pointer-events-none">✚</div>
      
      <div className="relative z-30 h-full">{children}</div>
    </motion.div>
  );
};


// GoldenLuckModal 已随出金机制一起在 Mia 项目中移除。
