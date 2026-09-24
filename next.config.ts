import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 锁定项目根目录，避免 Turbopack 在带非 ASCII 字符的路径（例如 "网页开发"）下
// 错误地把父目录当作 workspace 根，从而导致 `tailwindcss` 等依赖解析失败。
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const buildDirectory = process.env.WINDCHIME_BUILD_DIRECTORY?.trim() || ".next";
if (buildDirectory !== ".next" && !/^\.windchime-[A-Za-z0-9_-]+$/.test(buildDirectory)) {
  throw new Error("WINDCHIME_BUILD_DIRECTORY must be .next or one relative .windchime-* directory");
}

const nextConfig: NextConfig = {
  distDir: buildDirectory,
  transpilePackages: ["@windchime/embed"],
  serverExternalPackages: ["sqlite3", "sharp"],
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
