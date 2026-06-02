# 星眠Mia · 云端教堂

天使猫猫见习牧师 **星眠Mia** 的官方主站。

奶油 + 圣金 + 朱砂红的"祈祷室"配色，主站包含直播状态、Live2D 立绘、本地视频归档、歌单、匿名发信箱（WindChime）等模块。

## 技术栈

- Next.js 16 (App Router) + Turbopack
- React 18 / TypeScript / Tailwind v4
- SQLite (`sqlite3`) 持久化 site_config / songs / mail
- 图标：`tdesign-icons-react`
- 第三方：`@windchime/embed`（vendored）/ `three` / `sweetalert2`

## 目录结构（精简）

```
app/
  page.tsx              # 主站首屏（SSR 拉取 site_config + songs）
  admin/                # 文案后台
  mail/                 # 发信箱后台
  api/                  # config / mail / admin 接口
components/
  Dashboard.tsx         # Hero / Model / LiveStatus / Gallery
  SongSystem.tsx        # 歌单（已移除扭蛋/出金）
  Effects.tsx           # 自定义光标 + Three.js 背景
  mail/                 # 邮件 modal / banner / theme
lib/
  db.ts                 # SQLite + mail helper
  site-data.ts          # SSR 数据加载
public/                 # Mia.webp / app.jpg / og-image.jpg / sw.js
scripts/init-full-config.js  # 一次性 DB 默认值灌入
```

## 本地开发

```bash
nvm use            # 读 .nvmrc
npm install
cp .env.example .env.local
node scripts/init-full-config.js  # 首次创建 codes.db
npm run dev
```

打开：

- 主站 <http://localhost:3000/>
- 文案后台 <http://localhost:3000/admin>
- 发信箱后台 <http://localhost:3000/mail>

## 关键环境变量

| 变量 | 说明 |
| --- | --- |
| `ADMIN_PASSWORD` | `/admin` 与 `/mail`（未单独配置时）的密码 |
| `MAIL_AUTH_PASSWORD` | 可选，`/mail` 独立密码 |
| `DATABASE_PATH` | SQLite 文件路径，默认 `./codes.db` |
| `NEXT_PUBLIC_SITE_URL` | 站点公开 URL（用于 OG / sitemap / robots） |
| `WINDCHIME_HASH_SALT` | 发信指纹 hash salt（生产请改） |
| `MAIL_BLOCKED_TERMS` | 可选，初始敏感词逗号分隔 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | 可选 Cloudflare Turnstile 校验 |

## Docker 部署

```bash
docker compose build --no-cache
docker compose up -d
```

`./data` 持久化 SQLite，`./public/memes` `./public/pic` 持久化资源目录。

## 与旧 UliUli 站点的差异

- 移除：扭蛋 / 出金弹窗、隐藏歌单、Konami 秘籍、`/app` PWA 独立壳、`/m/*` 多歌房、小游戏（DGP / 名字大乱斗）。
- 新增：奶油 / 圣金 / 朱砂红主题 CSS 变量（`--mia-*`）、Cinzel/Cormorant Garamond/Italianno/Noto Serif SC 字体栈。
- 图标库由 `lucide-react` 切换为 `tdesign-icons-react`。
