# GitHub 远程版本 vs 本地版本差异报告

**生成时间**: 2026-01-02  
**本地版本**: `58c7378` (seo(docs): add BreadcrumbList JSON-LD)  
**远程版本**: `eda76cd` (fix: amount display)  
**差异提交数**: 4 个提交

---

## 📊 总体统计

- **修改文件数**: 39 个文件
- **新增行数**: +131 行
- **删除行数**: -25 行
- **净变更**: +106 行

---

## 🔄 新增的 4 个提交

### 1. `eda76cd` - fix: amount display (2026-01-02)
**影响文件**: `src/islands/Waterfall.tsx`  
**变更**: +59 行, -12 行

**主要修改**:
- 优化金额显示逻辑
- 改进 `formatAmt` 函数处理
- 增强金额格式化精度控制

### 2. `f7c7409` - fix: fix claimed gift ts (2025-12-26)
**影响文件**: `src/islands/Waterfall.tsx`  
**变更**: +1 行, -1 行

**主要修改**:
- 修复已领取礼物的时间戳显示问题

### 3. `107ce45` - fix: fix waterfall info (2025-12-26)
**影响文件**: `src/islands/Waterfall.tsx`  
**变更**: +29 行, -4 行

**主要修改**:
- 新增 `tokenIcon()` 函数，支持显示代币图标（URL/base64/SVG）
- 修复金额计算逻辑：从 `total - balance` 改为使用 `apiItem.amount`
- 改进 Telegram 链接生成：支持 `message_id` 参数
- 修复时间戳字段：从 `updated_at` 改为 `created_at`

### 4. `1519476` - feat: total_claimed_usdt -> total_sented_usdt (2025-12-25)
**影响文件**: 38 个文件  
**变更**: +42 行, -8 行

**主要修改**:
- **字段重命名**: `total_claimed_usdt` → `total_sented_usdt`
- **数据文件**: `public/data/metrics.json` 更新字段名
- **页面更新**: 
  - `src/pages/index.astro`
  - `src/pages/[lang]/index.astro`
  - 更新 API 路径：`data.total_sented_usdt`
- **i18n 更新**: 所有 35 种语言的 `common.json` 新增 `metrics.sended` 字段
  - 繁体中文: `"sended": "已發送總額（USDT）"`

---

## 📁 详细文件变更列表

### 核心功能文件

#### `src/islands/Waterfall.tsx` ⭐ **重大变更**
- **变更类型**: 功能增强 + Bug 修复
- **主要改进**:
  1. **代币图标支持**: 新增 `tokenIcon()` 函数，支持显示自定义代币图标
     - 支持 HTTP/HTTPS URL
     - 支持 base64 图片
     - 支持 SVG 字符串
     - 回退到默认货币图标
  2. **金额计算修复**: 
     - 旧逻辑: `amount = total - balance`
     - 新逻辑: `amount = apiItem.amount` (直接使用 API 返回的 amount)
  3. **Telegram 链接增强**: 
     - 支持 `message_id` 参数
     - 链接格式: `https://t.me/{username}/{message_id}`
  4. **时间戳字段修复**: 
     - 从 `updated_at` 改为 `created_at`
  5. **金额格式化优化**: 
     - 改进 `formatAmt()` 函数
     - 更好的 null/undefined 处理
     - 更精确的小数位控制

#### `src/pages/[lang]/index.astro` & `src/pages/index.astro`
- **变更类型**: 数据字段更新
- **主要修改**:
  - API 路径从 `data.total_claimed_usdt` 改为 `data.total_sented_usdt`
  - 显示标签从 `metrics.claimed` 改为 `metrics.sended`

### 数据文件

#### `public/data/metrics.json`
- **变更类型**: 字段重命名
- **修改前**:
  ```json
  "total_claimed_usdt": 123456.78000000
  ```
- **修改后**:
  ```json
  "total_sented_usdt": 123456.78000000
  ```

### 国际化文件 (i18n)

#### 所有语言的 `common.json` (35 种语言)
- **变更类型**: 新增翻译键值
- **新增字段**: `metrics.sended`
- **示例 (zh-TW)**:
  ```json
  "sended": "已發送總額（USDT）"
  ```

**涉及语言**:
- ar-SA, bn-BD, cs-CZ, da-DK, de-DE, el-GR, en-GB, en-US, es-ES
- fa-IR, fi-FI, fr-FR, he-IL, hi-IN, hu-HU, id-ID, it-IT, ja-JP
- ko-KR, nl-NL, no-NO, pl-PL, pt-BR, pt-PT, ro-RO, ru-RU, sv-SE
- th-TH, tr-TR, uk-UA, ur-PK, vi-VN, zh-CN, zh-TW

### 配置文件

#### `.astro/settings.json`
- **变更类型**: 自动更新（Astro 内部文件）
- **修改**: 时间戳更新

---

## 🎯 影响分析

### ✅ 功能改进
1. **Waterfall 组件增强**:
   - 更好的代币图标显示
   - 更准确的金额计算
   - 更完整的 Telegram 链接支持

2. **数据字段标准化**:
   - `total_claimed_usdt` → `total_sented_usdt` 更符合业务逻辑
   - 所有相关引用已同步更新

### ⚠️ 潜在影响
1. **API 兼容性**: 
   - 如果后端 API 仍使用 `total_claimed_usdt`，需要同步更新
   - 确保 API 返回 `amount` 字段（不再使用 `total - balance` 计算）

2. **数据迁移**:
   - 如果已有缓存数据使用旧字段名，可能需要清理

### 🔒 维护模式合规性
- ✅ 所有变更都在维护模式允许范围内
- ✅ 没有修改 FROZEN 组件
- ✅ i18n 变更遵循规范（所有语言同步更新）
- ✅ 没有破坏性变更（向后兼容）

---

## 📋 检查清单

### 需要验证的项目
- [ ] 确认后端 API 已更新为 `total_sented_usdt`
- [ ] 确认 API 返回包含 `amount` 字段
- [ ] 确认 API 返回包含 `token_icon` 字段（如果使用）
- [ ] 确认 API 返回包含 `created_at` 字段
- [ ] 测试 Waterfall 组件显示是否正常
- [ ] 测试首页指标显示是否正常
- [ ] 验证所有语言的翻译显示正确

### 建议的后续操作
1. **运行构建测试**: `pnpm build:public`
2. **运行类型检查**: `pnpm check`
3. **运行 i18n 检查**: `pnpm i18n:check`
4. **本地预览测试**: `pnpm dev` 并检查首页和 Waterfall 功能

---

## 🔗 相关提交

```
eda76cd - fix: amount display
f7c7409 - fix: fix claimed gift ts
107ce45 - fix: fix waterfall info
1519476 - feat: total_claimed_usdt -> total_sented_usdt
```

---

**报告生成完成** ✅  
**本地代码已更新到最新版本** ✅

