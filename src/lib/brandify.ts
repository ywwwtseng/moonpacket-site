export function escapeHtml(input: string): string {
  return input
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/"/g, "&quot;")
    .replaceAll(/'/g, "&#39;");
}

/**
 * 將 Markdown 連結轉換為 HTML 連結
 * 支援格式：[文字](URL)
 */
function markdownLinksToHtml(s: string): string {
  // 匹配 Markdown 連結格式：[文字](URL)
  // 使用非貪婪匹配，避免匹配多個連結
  return s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // 對文字和 URL 進行 HTML 轉義
    const escapedText = escapeHtml(text);
    const escapedUrl = escapeHtml(url);
    // 使用特殊標記來保護連結，避免後續 escapeHtml 處理
    return `__MARKDOWN_LINK_START__${escapedUrl}__MARKDOWN_LINK_SEP__${escapedText}__MARKDOWN_LINK_END__`;
  });
}

/**
 * 還原被保護的 Markdown 連結為 HTML
 */
function restoreMarkdownLinks(s: string): string {
  return s.replace(/__MARKDOWN_LINK_START__([^_]+)__MARKDOWN_LINK_SEP__([^_]+)__MARKDOWN_LINK_END__/g, 
    '<a href="$1" class="link">$2</a>');
}

// Replace case-insensitively, preserve original casing in text content by always rendering lower-case visually.
export function brandify(input?: string): string {
  const s = (input ?? "").toString();
  // 先處理 Markdown 連結（轉換為特殊標記）
  let result = markdownLinksToHtml(s);
  // 然後 escape HTML
  result = escapeHtml(result);
  // 還原 Markdown 連結為 HTML
  result = restoreMarkdownLinks(result);
  
  // 先處理代幣品牌字：$moonini (不區分大小寫) -> $MOONINI (全大寫，token-mark)
  // 優先處理帶 $ 的符號，避免被後續的品牌詞處理影響
  result = result.replace(/\$moonini/gi, '<span class="token-mark">$MOONINI</span>');
  
  // Replace all occurrences of "moonpacket" (case-insensitive) with brand-mark span.
  result = result.replace(/moonpacket/gi, '<span class="brand-mark">moonpacket</span>');
  // Replace all occurrences of "moonini" (不帶 $，case-insensitive) with brand-mark span.
  // 使用單詞邊界 \b 確保只匹配完整的單詞，避免匹配 $moonini 中的 moonini
  result = result.replace(/\bmoonini\b/gi, '<span class="brand-mark">moonini</span>');
  
  return result;
}
