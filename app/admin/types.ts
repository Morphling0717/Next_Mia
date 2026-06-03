export type {
  EditableSiteConfig as SiteConfig,
  ExpressionItem,
  LiveLink,
  LiveSchedule,
  SongCategory,
} from "@/lib/site-config";

export interface SongItem {
  category: string;
  name: string;
  artist: string;
}

export interface AssetFile {
  name: string;
  path: string;
  time: number;
}

export type AdminTabId =
  | "hero"
  | "model"
  | "live"
  | "video"
  | "footer"
  | "system"
  | "videos"
  | "songs"
  | "mail"
  | "assets";
