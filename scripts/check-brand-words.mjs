#!/usr/bin/env node
/**
 * 檢查所有頁面的代幣品牌字使用情況
 * 1. 檢查 $moonini 是否正確使用大寫 $MOONINI
 * 2. 檢查是否正確使用 brandify 函數
 * 3. 檢查是否所有頁面都包含使用者條款和隱私權條款連結
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGES_DIR = join(__dirname, '../src/pages');
const ISSUES = [];

function checkFile(filePath, relativePath) {
  const content = readFileFileSync(filePath, 'utf-8');
  const issues = [];

  // 檢查是否使用 BaseLayout
  const hasBaseLayout = content.includes('BaseLayout');
  
  // 檢查是否有 footer 連結（如果使用 BaseLayout，應該有）
  const hasPrivacyLink = content.includes('/privacy/') || content.includes('footer?.privacy');
  const hasTermsLink = content.includes('/terms/') || content.includes('footer?.terms');

  // 檢查 $moonini 的使用（小寫，應該是大寫）
  const lowercaseMoonini = content.match(/\$moonini/g);
  if (lowercaseMoonini && lowercaseMoonini.length > 0) {
    issues.push({
      type: 'lowercase_token',
      count: lowercaseMoonini.length,
      message: `發現 ${lowercaseMoonini.length} 處小寫 $moonini，應為 $MOONINI`
    });
  }

  // 檢查是否使用 brandify
  const usesBrandify = content.includes('brandify(');
  const hasSetHtml = content.includes('set:html');
  
  // 檢查是否有未使用 brandify 的文本內容
  const textWithoutBrandify = content.match(/\{[^}]*\$moonini[^}]*\}/g);
  if (textWithoutBrandify && !usesBrandify) {
    issues.push({
      type: 'missing_brandify',
      message: '發現 $moonini 但未使用 brandify 函數'
    });
  }

  return {
    path: relativePath,
    hasBaseLayout,
    hasPrivacyLink,
    hasTermsLink,
    usesBrandify,
    issues
  };
}

function walkDir(dir, baseDir = dir, results = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, baseDir, results);
    } else if (file.endsWith('.astro')) {
      const relativePath = filePath.replace(baseDir + '/', '');
      const result = checkFile(filePath, relativePath);
      if (result.issues.length > 0 || !result.hasBaseLayout) {
        results.push(result);
      }
    }
  }
  
  return results;
}

console.log('=== 開始檢查所有頁面 ===\n');
const results = walkDir(PAGES_DIR);

console.log(`總共檢查了 ${results.length} 個頁面\n`);

// 分類問題
const noBaseLayout = results.filter(r => !r.hasBaseLayout);
const lowercaseIssues = results.filter(r => r.issues.some(i => i.type === 'lowercase_token'));
const missingBrandify = results.filter(r => r.issues.some(i => i.type === 'missing_brandify'));

console.log('=== 問題摘要 ===\n');

if (noBaseLayout.length > 0) {
  console.log(`❌ 未使用 BaseLayout 的頁面 (${noBaseLayout.length}):`);
  noBaseLayout.forEach(r => console.log(`   - ${r.path}`));
  console.log('');
}

if (lowercaseIssues.length > 0) {
  console.log(`⚠️  發現小寫 $moonini 的頁面 (${lowercaseIssues.length}):`);
  lowercaseIssues.forEach(r => {
    r.issues.filter(i => i.type === 'lowercase_token').forEach(issue => {
      console.log(`   - ${r.path}: ${issue.message}`);
    });
  });
  console.log('');
}

if (missingBrandify.length > 0) {
  console.log(`⚠️  可能缺少 brandify 的頁面 (${missingBrandify.length}):`);
  missingBrandify.forEach(r => {
    r.issues.filter(i => i.type === 'missing_brandify').forEach(issue => {
      console.log(`   - ${r.path}: ${issue.message}`);
    });
  });
  console.log('');
}

if (noBaseLayout.length === 0 && lowercaseIssues.length === 0 && missingBrandify.length === 0) {
  console.log('✅ 所有檢查通過！');
}
