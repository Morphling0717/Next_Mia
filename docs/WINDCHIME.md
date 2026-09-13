# 风铃接入与升级

本分支固定接入 `@windchime/embed@0.7.0`，使用仓库内 `vendor/windchime-embed-0.7.0.tgz` 和对应 lockfile，与 UliUli 使用同一压缩包。信件、话题、授权、审核、屏蔽和归档由共享服务维护，Mia 保留网站原有登录、页面和样式。

当前 `/mail` 保留信箱功能，并提供全站桌面连接密钥，需要风铃桌面版 0.7.0 或更高版本。旧密钥与旧配对仍只管理原话题；`/mail/live` 只重定向到 `/mail`，桌面使用的 `/api/mail/live/*` 服务接口继续保留。敏感词默认关闭，开关仅在桌面；关闭后原来标记的来信仍能在私人收件箱正常阅读。

完整连接方式、配置、备份、迁移和 Windows 隔离联调命令见 [风铃 0.7.0 网站与桌面连接](WINDCHIME-LIVE.md)。升级前保存数据库一致备份、私有图片、原环境配置和未入 Git 的资源，在副本上重复迁移及生产构建；保留旧数据库路径和哈希盐，包括历史显式空字符串。

```powershell
npm ci
npm run db:migrate
npm run build
```

这些命令仅在按升级说明完成备份与副本验证后使用。不要把本地构建或依赖升级视为线上已更新；**Mia 本轮不部署生产网站**。

本轮两站各 17 项真实隔离浏览器结果及无完整密钥截图见 [0.7.0 网页验收记录](https://github.com/Morphling0717/WindChime/blob/codex/live-broadcast/docs/evidence/0.7.0/web-browser-report.json)。桌面、打包、采集及部署结果应以各自本轮验收记录为准，不引用旧版本结果代替。

共享服务、两站接入、桌面及打包的本轮结果和限制统一记录在 [0.7.0 总验收报告](https://github.com/Morphling0717/WindChime/blob/codex/live-broadcast/docs/V070-VALIDATION.md)。

[已有部署升级说明](DEPLOY_UPGRADE.md) 中的日期、旧版本及历史验收仍保留原义；当前风铃接入以本文和 `WINDCHIME-LIVE.md` 为准。
