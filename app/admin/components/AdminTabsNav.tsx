"use client";

import { FolderIcon as FolderOpen } from "tdesign-icons-react";
import { AdminTabId } from "../types";

interface AdminTabsNavProps {
  activeTab: AdminTabId;
  onSwitchTab: (tab: AdminTabId) => void;
}

const TABS: Array<{ id: AdminTabId; label: string; icon?: "folder" }> = [
  { id: "hero", label: "首页 (Hero)" },
  { id: "model", label: "档案 (Model)" },
  { id: "live", label: "直播 (Live)" },
  { id: "video", label: "视频墙 (Video)" },
  { id: "footer", label: "底部 (Footer)" },
  { id: "system", label: "系统文案" },
  { id: "videos", label: "视频标题 (Titles)" },
  { id: "songs", label: "歌单 (Songs)" },
  { id: "mail", label: "发信箱 (Mail)" },
  { id: "assets", label: "资源 (Assets)", icon: "folder" },
];

export function AdminTabsNav({ activeTab, onSwitchTab }: AdminTabsNavProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSwitchTab(tab.id)}
          className={`px-4 py-2 rounded-lg font-bold transition text-sm flex items-center gap-1 ${
            activeTab === tab.id ? "tab-active" : "tab-inactive"
          }`}
        >
          {tab.icon === "folder" && <FolderOpen className="w-3 h-3" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
