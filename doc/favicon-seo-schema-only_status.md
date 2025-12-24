# Favicon + SEO Schema（零 UI 變更）執行狀態

本文件用來替代先前散落在 `~/.cursor/plans/` 的多份 plan，讓你在 repo 內能清楚看到「已完成/未完成」。

> 原則：除了 favicon（分頁小圖標）以外，其它改動都只在 `<head>`（JSON-LD / manifest），**用戶看不到**，且 **不動 FROZEN `BaseLayout.astro` 結構**。

## Phase 1：修復 Favicon（用戶唯一可見變更）

- [x] 刪除 `src/pages/favicon.ico.ts`，解除 `/favicon.ico` SVG 動態覆蓋
- [x] 新增 `scripts/generate-favicon.mjs` 並執行 `pnpm gen:favicon`
- [x] 生成並提交以下資產（避免線上 404）：
  - [x] `public/favicon.ico`（含 16/32/48）
  - [x] `public/favicon.png`（48×48）
  - [x] `public/favicon-48.png`（48×48）
  - [x] `public/icons/logo-192.png`（修復 BaseLayout 引用的 404）
  - [x] `public/logo-512.png`
  - [x] `public/apple-touch-icon.png`
- [x] 更新 `public/site.webmanifest`：加入 192/512 PNG icons
- [x] 驗證：`pnpm build:public` 成功

## Phase 2：SEO / AI 身份識別（用戶不可見）

- [x] 確認 `src/config/app.ts` 的 `SOCIAL_LINKS` 正確（Telegram channel/group + X + YouTube）
- [x] 更新 `src/utils/head.ts` 的 `jsonLdOrganization`：自動加入 `sameAs` 與 `logo`（預設 `/logo-512.png`）

## Phase 3：Breadcrumb Schema（用戶不可見）

- [ ] 僅在 Docs 頁面加入 `BreadcrumbList` JSON-LD（目前未做；需要你確認是否要做）

## Phase 4：部署後 GSC（需要你操作）

- [ ] 部署後到 Google Search Console：首頁 URL 檢查 →「請求建立索引」→ 等待 favicon 快取刷新（常見 2–14 天）


