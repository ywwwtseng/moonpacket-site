# 品牌词 (Brand Words) 应用检查报告

## 检查范围
- 所有页面 (`src/pages/[lang]/*.astro`)
- 所有组件 (`src/components/*.astro`)
- 所有 i18n 消息文件 (`src/i18n/messages/**/*.json`)

## 检查标准
1. **必须使用 `@/lib/brandify` 函数**：统一处理 `moonpacket` 和 `moonini`
2. **禁止使用本地 brandify 函数**：确保一致性
3. **所有可能包含品牌词的文本字段**：必须通过 `set:html={brandify(...)}` 渲染

---

## ✅ 已正确使用的页面和组件

以下页面和组件已正确使用 `@/lib/brandify` 函数：

1. ✅ `src/pages/[lang]/index.astro` - 已使用 `@/lib/brandify`
2. ✅ `src/pages/index.astro` - 已使用 `@/lib/brandify`
3. ✅ `src/pages/[lang]/send.astro` - 已使用 `@/lib/brandify`
4. ✅ `src/pages/[lang]/claim.astro` - 已使用 `@/lib/brandify`
5. ✅ `src/pages/[lang]/about.astro` - 已使用 `@/lib/brandify`
6. ✅ `src/pages/[lang]/faq.astro` - 已使用 `@/lib/brandify`
7. ✅ `src/pages/[lang]/groups.astro` - 已使用 `@/lib/brandify`（服务端）
8. ✅ `src/pages/[lang]/pricing.astro` - 已使用 `@/lib/brandify`
9. ✅ `src/pages/[lang]/contact.astro` - 已使用 `@/lib/brandify`
10. ✅ `src/pages/[lang]/careers.astro` - 已使用 `@/lib/brandify`
11. ✅ `src/pages/[lang]/team.astro` - 已使用 `@/lib/brandify`
12. ✅ `src/pages/[lang]/blog/index.astro` - 已使用 `@/lib/brandify`
13. ✅ `src/pages/[lang]/blog/[slug].astro` - 已使用 `@/lib/brandify`
14. ✅ `src/pages/[lang]/terms.astro` - 已使用 `@/lib/brandify`
15. ✅ `src/pages/[lang]/privacy.astro` - 已使用 `@/lib/brandify`
16. ✅ `src/pages/[lang]/docs/*.astro` - 已通过 `brandify` 或 `Brandify` 组件处理
17. ✅ `src/components/HeroTextAnimated.astro` - 已使用 `@/lib/brandify`
18. ✅ `src/components/PricingTable.astro` - 已使用 `@/lib/brandify`
19. ✅ `src/components/DisclaimerBanner.astro` - 已使用 `@/lib/brandify`
20. ✅ `src/layouts/BaseLayout.astro` - SEO 字段已使用 `@/lib/brandify`（第 71-72 行）
21. ✅ `src/components/Roadmap.astro` - 已使用 `@/lib/brandify`（刚修复）

---

## 发现的问题

✅ **所有问题已修复**

### ✅ 已修复的问题

#### 1. ✅ `src/components/Roadmap.astro` - 已添加 brandify 处理

**修复内容**：
- 导入了 `brandify` 函数
- 为所有文本字段添加了 `brandify` 处理：
  - `roadmapMessages?.title`
  - `updatedLabelFinal`
  - `title` (phase title)
  - `desc` (phase description)
  - `status` (phase status)
  - `accept` (phase accept)
  - `laneLabel` (lane label)
  - `progressLabel` (progress label)
- `aria-label` 和 `aria-valuetext` 使用纯文本（去除 HTML 标签）

**修复时间**：2025-01-XX

---

#### 2. ✅ `src/pages/[lang]/groups.astro` - 已优化客户端脚本

**修复内容**：
- 移除了客户端脚本中的手动 `.replace()` 方法
- 改为依赖全局客户端 brandify 脚本（`BaseLayout.astro` 中已实现）
- 确保代码规范统一，避免重复逻辑

**修复时间**：2025-01-XX

---

### 📋 可忽略的情况（设计如此，不需要修复）

1. **`BaseLayout.astro` 第 171 行**：硬编码的版权信息 `<span class="brand-mark">moonpacket</span>`
   - 这是固定的品牌显示，不需要动态 brandify

2. **`BaseLayout.astro` 第 116 行**：JSON-LD 结构化数据中的硬编码品牌名 `'moonpacket'`
   - 结构化数据中的品牌名应保持原样，符合 Schema.org 规范

3. **`BrandWordMoonpacket.astro`、`BrandWordMoonini.astro` 等组件**：
   - 这些是专门用于显示品牌词的组件，设计就是显示品牌词，不需要 brandify

---

## ⚠️ 重要发现：全局客户端 Brandify 脚本

### BaseLayout.astro 中的客户端 Brandify
**发现**：`src/layouts/BaseLayout.astro` 第 246-287 行包含一个全局客户端脚本，会自动扫描所有文本节点并应用 brandify。

**工作原理**：
- 脚本在页面加载后扫描 `document.body` 中的所有文本节点
- 跳过已有 `brand-mark` 或 `brand-word` class 的父元素（避免重复处理）
- 跳过 `SCRIPT`, `STYLE`, `CODE`, `PRE`, `LINK`, `META`, `TITLE` 等标签内的文本
- 使用 `MutationObserver` 监听动态添加的内容

**影响分析**：
1. ✅ **使用 `set:html={brandify(...)}` 是正确的**：服务端生成的 `<span class="brand-mark">` 会被客户端脚本跳过（因为 shouldSkip 检查）
2. ✅ **`<title>` 和 `<meta>` 标签不需要 brandify**：这些标签在 SKIP 集合中，不会被客户端脚本处理，但**SEO 标签应该保持纯文本**（用户看不到 HTML 标签效果，搜索引擎只索引纯文本）
3. ⚠️ **普通文本节点会被客户端处理**：但如果服务端已处理，客户端会跳过，所以**服务端 brandify 仍然是最佳实践**
4. ❌ **直接使用 `class="brand-mark"` 包裹整个文本是错误的**：应该使用 `brandify` 函数只标记品牌词

---

## 注意事项

1.  **统一使用 `@/lib/brandify`**：不要创建本地 `brandify` 函数
2.  **使用 `set:html`**：`brandify` 返回 HTML，必须使用 `set:html={brandify(...)}`
3.  **处理空值**：使用 `brandify(text || '')` 避免 `undefined`/`null` 错误
4.  **Markdown 链接支持**：`@/lib/brandify` 已支持 `[文字](URL)` 格式
5.  **HTML 转义**：`@/lib/brandify` 会自动处理 HTML 转义
6.  **客户端脚本不会重复处理**：使用 `set:html={brandify(...)}` 生成的内容会被客户端脚本跳过
7.  **`<title>` 和 `<meta>` 不需要 brandify**：SEO 标签应该保持纯文本，因为用户看不到 HTML 标签效果，搜索引擎也只索引纯文本（**已修复**：BaseLayout 已移除 brandify 处理）
8.  **不要直接使用 `class="brand-mark"` 包裹整个文本**：应该使用 `brandify` 函数只标记品牌词

---

## 相关文档

- [品牌词 CSS 样式修复文档](./brand-word-css-fix.md) - 关于品牌词在暗色模式下正确显示的 CSS 修复方案

---

## 文档更新记录

- **2025-01-XX**：移除所有页面 SEO 标题中的 brandify（SEO 标签不需要 brandify，应保持纯文本）
- **2025-01-XX**：按照文档修复了所有剩余问题（Roadmap.astro 和 groups.astro）
- **2025-01-XX**：全面审查代码状态，移除已修复的问题，仅保留真正需要处理的问题
- 之前版本：包含已修复的问题，已过时

生成时间：2025-01-XX  
最后更新：完成所有修复后  
检查工具：代码审查 + `grep` + 语义搜索  
状态：✅ 所有问题已修复

## ⚠️ SEO 标签处理说明

**重要发现**：SEO 标签（`<title>` 和 `<meta description>`）**不需要** brandify，因为：

1. **用户看不到**：浏览器标签页和搜索结果只显示纯文本，HTML 标签会被忽略
2. **搜索引擎只索引纯文本**：HTML 标记对 SEO 没有帮助
3. **代码简洁**：避免不必要的 HTML 标记，减少文件大小

**正确做法**：
- ✅ SEO 标签传入纯文本给 `BaseLayout`
- ✅ `BaseLayout` 直接使用纯文本，不进行 brandify
- ✅ 页面正文内容（用户可见部分）使用 `set:html={brandify(...)}`

**已修复**：所有页面的 SEO 标题和描述都已移除 brandify，`BaseLayout.astro` 也已移除 brandify 处理。
