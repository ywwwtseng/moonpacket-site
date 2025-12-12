# Claim 頁面性能優化文檔

## 問題描述

`/zh-TW/claim/?tab=latest&page=1` 頁面加載速度特別慢，雖然沒有報錯，但用戶體驗不佳。

## 問題分析

### 1. 服務端 API 請求阻塞

**文件**: `src/pages/[lang]/claim.astro`

**問題**:
- 服務端在構建時會並行發起 3 個 API 請求，且無超時設置。
- 如果 API 響應慢，整個頁面構建會被阻塞。

### 2. 客戶端重複請求

**文件**: `src/components/GroupsHero.astro`

**問題**:
- 客戶端腳本在頁面加載時會再次請求 API，即使服務端已提供數據。

## 優化方案

### 方案 1: 添加請求超時（推薦優先實施）

#### 1.1 修改服務端請求 (`src/pages/[lang]/claim.astro`)

**重要提示 (SEO/SSG)**：
此頁面為靜態生成 (SSG)。在 `pnpm build` 構建時，如果 API 請求超時，將導致生成的靜態 HTML 中沒有數據（空列表）。這對 SEO 非常不利。
建議：
- **開發環境 (`dev`)**: 使用短超時（如 3秒）以提升開發體驗。
- **生產構建 (`build`)**: 使用較長超時（如 15-30秒）或失敗時阻止構建，確保發布的頁面有數據。

**操作 1: 修改事件數據請求**
定位到 `eventsUrl` 的 fetch 調用 (約第 105 行)：
```typescript
// 原代碼:
// const response = await fetch(eventsUrl, {
//   cache: 'no-store',
// });

// 替換為:
// 開發環境 3秒超時，生產構建 20秒超時
const TIMEOUT_MS = import.meta.env.DEV ? 3000 : 20000;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

try {
  const response = await fetch(eventsUrl, {
    cache: 'no-store',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  if (response.ok) {
    // ... 原有的數據處理邏輯 ...
  }
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name !== 'AbortError') {
    console.warn('[claim.astro] Failed to fetch events:', err);
  } else {
    console.warn(`[claim.astro] Events API timeout (${TIMEOUT_MS}ms)`);
  }
  // 跑馬燈為非關鍵數據，失敗時使用空數組即可 (優雅降級：隱藏組件)
  tickerEvents = [];
}
```

**操作 2: 修改 `fetchGroups` 函數**
定位到 `fetchGroups` 函數中的 fetch 調用 (約第 184 行)：
```typescript
// 原代碼:
// const response = await fetch(`${chatsUrl}?${params.toString()}`, {
//   cache: 'no-store',
// });

// 替換為:
// 群組數據為核心內容，生產環境給予更多時間
const TIMEOUT_MS = import.meta.env.DEV ? 5000 : 30000;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

try {
  const response = await fetch(`${chatsUrl}?${params.toString()}`, {
    cache: 'no-store',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  if (response.ok) {
    const data: ApiGroupsResponse = await response.json();
    return (data.data || []).map(transformApiGroup);
  }
} catch (err) {
  clearTimeout(timeoutId);
  
  // 核心數據處理策略：
  // 1. 開發環境：返回空數組，允許繼續開發
  // 2. 生產構建 (GitHub Pages)：拋出錯誤終止構建 (Fail Build)
  //    注意：在 GitHub Actions 中，構建失敗會阻止部署，GitHub Pages 將保留上一次成功的版本。
  //    這是保護線上環境的最佳策略：用戶看到舊的完整數據 > 用戶看到新的空白數據。
  if (import.meta.env.PROD) {
    console.error(`[claim.astro] Critical data fetch failed: ${err.message}`);
    throw err; // 讓構建失敗，阻止 GitHub Pages 更新壞掉的版本
  }
  
  if (err.name === 'AbortError') {
    console.warn(`[claim.astro] ${type} groups API timeout (${TIMEOUT_MS}ms)`);
    return [];
  }
  console.warn(`[claim.astro] Failed to fetch ${type} groups:`, err);
  return [];
}
```

#### 1.2 修改客戶端請求 (`src/components/GroupsHero.astro`)

**目標**: 為 `fetchGroupsFromApi` 添加超時。

**操作**: 修改 `fetchGroupsFromApi` 函數 (約第 631 行)：
```javascript
// 原代碼:
// const response = await fetch(`${chatsApiUrl}?${params.toString()}`, {
//   cache: 'no-store',
// });

// 替換為:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超時
try {
  const response = await fetch(`${chatsApiUrl}?${params.toString()}`, {
    cache: 'no-store',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  
  if (response.ok) {
    // ... 原有的響應處理 ...
    const result = await response.json();
    // ... 轉換邏輯 ...
    return { data: transformed, total: result.total || 0 };
  }
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name === 'AbortError') {
    console.warn('[GroupsHero] API request timeout');
    // 超時時使用緩存數據
    return { data: cachedData[type] || [], total: cachedData[type]?.length || 0 };
  }
  console.warn('[GroupsHero] Failed to fetch groups:', err);
}
// 默認返回緩存
return { data: cachedData[type] || [], total: cachedData[type]?.length || 0 };
```

### 方案 2: 優化客戶端渲染策略（中優先級）

**文件**: `src/components/GroupsHero.astro`

**操作**: 修改 `render()` 函數，優先使用緩存數據。

**代碼**:
```javascript
async function render() {
  if (isLoading) return;

  showLoading(true);

  // 如果有 API URL，從 API 獲取數據
  if (chatsApiUrl) {
    // 優化：如果是初始加載且已有緩存數據，先使用緩存快速渲染
    const hasInitialData = cachedData[activeTab] && cachedData[activeTab].length > 0;
    const isInitialLoad = currentPage === 1 && !searchQuery;
    
    if (hasInitialData && isInitialLoad) {
      // 1. 使用現有數據快速渲染
      const source = getSource();
      totalItems = source.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      currentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
      const slice = source.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      
      // 立即渲染，不等待 API
      // 注意：這裡假設 renderGrid 等函數已存在於作用域中
      renderGrid(slice);
      updatePageInfo(totalItems, totalPages);
      updateButtons(currentPage, totalPages);
      updateTabs();
      showLoading(false);
      
      // 2. 異步更新數據（不阻塞渲染）
      setTimeout(async () => {
        if (isLoading) return; // 防止重複請求
        isLoading = true;
        try {
          const result = await fetchGroupsFromApi(activeTab, currentPage, searchQuery || undefined);
          if (result.data.length > 0) {
            cachedData[activeTab] = result.data;
            totalItems = result.total;
            await render(); // 重新渲染
          }
        } catch (err) {
          console.warn('[GroupsHero] Background update failed:', err);
        } finally {
          isLoading = false;
        }
      }, 100);
      return;
    }
    
    // ... 原有的正常請求邏輯 ...
    isLoading = true;
    try {
      const result = await fetchGroupsFromApi(activeTab, currentPage, searchQuery || undefined);
      cachedData[activeTab] = result.data;
      totalItems = result.total;
    } finally {
      isLoading = false;
    }
  } else {
    // 使用緩存的數據
    totalItems = getSource().length;
  }

  // ... 原有的渲染邏輯 ...
  const source = getSource();
  // ...
}
```

## 驗證步驟

1.  **模擬慢速 API**: 使用瀏覽器 DevTools -> Network -> Slow 3G。
2.  **觀察日誌**: 查看控制台是否輸出 `API timeout` 警告。
3.  **檢查頁面**: 確保頁面在超時後仍能顯示（可能無數據，但不應白屏）。

## 實施檢查清單

- [ ] 修改 `src/pages/[lang]/claim.astro` (事件請求超时)
- [ ] 修改 `src/pages/[lang]/claim.astro` (群組請求超时)
- [ ] 修改 `src/components/GroupsHero.astro` (客戶端請求超时)
- [ ] 運行 `pnpm build` 確保無編譯錯誤
- [ ] 運行 `pnpm preview` 並測試加載速度
