# 品牌词 CSS 样式修复文档

## 问题描述

在检查 `send` 页面时发现，FAQ 标题中的品牌词（`moonpacket`）在暗色模式下可能没有正确显示品牌样式。经过检查发现：

1. 所有页面的标题（h1, h2, h3）都没有设置颜色类，依赖继承
2. `.brand-mark` 类设计为继承父元素颜色，但在某些容器（如 `.faq-card`）中可能未正确继承
3. 需要添加全局 CSS 规则确保所有页面的品牌词样式一致

## 检查结果

### 所有页面的标题样式（均无颜色类，依赖继承）

#### 首页 (index.astro)
- h2: `text-2xl md:text-3xl font-bold` - ✅ 已使用 `brandify()`
- h3: `text-lg font-semibold` - ✅ 已使用 `brandify()`

#### About 页面 (about.astro)
- h1: `text-3xl font-bold` - ✅ 已使用 `brandify()`

#### Send 页面 (send.astro)
- h2 (section): `text-lg font-semibold` - ✅ 已使用 `brandify()`
- h3 (FAQ titles): `text-base font-semibold leading-snug` - ✅ 已使用 `brandify()`

#### Claim 页面 (claim.astro)
- h2 (section): `text-xl font-semibold` - ✅ 已使用 `brandify()`
- h3 (FAQ titles): `text-base font-semibold leading-snug` - ✅ 已使用 `brandify()`

**结论**: 所有页面的品牌词都已正确使用 `brandify()` 函数，HTML 输出也正确。问题在于 CSS 继承。

## 根本原因

1. `.brand-mark` 类设计为 `color: inherit`（不设置固定颜色）
2. 在暗色模式下，`body` 设置了 `color: var(--text)`，标题应该继承
3. 但在某些嵌套容器（如 `.faq-card`）中，`.brand-mark` 可能没有正确继承颜色
4. 需要添加明确的 CSS 规则确保继承正确

## 修复方案

### 文件: `src/styles/theme.css`

在 `.brand-mark` 样式定义后（约第 103 行之后）添加以下 CSS 规则：

```css
/* 确保所有标题内的 brand-mark 正确继承颜色（全局规则，所有页面一致） */
[data-theme="dark"] h1 .brand-mark,
[data-theme="dark"] h2 .brand-mark,
[data-theme="dark"] h3 .brand-mark,
[data-theme="dark"] h4 .brand-mark,
[data-theme="dark"] h5 .brand-mark,
[data-theme="dark"] h6 .brand-mark {
  color: inherit !important;
}

/* 确保 FAQ 卡片内的标题和品牌词正确继承颜色 */
[data-theme="dark"] .faq-card h3 {
  color: var(--text) !important;
}

[data-theme="dark"] .faq-card h3 .brand-mark {
  color: inherit !important;
}

/* 确保所有容器内的 brand-mark 正确继承颜色（兜底规则） */
[data-theme="dark"] .brand-mark {
  color: inherit !important;
}
```

### 修复位置

在 `src/styles/theme.css` 的第 103 行（`.brand-mark` 样式定义结束）之后添加。

### 修复原因

1. **确保继承链完整**: 明确告诉浏览器 `.brand-mark` 应该继承父元素颜色
2. **针对 FAQ 卡片**: FAQ 卡片有特殊的容器样式，需要额外确保
3. **全局一致性**: 所有页面使用相同的规则，确保行为一致
4. **暗色模式优先**: 只在暗色模式下应用，不影响浅色模式

## 预期效果

修复后：
1. ✅ 所有页面的品牌词在暗色模式下都能正确显示
2. ✅ 品牌词正确继承父元素的文本颜色
3. ✅ 所有页面行为一致，无需单独为每个页面添加颜色类
4. ✅ 不影响现有的浅色模式样式

## 测试建议

修复后，请测试以下页面确认品牌词正确显示：

1. ✅ 首页 (zh-TW, en-US): `http://localhost:4321/zh-TW/` 和 `http://localhost:4321/en-US/`
2. ✅ About 页面: `http://localhost:4321/zh-TW/about/`
3. ✅ Send 页面: `http://localhost:4321/zh-TW/send/` 和 `http://localhost:4321/en-US/send/`
4. ✅ Claim 页面: `http://localhost:4321/zh-TW/claim/`
5. ✅ 其他所有包含品牌词的页面

## 注意事项

1. 使用 `!important` 是为了确保覆盖可能的其他样式
2. `color: inherit` 确保品牌词继承父元素颜色，而不是设置固定颜色
3. 这个修复是全局性的，会影响所有页面，确保一致性
4. 不需要修改任何页面文件，只需要修改 CSS 文件

## 相关文件

- `src/styles/theme.css` - 需要修改的文件
- `src/lib/brandify.ts` - 品牌词处理函数（无需修改）
- `src/pages/[lang]/*.astro` - 所有页面文件（无需修改）

