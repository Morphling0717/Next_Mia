"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GlassCard, Icons } from './UI';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const getConfig = (providedConfig?: any) => providedConfig || {};

// --- Types ---
export interface VideoItem {
  url: string;
  pic: string;
  title: string;
  length: string;
  date: string;
  play: string | number;
}

export interface ExpressionItem {
  id: string;
  face: string;
  full: string;
}

export interface LinkItem {
  title: string;
  url: string;
  icon: string;
  color: string;
}

export interface DashboardProps {
  stats: string | number;
  liveStatus: boolean;
  avatarSrc: string;
  config?: any;
  assetVersion?: number;
  onOpenMail?: () => void;
}

const withAssetVersion = (src: string, assetVersion?: number) => {
  if (!src || !assetVersion) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return src.includes('?') ? `${src}&v=${assetVersion}` : `${src}?v=${assetVersion}`;
};

// --- Mia 优雅闪光大标题（取代 UliUli CyberGlitchText） ---
const AngelicShimmerText: React.FC<{ text: string; className?: string; style?: React.CSSProperties }> = ({
  text,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <motion.span
        className="relative inline-block font-display font-bold text-(--mia-ink)"
        animate={{
          textShadow: isHovered
            ? '0 0 18px rgba(196,169,110,0.65), 0 2px 0 rgba(255,255,255,0.6)'
            : '0 0 12px rgba(196,169,110,0.4), 0 1px 0 rgba(255,255,255,0.5)',
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {text}
      </motion.span>
      {/* 香槟金扫光层 */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 font-display font-bold bg-clip-text text-transparent"
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 35%, rgba(196,169,110,0.55) 50%, transparent 65%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: isHovered ? 1.4 : 4.2, ease: 'linear', repeat: Infinity }}
      >
        {text}
      </motion.span>
    </div>
  );
};

// --- 1. Hero ---
const HeroSection: React.FC<{ stats: string | number; config?: any }> = ({ stats, config }) => {
  const cfg = getConfig(config).hero || {};

  const scrollToSongs = () => {
    const element = document.getElementById('song-system');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative px-4 md:px-6 mb-12 md:mb-20 overflow-hidden">
      <div className="z-10 text-center relative w-full max-w-[90vw]">
        <div className="mb-4 font-serif-cn text-[10px] md:text-xs lg:text-sm text-(--mia-gold-deep) tracking-[0.15em] md:tracking-[0.3em]">
          <span className="text-(--mia-ink) font-bold">✚</span>{' '}
          {cfg.code || 'PROJECT CODE: XINGMIANMIA'}{' '}
          <span className="text-(--mia-ink) font-bold">✚</span>
        </div>

        <div className="relative mb-0 flex justify-center cursor-default">
          <AngelicShimmerText
            text={cfg.title || '愿祝福降临人间'}
            className="leading-tight text-[5.5vw] md:text-[6.5vw] lg:text-[5vw] xl:text-[4.5vw] 2xl:text-[4vw]"
            style={{ fontFamily: 'Cinzel, "Bodoni Moda", "Noto Serif SC", serif' }}
          />
        </div>

        <h1
          className="font-script font-normal text-(--mia-gold-deep) tracking-wide mt-0 text-[5vw] md:text-[3vw] lg:text-[2.4vw] xl:text-[2vw]"
          style={{ fontFamily: '"Italianno", "Great Vibes", cursive' }}
        >
          {cfg.subtitle || 'Cloud Cathedral · Angel of Soft Whispers'}
        </h1>

        <div className="mt-3 max-w-xl mx-auto border-l-2 border-(--mia-gold) pl-6 text-left font-serif-cn">
          <p className="text-(--mia-ink) text-base md:text-lg font-bold tracking-widest mb-2">
            {cfg.projectName || '项目名称：星眠Mia ✚'}
          </p>
          <p className="text-xs md:text-sm text-(--mia-gold-deep) tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {cfg.statusText || '云端教堂 · 存活中'} //{' '}
            {cfg.followersText || '云端信徒：'}{' '}
            <span className="text-(--mia-gold) font-bold">{stats}</span>
          </p>
        </div>

        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={scrollToSongs}
            className="px-8 py-3 border border-(--mia-gold) text-(--mia-gold-deep) font-display text-sm hover:bg-(--mia-gold) hover:text-(--mia-cream) transition-all duration-300 relative group overflow-hidden tracking-widest"
          >
            <span className="relative z-10">{cfg.startBtn || 'ENTER · 进入云端教堂'}</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-16 bg-linear-to-b from-(--mia-gold) to-transparent"></div>
          <span className="font-display text-[10px] tracking-widest text-(--mia-gold-deep)">
            {cfg.scrollText || 'SCROLL'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 无配置时的占位表情（仅用于预览排版，配置后由后台数据覆盖）
const FALLBACK_EXPRESSIONS: ExpressionItem[] = [
  { id: '表情一', face: '', full: '' },
  { id: '表情二', face: '', full: '' },
  { id: '表情三', face: '', full: '' },
  { id: '表情四', face: '', full: '' },
  { id: '表情五', face: '', full: '' },
  { id: '表情六', face: '', full: '' },
];

// --- 2. Model Breakdown ---
const ModelBreakdown: React.FC<{ avatarSrc: string; config?: any; assetVersion?: number }> = ({
  avatarSrc,
  config,
  assetVersion,
}) => {
  const cfg = getConfig(config).model || {};
  const configured: ExpressionItem[] = cfg.expressions || [];
  const expressions: ExpressionItem[] =
    configured.length > 0 ? configured : FALLBACK_EXPRESSIONS;

  const [selected, setSelected] = useState(0);
  const safeIndex = Math.min(selected, expressions.length - 1);
  const current = expressions[safeIndex];

  const fullSrc = current?.full
    ? `/${withAssetVersion(current.full, assetVersion)}`
    : avatarSrc
      ? `/${avatarSrc}`
      : '';

  return (
    <section id="model-section" className="min-h-auto md:min-h-[80vh] w-full pt-12 pb-6 md:py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-10 border-b border-(--mia-warm-grey) pb-6">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-(--mia-ink)">
            {cfg.titlePrefix || 'MODEL'}
            <span className="text-(--mia-gold)">{cfg.titleSuffix || '_DISPLAY'}</span>
          </h2>
          <div className="font-serif-cn text-[10px] md:text-xs text-(--mia-gold-deep) text-right">
            {cfg.syncRate || 'SYNC_RATE: 100%'}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 h-auto lg:h-200 items-center justify-center">
          {/* 左侧：前3个表情缩略图 */}
          <div className="order-2 lg:order-1 grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-3 lg:gap-5 h-auto lg:h-full w-full lg:w-auto shrink-0 place-content-center justify-items-center">
            {expressions.slice(0, 3).map((exp, i) => {
              const faceSrc = exp.face
                ? `/${withAssetVersion(exp.face, assetVersion)}`
                : '';
              const active = i === safeIndex;
              return (
                <button
                  key={exp.id || i}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={active}
                  className={`group interactive relative h-20 w-20 md:h-24 md:w-24 lg:h-full lg:w-full aspect-square overflow-hidden rounded-xl border bg-(--mia-cream-soft) transition duration-300 ${
                    active
                      ? 'border-(--mia-gold) shadow-[0_0_18px_rgba(196,169,110,0.45)] ring-2 ring-(--mia-gold)/40'
                      : 'border-(--mia-warm-grey) hover:border-(--mia-gold)/60'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-(--mia-cream-soft) text-(--mia-warm-grey-deep) font-display text-[9px] tracking-widest">
                    FACE
                  </div>
                  {faceSrc && (
                    <img
                      src={faceSrc}
                      alt={exp.id || `expression-${i + 1}`}
                      className="absolute inset-0 z-1 h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-700"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                        ((e.target as HTMLImageElement).style.display = 'none')
                      }
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-2 bg-linear-to-t from-(--mia-cream)/95 to-transparent px-1 pb-1 pt-3 text-center font-display text-[9px] md:text-[10px] tracking-widest text-(--mia-gold-deep) group-hover:text-(--mia-ink) transition-colors leading-tight truncate">
                    {exp.id || `表情${i + 1}`}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 中间：立绘大图（淡入淡出切换） */}
          <div className="order-1 lg:order-2 relative h-[50vh] lg:h-full flex flex-1 items-center justify-center group w-full">
            <div className="absolute bottom-10 w-3/4 h-20 bg-(--mia-gold)/15 blur-xl rounded-full scale-x-0 group-hover:scale-x-100 transition duration-1000"></div>
            <div className="relative w-full h-full flex items-center justify-center py-4">
              <AnimatePresence mode="wait">
                {fullSrc ? (
                  <motion.img
                    key={fullSrc}
                    src={fullSrc}
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px) brightness(1.4)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px) brightness(0.8)' }}
                    transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
                    className="max-h-[50vh] md:max-h-212.5 w-auto object-contain drop-shadow-[0_0_20px_rgba(196,169,110,0.35)] relative z-10"
                    alt={current?.id || 'Mia'}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                      ((e.target as HTMLImageElement).style.display = 'none')
                    }
                  />
                ) : (
                  <motion.div
                    key={`placeholder-${safeIndex}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
                    className="flex h-[42vh] md:h-150 w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-(--mia-gold)/50 bg-(--mia-cream-soft)/60 text-(--mia-gold-deep)"
                  >
                    <div className="font-display text-sm tracking-[0.3em]">立绘大图</div>
                    <div className="font-serif-cn text-xs text-(--mia-warm-grey-deep)">
                      {current?.id || `表情${safeIndex + 1}`} · 暂无图片
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧：后3个表情缩略图 */}
          <div className="order-3 lg:order-3 grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-3 lg:gap-5 h-auto lg:h-full w-full lg:w-auto shrink-0 place-content-center justify-items-center">
            {expressions.slice(3, 6).map((exp, i) => {
              const faceSrc = exp.face
                ? `/${withAssetVersion(exp.face, assetVersion)}`
                : '';
              const active = i + 3 === safeIndex;
              return (
                <button
                  key={exp.id || i + 3}
                  type="button"
                  onClick={() => setSelected(i + 3)}
                  aria-pressed={active}
                  className={`group interactive relative h-20 w-20 md:h-24 md:w-24 lg:h-full lg:w-full aspect-square overflow-hidden rounded-xl border bg-(--mia-cream-soft) transition duration-300 ${
                    active
                      ? 'border-(--mia-gold) shadow-[0_0_18px_rgba(196,169,110,0.45)] ring-2 ring-(--mia-gold)/40'
                      : 'border-(--mia-warm-grey) hover:border-(--mia-gold)/60'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-(--mia-cream-soft) text-(--mia-warm-grey-deep) font-display text-[9px] tracking-widest">
                    FACE
                  </div>
                  {faceSrc && (
                    <img
                      src={faceSrc}
                      alt={exp.id || `expression-${i + 4}`}
                      className="absolute inset-0 z-1 h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-700"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                        ((e.target as HTMLImageElement).style.display = 'none')
                      }
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-2 bg-linear-to-t from-(--mia-cream)/95 to-transparent px-1 pb-1 pt-3 text-center font-display text-[9px] md:text-[10px] tracking-widest text-(--mia-gold-deep) group-hover:text-(--mia-ink) transition-colors leading-tight truncate">
                    {exp.id || `表情${i + 4}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. Live Status & Shortcuts ---
const LiveStatusSection: React.FC<{
  liveStatus: boolean;
  config?: any;
  onOpenMail?: () => void;
}> = ({ liveStatus, config, onOpenMail }) => {
  const cfg = getConfig(config).live || {};
  const links: LinkItem[] = cfg.links || [];

  const getIcon = (name: string) => {
    if (name === 'Music') return <Icons.Music size={20} />;
    if (name === 'Video') return <Icons.Video size={20} />;
    if (name === 'Sparkles') return <Icons.Sparkles size={20} />;
    if (name === 'Cat') return <Icons.Cat size={20} />;
    if (name === 'Cloud') return <Icons.Cloud size={20} />;
    if (name === 'Church') return <Icons.Church size={20} />;
    if (name === 'Radio') return <Icons.Radio size={20} />;
    if (name === 'User') return <Icons.User size={20} />;
    if (name === 'Mail') return <Icons.Mail size={20} />;
    if (name === 'Group') return <Icons.Group size={20} />;
    if (name === 'LogoQq') return <Icons.LogoQq size={20} />;
    return <Icons.ExternalLink size={20} />;
  };

  const handleLinkClick = (url: string) => {
    if (!url || url === '#') return;
    if (url === 'mail:compose') {
      onOpenMail?.();
      return;
    }
    // 内部路由（以 / 开头且不是 //）走当前标签页；外部 / mqq协议走新标签页。
    if (/^\/(?!\/)/.test(url)) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getColorClass = (color: string) => {
    if (color === 'gold')
      return {
        border: 'group-hover:border-[var(--mia-gold)]',
        text: 'text-[var(--mia-gold-deep)]',
        glow: 'group-hover:shadow-[0_0_20px_rgba(196,169,110,0.3)]',
      };
    if (color === 'blush')
      return {
        border: 'group-hover:border-[var(--mia-blush)]',
        text: 'text-[var(--mia-blush)]',
        glow: 'group-hover:shadow-[0_0_20px_rgba(232,201,184,0.3)]',
      };
    if (color === 'ink')
      return {
        border: 'group-hover:border-[var(--mia-ink)]',
        text: 'text-[var(--mia-ink)]',
        glow: 'group-hover:shadow-[0_0_15px_rgba(43,38,32,0.2)]',
      };
    return {
      border: 'group-hover:border-[var(--mia-gold)]',
      text: 'text-[var(--mia-gold-deep)]',
      glow: 'group-hover:shadow-[0_0_18px_rgba(196,169,110,0.25)]',
    };
  };

  return (
    <div className="container mx-auto px-6 mb-12 md:mb-20 mt-0 md:mt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group min-h-50">
            <div className="relative z-10">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-(--mia-ink) mb-2 flex items-center gap-3">
                {cfg.title || '云端教堂 · 直播'}
                <span className="relative flex h-3 w-3">
                  {liveStatus && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      liveStatus ? 'bg-emerald-500' : 'bg-(--mia-warm-grey)'
                    }`}
                  ></span>
                </span>
              </h3>
              <p className="font-serif-cn text-(--mia-gold-deep) text-sm tracking-widest mb-6 opacity-80">
                {cfg.roomPrefix || 'Room:'} {cfg.roomId || '0000000'}
              </p>
              <a
                href={`https://live.bilibili.com/${cfg.roomId || '0000000'}`}
                target="_blank"
                rel="noreferrer"
                className={`
                  inline-block px-8 py-3 rounded-lg font-bold font-display tracking-wider transition-all shadow-lg transform
                  ${
                    liveStatus
                      ? 'bg-(--mia-gold) text-(--mia-cream) hover:bg-(--mia-gold-deep) hover:scale-105 hover:shadow-[0_0_20px_rgba(196,169,110,0.55)]'
                      : 'bg-(--mia-warm-grey)/40 text-(--mia-gold-deep) hover:bg-(--mia-warm-grey)/60 hover:text-(--mia-ink)'
                  }
                `}
              >
                {liveStatus ? cfg.liveNowText || '云端在线 · LIVE' : cfg.offlineText || '静谧时刻 · OFFLINE'}
              </a>
            </div>
          </GlassCard>

          <GlassCard className="p-6 group hover:border-(--mia-gold)/50 transition-colors flex flex-col justify-center min-h-50">
            <div className="flex flex-col gap-3 h-full">
              <div>
                <h3 className="font-display text-lg font-bold text-(--mia-ink) mb-2 flex items-center gap-2 group-hover:text-(--mia-gold-deep) transition-colors">
                  <Icons.Calendar size={18} /> {cfg.scheduleTitle || '教堂开放时间'}
                </h3>
                <div className="text-xs text-(--mia-gold-deep) font-serif-cn space-y-1 pl-1">
                  <div className="flex justify-between">
                    <span>{cfg.schedule?.morning || '晨祷：10:00 - 13:00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{cfg.schedule?.evening || '晚祷：20:00 - 23:00'}</span>{' '}
                    <span className="text-(--mia-gold) font-bold">
                      {cfg.schedule?.off || '周一闭馆'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-(--mia-warm-grey)/55 my-1"></div>

              <div>
                <h3 className="font-display text-lg font-bold text-(--mia-ink) mb-2 flex items-center gap-2 group-hover:text-(--mia-gold-deep) transition-colors">
                  <Icons.Info size={18} /> {cfg.rulesTitle || '点歌礼仪'}
                </h3>
                <ul className="font-serif-cn text-[10px] md:text-xs text-(--mia-gold-deep) space-y-1 list-disc list-inside pl-1">
                  {(cfg.rules || ['优先点歌单内的曲目，让 Mia 能为你专心吟唱']).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6">
          {links.map((btn: LinkItem, i: number) => {
            const style = getColorClass(btn.color);
            return (
              <GlassCard
                key={i}
                onClick={() => handleLinkClick(btn.url)}
                className={`h-full min-h-25 cursor-pointer transition-all duration-300 ${style.border} ${style.glow}`}
              >
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                  <div
                    className={`relative z-10 mb-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${style.text}`}
                  >
                    {getIcon(btn.icon)}
                  </div>
                  <span
                    className={`relative z-10 font-display text-sm font-bold text-(--mia-ink) group-hover:text-(--mia-gold-deep) transition-colors`}
                  >
                    {btn.title}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 4. Gallery (Horizontal Video Gallery) ---
export const HorizontalVideoGallery: React.FC<{ videos: VideoItem[]; config?: any }> = ({ videos, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cfg = getConfig(config).gallery || {};

  useEffect(() => {
    if (!videos || videos.length === 0 || !wrapperRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(wrapperRef.current, {
        x: () => -(wrapperRef.current!.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          end: () => '+=' + (wrapperRef.current!.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [videos]);

  if (!videos || videos.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="h-screen w-full relative overflow-hidden flex flex-col justify-center py-12 md:py-20"
    >
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 text-right pointer-events-none">
        <h2 className="font-display text-[6vw] md:text-5xl font-bold text-(--mia-ink) drop-shadow-lg max-w-[80vw] leading-tight">
          {cfg.titlePrefix || 'MIA'}
          <span className="text-(--mia-gold)">{cfg.titleSuffix || ' · ARCHIVE'}</span>
        </h2>
        <div className="text-xs text-(--mia-gold-deep) mt-2 font-serif-cn">
          {cfg.scrollText || 'SCROLL TO EXPLORE >>>'}
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="flex flex-nowrap items-center h-[60vh] md:h-[70vh] pl-4 md:pl-[10vw] gap-6 md:gap-20 relative z-10"
      >
        {videos.map((v, i) => (
          <div
            key={i}
            className="gallery-item min-w-[85vw] md:min-w-125 h-[55vh] md:h-100 relative group cursor-pointer border border-(--mia-warm-grey) hover:border-(--mia-gold) transition-all duration-500 bg-(--mia-cream-soft)/85 backdrop-blur-sm rounded-xl overflow-hidden"
            onClick={() => v.url !== '#' && window.open(v.url, '_blank')}
          >
            <div className="absolute inset-0 bg-(--mia-cream-soft) overflow-hidden">
              <img
                src={v.pic.replace(/^http:/, 'https:')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-700"
                alt={v.title}
              />
              <div className="absolute bottom-2 right-2 bg-(--mia-ink)/85 backdrop-blur text-(--mia-cream) text-[10px] font-serif-cn px-2 py-1 rounded border border-(--mia-gold)/30">
                {v.length}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-(--mia-cream) via-(--mia-cream)/85 to-transparent">
              <div className="text-(--mia-gold) font-display text-xs mb-2 tracking-widest flex items-center justify-between">
                <span>
                  {cfg.datePrefix || '✚ DATE //'} {v.date}
                </span>
                <span className="text-(--mia-gold-deep)/65">#{i + 1}</span>
              </div>

              <h3 className="font-serif-cn text-xl font-bold text-(--mia-ink) line-clamp-2 mb-2 group-hover:text-(--mia-gold-deep) transition-colors">
                {v.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-(--mia-gold-deep) font-serif-cn">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {v.play}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 5. 主 Dashboard 容器 ---
export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  liveStatus,
  avatarSrc,
  config,
  assetVersion,
  onOpenMail,
}) => (
  <div className="w-full">
    <HeroSection stats={stats} config={config} />
    <ModelBreakdown avatarSrc={avatarSrc} config={config} assetVersion={assetVersion} />
    <LiveStatusSection liveStatus={liveStatus} config={config} onOpenMail={onOpenMail} />
  </div>
);
