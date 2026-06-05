# Next_Mia 升级部署说明

这份文档给负责部署网页的人使用。目标是：升级代码时不覆盖 `.env.local` 和数据库，并且每次升级前都有可回滚的数据库备份。

## 本次架构升级内容

- 新增数据库备份脚本：`npm run db:backup`
- 新增数据库迁移脚本：`npm run db:migrate`
- 新增健康检查接口：`/api/health`
- 新增 B 站数据缓存代理：`/api/bilibili`
- 后台登录改为服务端 HttpOnly Cookie session
- 发信/登录限流改为 SQLite 持久化记录

## 部署前确认

服务器上的这些文件必须由部署环境自己保留，不要从 GitHub 覆盖：

- `.env.local`
- `data/codes.db`
- `public/memes/`
- `public/pic/`

`.env.local` 推荐至少包含：

```env
ADMIN_PASSWORD=强密码
MAIL_AUTH_PASSWORD=邮箱后台密码
SESSION_SECRET=一段随机字符串
WINDCHIME_HASH_SALT=一段随机字符串
DATABASE_PATH=/app/data/codes.db
NEXT_PUBLIC_SITE_URL=https://你的域名
BILIBILI_CACHE_TTL_SECONDS=120
BILIBILI_STALE_TTL_SECONDS=1800
```

生成随机字符串可以用：

```bash
openssl rand -hex 32
```

## 标准升级流程

在服务器项目目录执行：

```bash
cd /path/to/Next_Mia
```

1. 拉取代码前先备份数据库：

```bash
docker compose exec website npm run db:backup
```

如果容器还没启动，也可以在宿主机备份：

```bash
cp data/codes.db "data/codes.backup-$(date +%Y%m%d-%H%M%S).db"
```

2. 拉取 GitHub 最新代码：

```bash
git pull origin main
```

3. 重新构建镜像：

```bash
docker compose build website
```

4. 启动新版本：

```bash
docker compose up -d
```

5. 执行数据库迁移：

```bash
docker compose exec website npm run db:migrate
```

迁移只会新增运行态表和迁移记录，不会删除旧表，也不会清空业务数据。

6. 检查健康状态：

```bash
curl -fsS https://你的域名/api/health
```

正常时会看到：

```json
{
  "ok": true,
  "database": {
    "integrity": "ok"
  }
}
```

7. 检查 B 站代理：

```bash
curl -fsS https://你的域名/api/bilibili
```

正常响应里应该有：

```json
{
  "success": true,
  "cached": false,
  "stale": false
}
```

如果外部 API 临时失败，但有旧缓存可用，`stale` 会是 `true`，网站仍能显示上一份成功数据。

## 回滚方式

如果新版本启动后异常：

1. 先查看健康检查：

```bash
curl https://你的域名/api/health
```

2. 回到上一个 Git 提交：

```bash
git log --oneline -5
git checkout 上一个提交ID
docker compose build website
docker compose up -d
```

3. 如果数据库也需要回滚，先停服务，再恢复备份：

```bash
docker compose stop website
cp data/你的备份.db data/codes.db
docker compose up -d
```

只有在确认需要数据库回滚时才执行这一步。大多数代码问题只需要回滚代码，不需要动数据库。

## 常见问题

### 1. 登录后台后为什么不用每次输入密码了？

现在第一次输入密码后，服务器会给浏览器一张 HttpOnly Cookie 通行证。前端 JavaScript 读不到这张通行证，所以比每次请求都带密码更安全。

### 2. 限流记录会不会塞满数据库？

不会。代码会定期清理超过 1 小时没用的限流记录。这个表只保存临时运行态数据，不影响站点配置、歌单和来信。

### 3. B 站缓存会不会让数据不实时？

会有最多几分钟的延迟，这是有意设计。它换来的是：外部 API 抽风时，网站可以用上一次成功数据顶上，不会直接显示错误。

### 4. 没有 Turnstile 可以部署吗？

可以。没有 `TURNSTILE_SECRET` 时，人机验证会跳过，仍然有 IP/指纹限流。之后如果找到适合中国访问的人机验证服务，再接入也可以。
