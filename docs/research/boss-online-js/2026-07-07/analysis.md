# Boss Frontend Analysis - 2026-07-07

Baseline compared: 2026-07-05

## Versions

- Current Boss index: v10604
- Previous Boss index: v10576
- Current Boss bundle: v6199
- Previous Boss bundle: v6199
- Current Zhipin sign: v5303
- Previous Zhipin sign: v5303

## Asset Diff

- Added URLs: 14
- Removed URLs: 14
- Same-URL hash changes: 0

### Added URLs

- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/122.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/140.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/212.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/272.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/278.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/477.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/564.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/692.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/756.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/893.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/app.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/polyfill.js
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/risk-detection.js

### Removed URLs

- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/122.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/140.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/212.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/272.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/278.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/477.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/564.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/692.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/756.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/893.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/app.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/polyfill.js
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/risk-detection.js

## High-Risk Pattern Hits

- raw/static/zhipin/geek/sdk/browser-check-v2.js: Function(=1, console=1
- raw/assets/sdk/apm/patas-compat.2.1.0.min.js: MutationObserver=2, sendAction=1, Function(=1, constructor=43, setInterval=1, console=14
- raw/assets/sdk/apm/patas.2.0.2.min.js: sendAction=1, constructor=7, setInterval=1, console=8
- raw/assets/sdk/warlock/warlockdata.min.2.2.14.js: constructor=3, console=8
- raw/assets/sdk/warlock/warlockdata.min.2.2.15.js: constructor=3, console=8
- raw/boss-index-v10604/risk-detection.js: 99001=2, 99002=1, 99004=1, 99005=1, srcdoc=1, MutationObserver=2, isTrusted=5, sendAction=2, Function(=1, constructor=3, setInterval=1, console=5, devtools=1, security=1
- raw/zhipin-sign-v5303/app.e70560e8.js: sendAction=1, setInterval=1, console=3, verify=6, security=1
- raw/zhipin-sign-v5303/iframe-core.7fa9fa18.js: MutationObserver=5, constructor=8, console=4, devtools=6
- raw/zhipin-sign-v5303/vendors~app.9ac375ae.js: srcdoc=1, MutationObserver=4, Function(=12, constructor=86, setInterval=4, console=46, verify=5, security=3, 403.html=2

## Skipped Nested Script URLs

These URLs were discovered inside downloaded JavaScript but are outside the capture host allowlist.

- https://github.com/dcodeIO/ProtoBuf.js (from https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js)
- https://unpkg.weizhipin.com/@datastar/warlock-detect-dom@latest/dist/index.js (from https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.14.js, https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js)

## Unresolved Inferred Script URLs

These URLs were inferred from webpack runtime chunk ids but could not be downloaded.

- https://img.bosszhipin.com/v2/upload/boss-zhipin/static/debug-update.js: HTTP 404 Not Found while fetching https://img.bosszhipin.com/v2/upload/boss-zhipin/static/debug-update.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js)
- https://img.bosszhipin.com/v2/upload/boss-zhipin/static/update.js: HTTP 404 Not Found while fetching https://img.bosszhipin.com/v2/upload/boss-zhipin/static/update.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/564.js, https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js)
- https://static.zhipin.com/nebula-web/nebulartc-2.3.9.js: HTTP 404 Not Found while fetching https://static.zhipin.com/nebula-web/nebulartc-2.3.9.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js)
- https://static.zhipin.com/static/js/fullpage.0.0.0.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/js/fullpage.0.0.0.js (from https://static.zhipin.com/library/js/plugins/gt.js, https://static.zhipin.com/assets/zhipin/geek/verify-sdk/jiyan/gt.0.5.0.js)
- https://static.zhipin.com/static/js/geetest.0.0.0.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/js/geetest.0.0.0.js (from https://static.zhipin.com/library/js/plugins/gt.js, https://static.zhipin.com/assets/zhipin/geek/verify-sdk/jiyan/gt.0.5.0.js)
- https://static.zhipin.com/static/remoteEntry.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/remoteEntry.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js)
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/357.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/357.js (from https://static.zhipin.com/zhipin-boss/bundle/v6199/static/remoteEntry.js)
- https://static.zhipin.com/zhipin-boss/index/v10604/static/js/375.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-boss/index/v10604/static/js/375.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/polyfill.js, https://static.zhipin.com/zhipin-boss/index/v10604/static/js/app.js, https://static.zhipin.com/zhipin-boss/index/v10604/static/js/risk-detection.js)
- https://static.zhipin.com/zhipin-security/web/boss/index.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-security/web/boss/index.js (from https://static.zhipin.com/zhipin-boss/index/v10604/static/js/620.js)

## Manual Recheck Notes

- `risk-detection.js` is byte-for-byte equivalent after normalizing `zhipin-boss/index/v10576` to `v10604`.
- `polyfill.js` is byte-for-byte equivalent after normalizing `zhipin-boss/index/v10576` to `v10604`.
- `app.js` changes the lazy chunk target from `484` to `620` and entry module id from `44667` to `8867`; this is not only a version-path change.
- VM-level webpack module extraction shows old chunk `484.js` and new chunk `620.js` both contain 499 modules. 498 common module ids are unchanged. The only module-id change is entry module `44667` -> `8867`.
- The entry module diff includes business/UI data changes such as candidate age field rendering (`age` -> `ageDesc`). Risk-related contexts for `99001`, `debugger`, `devtools`, `action_js_risk_monitor`, `action_response_monitor`, `action_boss_monitor`, `warlock_error_action_not_found`, `isTrusted`, `MutationObserver`, and `nonsupport.html` are unchanged.
- Full raw-script URL and `/wapi`/`/web` path extraction, after normalizing index version paths, shows no added or removed URLs/paths.
- Full raw-script risk term totals are unchanged for `99001`, `99002`, `99004`, `99005`, `403.html`, `security.html`, `verify.html`, `safe/verify`, `logapi`, `apm-fe`, `warlock.zhipin.com`, `shink.zhipin.com`, and `zhipin-security`.
- Existing `src/common/boss_page_guards.ts` patterns still cover the current risk surfaces: `*zhipin-boss*risk-detection*`, `*zhipin-security/web/boss/*`, report endpoints, and risk navigation paths.

Conclusion: anti-monitoring / anti-debugging strategy does not appear to have changed. The main Boss index version changed from `v10576` to `v10604`, but treating the index version alone as a disable signal is stricter than the observed anti-monitoring risk change requires.

## Recommendation

- For anti-monitoring strategy checks, do not treat the main Boss index version alone as sufficient evidence of a strategy change.
- Keep archiving and comparing main index scripts for auditability, but gate CLI availability primarily on verified risk scripts, report endpoints, risk navigation paths, and high-risk contexts.
- Update `src/common/boss_availability.ts` after accepting this recheck, so `v10604` does not disable the CLI solely because the index version changed.
- Re-check `src/common/boss_page_guards.ts` request patterns against any new risk, security, or reporting script URLs.
- Update `docs/anti-detection.md` with the new versions and risk findings.
