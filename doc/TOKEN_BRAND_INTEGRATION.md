# $MOONINI 代幣視覺與功能整合規範 (Token & Brand Integration Spec)

## 1. 品牌與代幣命名方案 (Naming Conventions)

為了在 Web3 社群建立專業且具備金融屬性的識別度，統一以下命名規範：

| 層級 | 顯示文本 | 使用場景 | 視覺特性 |
| :--- | :--- | :--- | :--- |
| **品牌/吉祥物** | `moonini` | 品牌識別、URL、社群交流 | 全小寫，特殊字體 |
| **代幣符號** | `$MOONINI` | 文中指代資產、價格顯示、DEX 交易 | **Cashtag ($)**，全大寫，金色漸層 |
| **代幣名稱** | `Moonini` | 合約名稱、法律文檔、掃描器 Name 欄位 | 首字母大寫，常規字體 |

---

## 2. 視覺原子化規範 (Visual Atomic Concepts)

### 2.1 核心顏色與效果
*   **Token Gold**: 複用 `--gold` (`#f3ba2f`)。
*   **Glow Effect**: `$MOONINI` 在文中應具備微弱的金光感 (`text-shadow`)。
*   **Glassmorphism**: 所有的交易組件需複用 `backdrop-blur-xl` 搭配 `bg-[var(--card-bg)]/80`。

### 2.2 CSS 擴充 (`src/styles/theme.css`)
新增 `.token-mark` 類別：
```css
.token-mark {
  color: var(--gold);
  font-weight: 700;
  text-shadow: 0 0 8px rgba(243, 186, 47, 0.3);
  font-family: var(--font-mono); /* 增加代幣的數位質感 */
}
```

---

## 3. 技術實現路徑 (Technical Roadmap)

### 3.1 基礎配置 (`src/config/token.ts`)
建立代幣的唯一事實來源 (SSOT)：
*   **地址**: `0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe`
*   **鏈**: BSC (Binance Smart Chain)
*   **交易連結**: PancakeSwap 官方 Widget 適配 URL。

### 3.2 升級 `brandify()` 輪子
升級 `src/lib/brandify.ts` 以自動識別並轉換：
1.  `moonini` -> `<span class="brand-mark">moonini</span>`
2.  `$MOONINI` -> `<span class="token-mark">$MOONINI</span>`
3.  **自動鏈結**: 文中的合約地址自動縮短並連結至 BscScan。

---

## 4. 新增開發組件清單 (Components Checklist)

### 4.1 `PriceChip` (Navbar Island)
*   **功能**: 實時抓取 DexScreener API 價格。
*   **動效**: 幣價跳動時具備微秒級的顏色過渡。

### 4.2 `SwapModal` (Pancake Widget)
*   **整合**: 嵌入官方 PancakeSwap Widget。
*   **觸發點**: 
    *   Navbar 的 "Buy $MOONINI" 按鈕。
    *   Litepaper 註冊表卡片的 "Trade Now" 按鈕。

---

## 5. i18n 消息對齊

為了維持專案的模組化架構，建議建立獨立的 `token.json` 模組，專門管理代幣與交易相關的金融術語。

### 5.1 建議鍵值結構 (`src/i18n/messages/{locale}/token.json`)
```json
{
  "buy_now": "立即購買 $MOONINI",
  "trade_on_pancake": "在 PancakeSwap 交易",
  "price": "幣價",
  "price_change_24h": "24h 漲跌",
  "contract_address": "合約地址",
  "copy_address": "複製地址",
  "copy_success": "地址已複製",
  "view_on_bscscan": "在 BscScan 查看",
  "swap_modal": {
    "title": "購買 $MOONINI",
    "close": "關閉"
  }
}
```

### 5.2 使用範例
```astro
---
import { loadAllMessages } from '@/i18n/loadMessages';
const messages = await loadAllMessages(lang);
const tokenMsgs = messages.token || {};
---
<button set:html={brandify(tokenMsgs.buy_now)}></button>
```

---

## 6. 組件開發詳細規格

### 6.1 `PriceChip` 組件 (`src/islands/PriceChip.tsx`)

**功能需求：**
- **實時數據**：透過 SWR 抓取 DexScreener API。
- **加載狀態 (Skeleton)**：數據載入時，顯示一個寬度約 80px 的灰色脈衝骨架屏，避免 Navbar 佈局抖動。
- **異常降級**：API 失敗時，顯示最後快取價格，若無快取則顯示 `--` 並在 Console 記錄。

### 6.2 `SwapWidgetContainer` 組件 (`src/components/SwapWidgetContainer.astro`)

**原子化複用：**
- **功能**：封裝統一的交易組件外殼（玻璃材質、金邊、內距）。
- **用途**：在首頁、Litepaper 結尾處調用，確保視覺一致性。

### 6.3 `SwapModal` 組件 (`src/islands/SwapModal.tsx`)
... (保持原規格) ...

### 6.4 互動反饋 (Feedback Loop)
- **地址複製**：點擊地址標籤 (`.address-mark`) 時，標籤背景應閃爍一次金光 (`bg-[var(--gold)]/20`)，提供明確的視覺確認。

**功能需求：**
- 使用 PancakeSwap 官方 Widget (iframe 或 React 組件)
- 支持深色模式主題
- 響應式設計（移動端適配）
- 關閉按鈕與點擊外部區域關閉功能

**PancakeSwap Widget 配置：**
```typescript
const widgetConfig = {
  theme: "dark",
  defaultInputCurrency: "BNB", // 或 "ETH" 根據用戶選擇
  defaultOutputCurrency: "0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe",
  width: "100%",
  height: "500px"
};
```

**視覺規範：**
- 彈窗背景：`bg-[var(--bg)]/90` + `backdrop-blur-xl`
- 邊框：`border border-[var(--gold)]/30`
- 陰影：`shadow-2xl shadow-black/50`
- 動效：使用 `framer-motion` 實現滑入效果（從右側或底部）

### 6.3 `TokenRegistryCard` 升級 (`src/pages/[lang]/docs/litepaper.astro`)

**變更內容：**
- 將靜態的合約地址列表轉換為互動式卡片
- 每個地址旁增加：
  1. **複製按鈕**：點擊後複製完整地址，顯示 Toast 提示
  2. **查看按鈕**：連結至 BscScan
  3. **交易按鈕**（僅代幣合約）：觸發 `SwapModal`

**視覺升級：**
- 卡片背景：`bg-[var(--card-bg)]/90`
- Hover 效果：`hover:border-[var(--gold)]/50`
- 地址顯示：使用 `.address-mark` 樣式（等寬字體 + 背景色）

---

## 7. 實施優先級與驗證步驟

### 7.1 開發順序（建議）

1. **Phase 1: 基礎設施** ✅ 已完成
   - [x] 建立 `src/config/token.ts`
   - [x] 升級 `src/styles/theme.css` (`.token-mark`, `.address-mark`)
   - [x] 升級 `src/lib/brandify.ts` (支持 `$MOONINI` 和地址自動鏈結)

2. **Phase 2: 核心功能** ✅ 已完成
   - [x] 開發 `PriceChip` 組件
   - [x] 開發 `SwapModal` 組件
   - [x] 在 Navbar 整合 `PriceChip`

3. **Phase 3: 頁面整合** ✅ 已完成
   - [x] 升級 Litepaper 的 `TokenRegistryCard`
   - [x] 在首頁 Hero 增加 "Buy $MOONINI" CTA
   - [x] 在 Whitepaper 的開發者指南區塊增加交易入口

4. **Phase 4: i18n 完善** 🚧 進行中
   - [x] 為主要語言添加 `token` 模組的翻譯 (zh-TW, zh-CN, en-US)
   - [ ] 為所有語言添加 `token` 模組的翻譯 (進行中)
   - [x] 驗證所有頁面的品牌詞顯示正確

### 7.2 驗證檢查清單

#### 視覺驗證
- [ ] 所有 `$MOONINI` 文字顯示為金色並帶有微弱光暈
- [ ] 所有 `moonini` (品牌) 文字使用 `.brand-mark` 樣式
- [ ] 合約地址自動轉換為可點擊的 BscScan 連結
- [ ] 深色模式下所有組件對比度符合 WCAG AA 標準

#### 功能驗證
- [ ] `PriceChip` 能正確顯示實時價格
- [ ] `SwapModal` 能正常載入 PancakeSwap Widget
- [ ] 地址複製功能在所有瀏覽器正常工作
- [ ] 所有按鈕的 i18n 文字正確顯示

#### 跨語言驗證
- [ ] 測試主要語言（zh-TW, zh-CN, en-US）的所有功能
- [ ] 驗證 RTL 語言（ar-SA, fa-IR, he-IL, ur-PK）的布局正常
- [ ] 確認所有 `token` 模組的翻譯已同步

### 7.3 性能考量

- **PriceChip**: 使用 SWR 或 React Query 進行數據緩存，避免過度請求
- **SwapModal**: 使用 `client:visible` 指令，僅在用戶需要時載入 Widget
- **地址鏈結**: 使用 `rel="noopener noreferrer"` 確保安全性

---

## 8. 遷移指南 (Migration Guide)

### 8.1 現有代碼遷移

**Before (舊寫法):**
```astro
<p>你可以賺取 moonini 代幣</p>
<p>合約地址：0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe</p>
```

**After (新寫法):**
```astro
---
import { brandify } from '@/lib/brandify';
const text = '你可以賺取 $MOONINI 代幣';
const address = '合約地址：0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe';
---
<p set:html={brandify(text)}></p>
<p set:html={brandify(address)}></p>
```

### 8.2 自動化檢查

運行以下命令檢查全站品牌詞使用情況：
```bash
# 掃描所有文件中的品牌詞使用
pnpm scan:i18n

# 檢查 i18n 完整性
pnpm i18n:check
```

---

## 9. 設計原則總結

1. **原子化優先**: 所有視覺元素都應可複用，避免重複定義
2. **i18n 優先**: 嚴禁硬編碼，所有文字必須從 i18n 消息文件載入
3. **向後兼容**: 升級 `brandify()` 時確保現有頁面不受影響
4. **性能優先**: 使用懶加載和緩存策略，避免影響頁面載入速度
5. **無障礙優先**: 所有互動元素需符合 WCAG 2.1 AA 標準

---

## 10. 參考資源

- **PancakeSwap Widget 文檔**: https://docs.pancakeswap.finance/developers/smart-contracts/pancakeswap-exchange/widgets
- **DexScreener API**: https://docs.dexscreener.com/
- **BscScan API**: https://docs.bscscan.com/
- **品牌顏色變量**: `src/styles/theme.css`
- **代幣配置**: `src/config/token.ts`

---

## 11. 實施狀態追蹤

### ✅ 已完成項目

- [x] **品牌命名規範定義** - 明確區分 `moonini` (品牌)、`$MOONINI` (代幣符號)、`Moonini` (代幣名稱)
- [x] **CSS 樣式擴充** - 新增 `.token-mark` 和 `.address-mark` 類別
- [x] **代幣配置檔案** - 建立 `src/config/token.ts` 作為唯一事實來源
- [x] **`brandify()` 函數升級** - 支持自動識別和轉換
- [x] **PriceChip 組件** - Navbar 實時價格顯示
- [x] **SwapModal 組件** - PancakeSwap Widget 整合
- [x] **TokenRegistryCard 升級** - Litepaper 互動式地址卡片
- [x] **首頁與文檔整合** - index.astro, whitepaper.astro 交易入口整合

### 🚧 待開發項目

- [ ] **i18n 消息擴充** - 為全語言 (35+) 補齊 `token` 模組翻譯 (進行中)

### 📝 使用範例

#### 在 Astro 組件中使用
```astro
---
import { brandify } from '@/lib/brandify';
const text = '你可以賺取 $MOONINI 代幣，合約地址：0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe';
---
<p set:html={brandify(text)}></p>
```

**輸出效果：**
- `$MOONINI` 顯示為金色並帶有光暈效果
- 合約地址自動轉換為可點擊的 BscScan 連結（顯示為 `0xe4d5...Befe`）

#### 在 i18n 消息中使用
```json
{
  "common": {
    "token": {
      "buy_now": "立即購買 $MOONINI",
      "description": "moonini 是我們的品牌吉祥物，$MOONINI 是可交易的代幣"
    }
  }
}
```

**注意：** 在 i18n JSON 中直接寫入 `$MOONINI` 和 `moonini`，`brandify()` 會自動處理。

---

## 12. 技術債務與注意事項

### 12.1 已知限制

1. **地址匹配**: 目前只匹配完整的 42 字符地址，不處理部分地址或縮短格式
2. **多鏈支持**: 目前只支持 BSC 鏈，未來如需支持其他鏈需要擴展配置
3. **性能考量**: `brandify()` 函數會對每個字符串進行多次正則替換，對於超長文本可能有性能影響

### 12.2 未來優化方向

- [ ] 考慮使用更高效的字符串處理方式（如狀態機）
- [ ] 支持多鏈地址識別（Ethereum, Polygon 等）
- [ ] 添加地址驗證邏輯（checksum 驗證）
- [ ] 支持自定義地址顯示格式（可配置縮短長度）

---

**文檔版本**: v1.0  
**最後更新**: 2026-01-17  
**維護者**: Moonpacket 開發團隊
