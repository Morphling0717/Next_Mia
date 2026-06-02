"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Icons } from './UI';

export interface SongItem {
  name: string;
  artist: string;
  category: string;
}

export interface SongCategory {
  id: string;
  label: string;
}

export interface SongSystemProps {
  addNotification: (msg: string) => void;
  config?: any;
  songs?: SongItem[];
  /** 强制跳过列表的桌面 stagger 动画。/app 入口里 SongSystem 嵌在小屏 panel 中，
   * 即使浏览器宽度 ≥ 768 也不应该走 ~9 秒的桌面 stagger 动画。 */
  disableAnimation?: boolean;
}

const DEFAULT_CATEGORIES: SongCategory[] = [
  { id: 'all', label: 'ALL' },
  { id: 'pop', label: '流行' },
  { id: 'gufeng', label: '古风' },
  { id: 'english', label: '英文' },
];

export const SongSystem: React.FC<SongSystemProps> = ({
  addNotification,
  config,
  songs,
  disableAnimation = false,
}) => {
  const uiConfig = config?.song_ui || {
    titlePrefix: 'HYMN',
    titleSuffix: ' · 云端歌册',
    categories: DEFAULT_CATEGORIES,
  };

  const categories: SongCategory[] = (uiConfig.categories || DEFAULT_CATEGORIES) as SongCategory[];

  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSong, setCopiedSong] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const skipStagger = isMobile || disableAnimation;
  const songData = songs || [];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSong(name);
      addNotification(`${uiConfig.copiedPrefix || '已抄写：'} ${name}`);
      setTimeout(() => setCopiedSong(null), 2000);
    });
  };

  const handleRandom = () => {
    if (songData.length === 0) return;
    const s = songData[Math.floor(Math.random() * songData.length)];
    handleCopy(`点歌 ${s.name} ${s.artist}`, s.name);
  };

  const filteredSongs = useMemo(
    () =>
      songData.filter((s) => {
        const matchCategory = activeTab === 'all' || s.category === activeTab;
        const matchSearch = s.name.includes(searchTerm) || s.artist.includes(searchTerm);
        return matchCategory && matchSearch;
      }),
    [activeTab, searchTerm, songData],
  );

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, when: 'beforeChildren' },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <section id="song-system" className="container mx-auto px-6 mb-16 md:mb-32 relative z-10">
      <h2 className="font-display text-[7vw] md:text-4xl font-bold text-center mb-10 text-(--mia-ink) whitespace-nowrap">
        {uiConfig.titlePrefix || 'HYMN'}
        <span className="text-(--mia-gold)">{uiConfig.titleSuffix || ' · 云端歌册'}</span>
      </h2>

      <GlassCard
        className="w-full max-w-6xl mx-auto p-4 md:p-8 min-h-[500px] md:min-h-175"
        disableAnimation={skipStagger}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 md:gap-6">
          <div className="font-serif-cn text-sm text-(--mia-gold-deep) text-center md:text-left">
            {uiConfig.serverText || '云端教堂 · 共'} {songData.length} {uiConfig.songsUnit || '首歌'}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder={uiConfig.searchPlaceholder || '搜寻圣咏 / 歌名 / 歌手…'}
              className="bg-white/60 border border-(--mia-gold)/40 rounded px-4 py-2 text-(--mia-ink) w-full md:w-64 focus:border-(--mia-gold) outline-none font-serif-cn text-sm placeholder:text-(--mia-gold-deep)/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleRandom}
              className="px-6 py-2 bg-(--mia-gold) text-(--mia-cream) font-display font-bold text-sm hover:bg-(--mia-gold-deep) hover:shadow-[0_0_15px_rgba(196,169,110,0.4)] transition-all whitespace-nowrap rounded"
            >
              {uiConfig.randomizeBtn || '随机祈愿'}
            </button>
          </div>
        </div>

        <div className="flex justify-around md:justify-start gap-2 md:gap-8 border-b border-(--mia-warm-grey) mb-6 overflow-x-auto no-scrollbar">
          {categories.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-4 font-display text-xs md:text-sm tracking-wider md:tracking-widest transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-(--mia-gold-deep) border-b-2 border-(--mia-gold)'
                    : 'text-(--mia-gold-deep)/55 hover:text-(--mia-ink)'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="h-125 overflow-y-auto pr-2 custom-scrollbar relative">
          {skipStagger ? (
            <div key={activeTab + searchTerm}>
              {filteredSongs.length === 0 ? (
                <div className="text-center text-(--mia-gold-deep)/70 mt-20 font-serif-cn tracking-widest">
                  {uiConfig.emptyText || '圣典中暂无此曲'}
                </div>
              ) : (
                filteredSongs.map((s, i) => (
                  <div
                    key={`${s.name}-${i}`}
                    className="flex justify-between items-center p-4 border-b border-(--mia-warm-grey)/55 transition-colors group cursor-pointer hover:bg-(--mia-gold)/10"
                    onClick={() => handleCopy(`点歌 ${s.name} ${s.artist}`, s.name)}
                  >
                    <div>
                      <div className="font-medium font-serif-cn transition-colors text-(--mia-ink) group-hover:text-(--mia-gold-deep)">
                        {s.name}
                      </div>
                      <div className="text-xs text-(--mia-gold-deep)/65 font-serif-cn mt-1">
                        {s.artist}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-(--mia-gold-deep)">
                      {copiedSong === s.name ? (uiConfig.copiedTag || '已抄写') : <Icons.Copy size={16} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchTerm}
                variants={listVariants as any}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {filteredSongs.length === 0 ? (
                  <motion.div
                    variants={itemVariants as any}
                    className="text-center text-(--mia-gold-deep)/70 mt-20 font-serif-cn tracking-widest"
                  >
                    {uiConfig.emptyText || '圣典中暂无此曲'}
                  </motion.div>
                ) : (
                  filteredSongs.map((s, i) => (
                    <motion.div
                      key={`${s.name}-${i}`}
                      variants={itemVariants as any}
                      className="flex justify-between items-center p-4 border-b border-(--mia-warm-grey)/55 transition-colors group cursor-pointer hover:bg-(--mia-gold)/10"
                      onClick={() => handleCopy(`点歌 ${s.name} ${s.artist}`, s.name)}
                    >
                      <div>
                        <div className="font-medium font-serif-cn transition-colors text-(--mia-ink) group-hover:text-(--mia-gold-deep)">
                          {s.name}
                        </div>
                        <div className="text-xs text-(--mia-gold-deep)/65 font-serif-cn mt-1">
                          {s.artist}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-(--mia-gold-deep)">
                        {copiedSong === s.name ? (uiConfig.copiedTag || '已抄写') : <Icons.Copy size={16} />}
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </GlassCard>
    </section>
  );
};
