# Boss Frontend Analysis - 2026-07-16

Baseline compared: 2026-07-15

## Versions

- Current Boss index: v10741
- Previous Boss index: v10723
- Current Boss bundle: v6237
- Previous Boss bundle: v6232
- Current Zhipin sign: v5312
- Previous Zhipin sign: v5310

## Asset Diff

- Boss entry scripts moved from `zhipin-boss/index/v10723` to `zhipin-boss/index/v10741`.
- Boss remote bundle moved from `zhipin-boss/bundle/v6232` to `zhipin-boss/bundle/v6237`.
- Zhipin sign entry moved from `v5310` to `v5312`; `iframe-core.7fa9fa18.js` is byte-for-byte unchanged, while `vendors~app` and `app` were rebundled.
- Shared Warlock, APM, MQTT, and browser-check assets kept the previous hashes.

## High-Risk Pattern Hits

- `raw/boss-index-v10741/risk-detection.js`: 99001=2, 99002=1, 99004=1, 99005=1, srcdoc=1, MutationObserver=2, isTrusted=5, sendAction=2, Function(=1, constructor=3, setInterval=1, console=5, devtools=1, security=1.
- `raw/zhipin-sign-v5312/vendors~app.daefb1ca.js`: srcdoc=1, MutationObserver=4, Function(=12, constructor=86, setInterval=4, console=46, verify=5, security=3, 403.html=2.
- `raw/zhipin-sign-v5312/iframe-core.7fa9fa18.js` normalized equal to the 2026-07-15 `v5310` copy after version-path normalization.

## Review Notes

- `risk-detection.js` is byte-for-byte identical to the 2026-07-15 copy after normalizing `v10723`/`v10741` paths; existing request blocking still covers `*zhipin-boss*risk-detection*`.
- No new high-risk script host was introduced on the chat or login entry pages.
- Existing report and risk-navigation guards in `src/common/boss_page_guards.ts` still cover the observed Warlock/APM/reporting and security redirect URLs.

## Recommendation

- Accept this snapshot as the new strict availability baseline and update `src/common/boss_availability.ts` to the new script URLs and guarded hashes.
- Keep the fail-closed policy for future unverified Boss/Zhipin script version changes.
