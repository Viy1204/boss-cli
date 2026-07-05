# Boss Frontend Analysis - 2026-07-05

Baseline compared: 2026-07-01

## Versions

- Current Boss index: v10576
- Previous Boss index: v10493
- Current Boss bundle: v6199
- Previous Boss bundle: v6189
- Current Zhipin sign: v5303
- Previous Zhipin sign: v5303

## Asset Diff

- Added URLs: 41
- Removed URLs: 17
- Same-URL hash changes: 0

### Added URLs

- https://img.bosszhipin.com/static/file/2024/qrcode.min.js
- https://img.bosszhipin.com/static/zhipin/geek/sdk/browser-check-v2.js
- https://img.bosszhipin.com/v2/upload/npm/boss-js-upload/boss-js-upload-1.0.39.min.js
- https://static.zhipin.com/assets/sdk/apm/patas.2.0.2.min.js
- https://static.zhipin.com/assets/sdk/nebula-web/NebulaASR-1.2.0.js
- https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js
- https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js
- https://static.zhipin.com/assets/zhipin/chat/swiper.min.js
- https://static.zhipin.com/assets/zhipin/geek/verify-sdk/jiyan/gt.0.5.0.js
- https://static.zhipin.com/assets/zhipin/geek/verify-sdk/verify-sdk-v4.1.js
- https://static.zhipin.com/assets/zhipin/geek/verify-sdk/verify-sdk-v5.js
- https://static.zhipin.com/library/js/plugins/gt.js
- https://static.zhipin.com/zhipin-boss/assets/library/js/BenzAMRRecorder-1.1.5.min.js
- https://static.zhipin.com/zhipin-boss/assets/library/js/lottie-5.9.6.min.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/100.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/117.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/140.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/212.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/270.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/278.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/366.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/471.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/526.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/692.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/754.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/756.js
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/remoteEntry.js
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

### Removed URLs

- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/100.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/117.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/140.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/212.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/270.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/278.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/366.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/471.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/526.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/692.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/754.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/js/756.js
- https://static.zhipin.com/zhipin-boss/bundle/v6189/static/remoteEntry.js
- https://static.zhipin.com/zhipin-boss/index/v10493/static/js/app.js
- https://static.zhipin.com/zhipin-boss/index/v10493/static/js/polyfill.js
- https://static.zhipin.com/zhipin-boss/index/v10493/static/js/risk-detection.js
- https://www.zhipin.com/zhipin-security/web/geek/polyfill/index.js

## High-Risk Pattern Hits

- raw/static/zhipin/geek/sdk/browser-check-v2.js: Function(=1, console=1
- raw/assets/sdk/apm/patas-compat.2.1.0.min.js: MutationObserver=2, sendAction=1, Function(=1, constructor=43, setInterval=1, console=14
- raw/assets/sdk/apm/patas.2.0.2.min.js: sendAction=1, constructor=7, setInterval=1, console=8
- raw/assets/sdk/warlock/warlockdata.min.2.2.14.js: constructor=3, console=8
- raw/assets/sdk/warlock/warlockdata.min.2.2.15.js: constructor=3, console=8
- raw/boss-index-v10576/risk-detection.js: 99001=2, 99002=1, 99004=1, 99005=1, srcdoc=1, MutationObserver=2, isTrusted=5, sendAction=2, Function(=1, constructor=3, setInterval=1, console=5, devtools=1, security=1
- raw/zhipin-sign-v5303/app.e70560e8.js: sendAction=1, setInterval=1, console=3, verify=6, security=1
- raw/zhipin-sign-v5303/iframe-core.7fa9fa18.js: MutationObserver=5, constructor=8, console=4, devtools=6
- raw/zhipin-sign-v5303/vendors~app.9ac375ae.js: srcdoc=1, MutationObserver=4, Function(=12, constructor=86, setInterval=4, console=46, verify=5, security=3, 403.html=2

## Skipped Nested Script URLs

These URLs were discovered inside downloaded JavaScript but are outside the capture host allowlist.

- https://github.com/dcodeIO/ProtoBuf.js (from https://static.zhipin.com/assets/zhipin/chat/mqtt-v1.2.min.js)
- https://unpkg.weizhipin.com/@datastar/warlock-detect-dom@latest/dist/index.js (from https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.14.js, https://static.zhipin.com/assets/sdk/warlock/warlockdata.min.2.2.15.js)

## Unresolved Inferred Script URLs

These URLs were inferred from webpack runtime chunk ids but could not be downloaded.

- https://img.bosszhipin.com/v2/upload/boss-zhipin/static/debug-update.js: HTTP 404 Not Found while fetching https://img.bosszhipin.com/v2/upload/boss-zhipin/static/debug-update.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js)
- https://img.bosszhipin.com/v2/upload/boss-zhipin/static/update.js: HTTP 404 Not Found while fetching https://img.bosszhipin.com/v2/upload/boss-zhipin/static/update.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/564.js, https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js)
- https://static.zhipin.com/nebula-web/nebulartc-2.3.9.js: HTTP 404 Not Found while fetching https://static.zhipin.com/nebula-web/nebulartc-2.3.9.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js)
- https://static.zhipin.com/static/js/fullpage.0.0.0.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/js/fullpage.0.0.0.js (from https://static.zhipin.com/library/js/plugins/gt.js, https://static.zhipin.com/assets/zhipin/geek/verify-sdk/jiyan/gt.0.5.0.js)
- https://static.zhipin.com/static/js/geetest.0.0.0.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/js/geetest.0.0.0.js (from https://static.zhipin.com/library/js/plugins/gt.js, https://static.zhipin.com/assets/zhipin/geek/verify-sdk/jiyan/gt.0.5.0.js)
- https://static.zhipin.com/static/remoteEntry.js: HTTP 404 Not Found while fetching https://static.zhipin.com/static/remoteEntry.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js)
- https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/357.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-boss/bundle/v6199/static/js/357.js (from https://static.zhipin.com/zhipin-boss/bundle/v6199/static/remoteEntry.js)
- https://static.zhipin.com/zhipin-boss/index/v10576/static/js/375.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-boss/index/v10576/static/js/375.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/polyfill.js, https://static.zhipin.com/zhipin-boss/index/v10576/static/js/app.js, https://static.zhipin.com/zhipin-boss/index/v10576/static/js/risk-detection.js)
- https://static.zhipin.com/zhipin-security/web/boss/index.js: HTTP 404 Not Found while fetching https://static.zhipin.com/zhipin-security/web/boss/index.js (from https://static.zhipin.com/zhipin-boss/index/v10576/static/js/484.js)

## Recommendation

- Keep boss-cli disabled until the archived raw scripts are manually reviewed.
- Update `src/common/boss_availability.ts` only after accepting the new script versions and hashes.
- Re-check `src/common/boss_page_guards.ts` request patterns against any new risk, security, or reporting script URLs.
- Update `docs/anti-detection.md` with the new versions and risk findings.

## Manual Review Notes

- `risk-detection.js` is byte-for-byte equivalent after normalizing `zhipin-boss/index/v10493` to `v10576`; observed differences are version-path changes only.
- `zhipin-sign/v5303/static/js/vendors~app.9ac375ae.js` is unchanged from the 2026-07-01 baseline.
- `zhipin-boss/bundle/remoteEntry.js` is equivalent after normalizing `v6189` to `v6199`.
- `src/common/boss_page_guards.ts` already covers the new direct risk script URL via `*zhipin-boss*risk-detection*` and the login `browser-check-v2.js` URL via `*bosszhipin.com/static/zhipin/geek/sdk/*`.
- Required code change: update `src/common/boss_availability.ts` to the 2026-07-05 verified baseline and current script hashes. No guard-strategy change is required from this capture.
