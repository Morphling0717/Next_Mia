export const DEFAULT_BILIBILI_API_URL =
  "https://1377297588-5v9c60xnw1.ap-guangzhou.tencentscf.com/?mid=3706975546248092";

export interface BilibiliApiUser {
  name?: string;
  face?: string;
  fans?: number | string;
  attention?: number | string;
  is_live?: boolean;
  live_title?: string;
  live_url?: string;
  live_cover?: string;
}

export interface BilibiliApiVideo {
  title: string;
  pic: string;
  bvid?: string;
  url: string;
  length: string;
  play: number | string;
  comment?: number | string;
  created?: number | string;
  date: string;
  desc?: string;
}

export interface BilibiliApiResponse {
  success?: boolean;
  error?: string;
  uid?: string;
  user?: BilibiliApiUser;
  videos?: BilibiliApiVideo[];
  video_count?: number;
  video_source?: string;
}

interface BilibiliFetchOptions {
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatBilibiliError = (data: BilibiliApiResponse) =>
  data.error || "Bilibili API returned an unsuccessful response";

export async function fetchBilibiliData(
  url = DEFAULT_BILIBILI_API_URL,
  { retries = 2, retryDelayMs = 800, timeoutMs = 15000 }: BilibiliFetchOptions = {},
) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Bilibili API HTTP ${response.status}`);
      }

      const data = (await response.json()) as BilibiliApiResponse;
      if (data.success !== true) {
        throw new Error(formatBilibiliError(data));
      }

      return data;
    } catch (error) {
      lastError = error;
      if (attempt >= retries) break;
      await wait(retryDelayMs * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Bilibili API request failed");
}
