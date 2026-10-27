# npm 自动发布认证

`@viyzhu/boss-cli-fork` 使用 GitHub Actions OIDC 可信发布，工作流为
`.github/workflows/tag-publish.yml`。发布和 dist-tag 更新均不读取 `NPM_TOKEN`。

## npm 包设置

在 [npm 包设置](https://www.npmjs.com/package/@viyzhu/boss-cli-fork/access) 配置 GitHub Actions：

| 字段 | 值 |
| --- | --- |
| Organization or user | `Viy1204` |
| Repository | `boss-cli` |
| Workflow filename | `tag-publish.yml` |
| Environment name | 留空；工作流没有配置 GitHub environment |
| Allow npm publish | 开启 |
| Allow npm dist-tag | 开启 |

工作流使用 GitHub-hosted `ubuntu-latest`、Node 22 和固定的 npm `11.21.1`。
`id-token: write` 允许请求 GitHub 身份，npm 包侧的连接决定能否交换及执行操作。
不传 `setup-node` 的 `registry-url`，避免产生 `NODE_AUTH_TOKEN` 占位配置；registry
由 `NPM_CONFIG_REGISTRY` 明确指定。

npm 11.5.1 开始支持 publish OIDC，但 dist-tag OIDC 需要 npm 11.21.0 或更高版本，
且 npm 包设置必须单独授权 dist-tag。不要只升级到 publish 的最低版本。

新连接需要首次成功发布才能完成仓库身份绑定；以 npm 页面显示的截止时间为准。
只做身份交换、dry-run 或发布已有版本都不能完成这一步。若连接过期，正式发版前
删除并重建连接，重新完成身份检查；不要为了验证认证而重发不可覆盖的版本。

## 不发布的身份检查

在 GitHub Actions 的 `tag-publish` 工作流选择 Run workflow，保留
`verify_only=true`（手动运行的默认值）。分支必须包含新工作流和验证脚本。

该模式仅安装指定的 npm，并运行 `scripts/verify-npm-oidc.mjs`：

1. 向 GitHub 请求 audience 为 `npm:registry.npmjs.org` 的 OIDC 身份。
2. 向 npm 的目标包交换端点提交身份，并确认返回了尚未到期的短期凭证。
3. 凭证仅保存在进程内存中，不输出、不写文件、不传给其他进程；认证失败直接报错。

2026-10-27 的真实交换响应中，`created` 和 `expires` 是 Unix 秒数，两者相差
900 秒；与官方 API 文档的 date-time 字符串示例不符。脚本按实测响应校验
`expires` 为整数秒并尚未到期，不猜测替代字段或其他日期格式。

该模式不同步版本、不安装项目依赖、不构建包、不发布、不改 dist-tag，也不创建 Release。
通过只证明 npm 接受当前仓库和工作流身份，不能证明 direct publish 或 dist-tag
写权限。后两项先核对 npm 页面上的允许动作，最终由下次获授权的新版本发布验收。
`npm whoami` 和 `npm publish --dry-run` 都不能替代这个检查或真实发布验收。

## 正式发布

tag push、Release published，或显式关闭 `verify_only` 的手动运行会执行发布路径。
正式操作前确认目标版本、dist-tag 和 npm 连接状态。已存在的版本跳过上传；版本
查询只将 HTTP 404 视为不存在，网络错误及其他 HTTP 错误直接失败。发布和 dist-tag
更新失败都会让作业失败。

## 2026-10-27 诊断记录

v0.8.5 的两次自动发布在 npm PUT 步骤返回 E404；与 2026-10-13 v0.8.4 成功上传
使用完全相同的工作流、Node、npm 和 setup-node action 提交。GitHub `NPM_TOKEN`
更新时间为 2026-07-27 02:46 UTC。npm 侧唯一同日创建的 token 于
2026-10-25 02:42 UTC 到期，其最后访问时间精确落在 v0.8.4 的成功上传步骤内。
这强烈指向 CI 沿用了到期 token；GitHub secret 不可回读，未逐值比较凭证。

v0.8.5 已通过本地有效认证发布，`latest=0.8.5`；本次修复不重发该版本。
2026-10-27 已保存上述 trusted publisher，页面显示待验证，首次成功发布截止
**2026-10-29 07:57 UTC**。身份检查不能消除这项截止限制。

## 官方参考

- [npm 可信发布及允许动作](https://docs.npmjs.com/trusted-publishers/)
- [npm OIDC 交换 API](https://api-docs.npmjs.com/#tag/OIDC/operation/exchangeOidcToken)
- [npm token 到期与权限](https://docs.npmjs.com/about-access-tokens/)
