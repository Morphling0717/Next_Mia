"use client";

// Mia 主站首页客户端入口（原 UliUli HomeClient 简化版）。
// 已删除：扭蛋彩蛋、出金弹窗、Konami 秘籍、隐藏视频解锁、小游戏入口。
// 保留：Three 背景、自定义光标、ToastContainer、SongSystem、视频画廊、邮件 SpeedDial。

import React, { useState, useEffect, useRef } from 'react';

import ErrorBoundary from './ErrorBoundary';
import { ThreeBackground, CustomCursor } from './Effects';
import { Dashboard, HorizontalVideoGallery } from './Dashboard';
import { SongSystem, type SongItem as SongSystemSongItem } from './SongSystem';
import { ToastContainer } from './UI';
import { MailSpeedDial, type MailEntryTexts } from './mail/MailSpeedDial';
import { GlobalMailBanner } from './mail/GlobalMailBanner';
import type { MailTexts } from './mail/MailSendModal';
import type { ActiveTopicSummary } from './mail/mail-topic-types';

// --- Types ---
interface NotificationItem {
  id: number;
  message: string;
}

type SiteConfig = {
  notifications?: {
    systemInitializing?: string;
  };
  footer?: {
    text?: string;
  };
  api?: {
    bilibili?: string;
  };
  videos?: {
    archiveTitle?: string;
  };
  mail?: MailEntryTexts & MailTexts;
  activeTopics?: ActiveTopicSummary[];
  mailEnabled?: boolean;
};

interface VideoItem {
  url: string;
  pic: string;
  title: string;
  length: string;
  date: string;
  play: string | number;
}

export interface HomeClientProps {
  initialSiteConfig: SiteConfig;
  initialConfigVersion: number;
  initialSongs: SongSystemSongItem[];
}

// --- 本地视频播放器（教堂日常 / 直播切片） ---
const LocalVideoPlayer: React.FC<{ config?: SiteConfig; configVersion?: number }> = ({
  config,
  configVersion,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // 默认走 /video/1.mp4；管理员可以替换；不存在时浏览器会优雅 fallback。
  const baseSrc = '/video/1.mp4';
  const currentVideo = configVersion ? `${baseSrc}?v=${configVersion}` : baseSrc;

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 md:px-6 my-10 md:my-20 z-10">
      {/* Mia 风格金色装饰标题 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-linear-to-r from-transparent to-(--mia-gold) flex-1 opacity-60"></div>
        <h2 className="font-display text-(--mia-gold-deep) tracking-widest text-sm md:text-xl font-bold flex items-center gap-2">
          {config?.videos?.archiveTitle || '✚ MIA · ARCHIVE ✚'}
        </h2>
        <div className="h-px bg-linear-to-l from-transparent to-(--mia-gold) flex-1 opacity-60"></div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-(--mia-gold)/40 shadow-[0_0_30px_rgba(196,169,110,0.18)] group bg-(--mia-cream-soft)">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-(--mia-gold) z-10 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-(--mia-gold) z-10 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <video
          ref={videoRef}
          key={currentVideo}
          src={currentVideo}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto aspect-video object-cover relative z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>
    </section>
  );
};

// --- 主 APP 组件 ---
export default function HomeClient({
  initialSiteConfig,
  initialConfigVersion,
  initialSongs,
}: HomeClientProps) {
  const [stats, setStats] = useState<string | number>('SYNCING...');
  const [liveStatus, setLiveStatus] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [mailOpen, setMailOpen] = useState(false);

  const configVersionRef = useRef<number>(initialConfigVersion);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [configVersion, setConfigVersion] = useState<number>(initialConfigVersion);
  const [songs, setSongs] = useState<SongSystemSongItem[]>(initialSongs);

  const footerText = siteConfig?.footer?.text || '© 2026 星眠Mia · 云端教堂. All blessings reserved.';

  // 0. 周期性轮询 /api/config，把 SSR 初始值替换为最新内容
  useEffect(() => {
    let isActive = true;

    const loadConfig = async (announceUpdate = false) => {
      try {
        const res = await fetch('/api/config', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && isActive) {
          const nextVersion = Number(data.config_version || 0);
          const previousVersion = configVersionRef.current;
          const hasUpdated =
            announceUpdate &&
            previousVersion > 0 &&
            nextVersion > 0 &&
            previousVersion !== nextVersion;

          setSiteConfig(data.site_config);
          setSongs(data.songs || []);
          setConfigVersion(nextVersion);
          configVersionRef.current = nextVersion;

          if (hasUpdated) {
            const id = Date.now();
            setNotifications((prev) => [
              ...prev,
              { id, message: '云端教堂数据已更新，内容已自动刷新' },
            ]);
            setTimeout(() => {
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };

    const timer = setInterval(() => {
      loadConfig(true);
    }, 15000);

    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, []);

  // 1. 预加载核心资源
  useEffect(() => {
    const versionQuery = configVersion ? `?v=${configVersion}` : '';
    const preloadAssets = [`Mia.webp${versionQuery}`];
    preloadAssets.forEach((src) => {
      const img = new Image();
      img.src = '/' + src;
    });
  }, [configVersion]);

  // 2. 真实 API 数据获取（B站爬虫）
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = siteConfig?.api?.bilibili;
        if (!apiUrl) {
          setStats('待配置');
          return;
        }
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (data.user) {
              setStats(data.user.fans);
              setLiveStatus(data.user.is_live);
            }
            if (data.videos) {
              setVideos(data.videos);
            }
          } else {
            console.error('API 业务错误:', data.error);
            setStats('ERROR');
          }
        } else {
          console.error('Failed to fetch Bilibili data');
          setStats('ERROR');
        }
      } catch (error) {
        console.error('API Fetch Error:', error);
        setStats('OFFLINE');
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. 通用功能函数
  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const assetVersionQuery = configVersion ? `?v=${configVersion}` : '';

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <CustomCursor />
        <ThreeBackground />
        <ToastContainer notifications={notifications} />

        <main className="relative z-10 w-full block">
          <GlobalMailBanner topics={siteConfig?.activeTopics} />
          <Dashboard
            stats={stats}
            liveStatus={liveStatus}
            avatarSrc={`Mia.webp${assetVersionQuery}`}
            config={siteConfig}
            assetVersion={configVersion}
            onOpenMail={() => setMailOpen(true)}
          />

          <div className="w-full py-20 relative">
            <SongSystem
              addNotification={addNotification}
              config={siteConfig}
              songs={songs}
            />
          </div>

          <div className="w-full relative block">
            {videos.length > 0 && (
              <HorizontalVideoGallery videos={videos} config={siteConfig} />
            )}
          </div>

          <LocalVideoPlayer config={siteConfig} configVersion={configVersion} />

          <footer className="w-full py-10 border-t border-(--mia-warm-grey) text-center relative mt-10">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-(--mia-gold) to-transparent"></div>
            <p className="font-serif-cn text-(--mia-gold-deep) text-xs tracking-widest">
              {footerText}
            </p>
          </footer>
        </main>

        <MailSpeedDial
          texts={siteConfig?.mail}
          mailEnabled={siteConfig?.mailEnabled}
          mailOpen={mailOpen}
          onMailOpenChange={setMailOpen}
        />
      </div>
    </ErrorBoundary>
  );
}
