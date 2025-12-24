# MAINTENANCE MODE（維護模式）— Moonpacket Site

本文件是本專案的**維護期硬規範**，與 `.cursorrules` 搭配使用。目標是：**新增功能不破壞既有功能**、**遵守既有架構與 i18n 流程**、**避免為了「做新東西」而改壞舊東西**。

> 優先級：若本文件與一般工程慣例衝突，**以本文件與 `.cursorrules` 為準**。

---

## 1) 維護期核心原則（必遵守）

1. **最小變更原則**：只改「解決問題所需的最少範圍」。避免重構、避免重新排版、避免無關整理。
2. **向後兼容**：任何改動不得破壞既有 URL、既有導覽、既有 i18n key 結構與既有 UI 行為。
3. **可回滾**：每次改動都要能用單一 commit 或少量 commits 回滾，不要混雜多個不相關議題在同一個提交。
4. **沿用既有結構**：新增頁面/功能時，優先複用現有模式（同類頁面怎麼做就照做），不要引入另一套架構。

---

## 2) FROZEN/LOCKED 元件規則（最高優先級）

凡是標記 `🔒 FROZEN COMPONENT` / `LOCKED` 的檔案（例如 `src/layouts/BaseLayout.astro`）：

- **禁止**：修改結構、調整 DOM、改動任何可見文字、改動邏輯流程、調整 head 結構（新增/刪除 tag）等。
- **僅允許**（兩類）：  
  1) 將硬編碼文字移到 i18n（優先 zh-TW）  
  2) 將內聯 URL 替換成 `src/config/links.ts` 常量

若出現「非改 FROZEN 不可」的情況：必須先尋找替代方案（新增資產、改非 FROZEN 工具函數、改頁面層），仍不可行才升級處理並明確記錄理由。

---

## 3) i18n（嚴格）規範

### 3.1 禁止事項
- 禁止語言混用（zh-TW 頁只渲染 zh-TW 字串；en-US 同理）
- 禁止 fallback 字串（例如 `|| 'English'`）
- 缺失處理：一律使用空字串 `''`
- 禁止硬編碼 URL（必須使用 `src/config/links.ts` / `src/config/app.ts` 等配置）

### 3.2 新增文案流程（必走）
1. 先在 `src/i18n/messages/zh-TW/{module}.json` 新增 key
2. 用既有 i18n 工具同步/檢查（依 `.cursorrules` 的 build 前檢查）
3. 頁面渲染時一律 `xxx || ''`（不使用 fallback 文案）

---

## 4) 品牌詞（brandify）規範

- 凡是會出現在 UI 的內容（尤其是可含 HTML/markdown 的段落），包含 `moonpacket` / `moonini` 時使用 `brandify()`。
- 若文字需要渲染 HTML：用 `set:html={brandify(text || '')}`。
- SEO 的 `<title>` 與 `<meta name="description">`：**不要**輸出 HTML markup（純文字即可）。

---

## 5) SEO / 索引（維護期策略）

1. **不要用 robots.txt 阻擋 404 頁**以達到去索引；Soft 404 核心靠 `noindex` meta。
2. canonical 需一致且為絕對 URL（使用現有工具 `computeCanonical()`）。
3. 結構化資料（JSON-LD）僅放在 `<head>`，不影響 UI；內容要可被爬蟲抓取。

---

## 6) UI/UX（維護期策略）

- 不做「主觀美化」或「重新排版」除非需求明確要求。
- 新增區塊/元件時：優先跟隨現有版型（同頁面風格、spacing、色彩變量、暗色模式規範）。
- 可訪問性：新增互動元素必須有 `aria-*`、鍵盤可操作。

---

## 7) 代碼規範（TypeScript / Astro）

- TS strict；ES2017 目標（避免不必要的現代語法，尤其在 client script）。
- Astro：能用 Astro 元件就不用 React；需要互動才用 islands。
- 客戶端腳本：避免在 client 端做 SEO 相關拼裝（SEO 優先 SSR/SSG）。
- 禁止 `console.log()` 留在生產代碼；允許 `console.warn()`（可控範圍、必要時）。

---

## 8) 連結與常量（禁止硬編碼 URL）

所有外部連結必須集中於：
- `src/config/links.ts`（通用外部連結）
- `src/config/app.ts`（CTA / 社群連結）

任何頁面/元件禁止硬編碼 URL。

---

## 9) 每次變更的最小驗證清單（必做）

在提交前至少完成：
- `pnpm build:public`（確保 SSG 對公開語言構建成功）
- 若改 i18n：`pnpm i18n:audit && pnpm i18n:check && pnpm i18n:normalize`

---

## 10) 變更管理（避免「新功能破壞舊功能」）

1. **每次需求只做一件事**：不要把不相關修正塞進同一批。
2. **新增功能不要改寫既有資料結構**：除非能保證相容且已全站掃描。
3. **先加新路徑/新 key，再逐步切換**：避免直接替換造成回歸。

---

## 11) AI / Cursor 執行規則（協作約束）

- **不要生成多份計劃文件**：每次工作僅維護一份 plan（若有），完成後可刪除或歸檔。
- 不要改動不相關檔案（例如格式化整個 repo、重排 import 等）。
- 遇到 FROZEN 限制必須先提出「不改 FROZEN 的替代方案」再動手。


