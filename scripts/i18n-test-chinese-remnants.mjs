#!/usr/bin/env node

/**
 * i18n 全自動化測試：檢測所有語言中的中文殘留
 * 檢查「流動性池」和「緊急提款多簽錢包」等中文詞彙是否出現在非中文語言中
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const I18N_DIR = join(ROOT, 'src/i18n/messages');

// 需要檢測的中文詞彙（繁體和簡體）
// 注意：日文使用漢字是正常的，所以「市場流動性」在日文中是正確的
// 但「流動性池」和「緊急提款多簽錢包」這些特定詞彙應該被翻譯
const CHINESE_PATTERNS = [
  '流動性池',      // 這個應該被翻譯（不是日文常用詞）
  '緊急提款多簽錢包', // 這個應該被翻譯
  '流动性池',      // 簡體版本
  '紧急提款多签钱包', // 簡體版本
  // 注意：不包含「市場流動性」，因為這是日文正規用詞
];

// 允許中文的語言（這些語言可以有中文）
const ALLOWED_CHINESE_LANGS = ['zh-TW', 'zh-CN'];

async function testChineseRemnants() {
  const locales = await readdir(I18N_DIR);
  const issues = [];
  let totalFiles = 0;
  let totalIssues = 0;

  for (const locale of locales) {
    if (locale === '.DS_Store' || locale.endsWith('.bak')) continue;
    
    // 跳過允許中文的語言
    if (ALLOWED_CHINESE_LANGS.includes(locale)) continue;
    
    const filePath = join(I18N_DIR, locale, 'docs.json');
    
    try {
      const content = await readFile(filePath, 'utf-8');
      totalFiles++;
      
      // 檢查每個中文模式
      for (const pattern of CHINESE_PATTERNS) {
        if (content.includes(pattern)) {
          // 找出具體位置（行號和上下文）
          const lines = content.split('\n');
          const matches = [];
          
          lines.forEach((line, index) => {
            if (line.includes(pattern)) {
              // 提取上下文（前後各 2 行）
              const context = lines.slice(Math.max(0, index - 2), index + 3)
                .map((l, i) => {
                  const lineNum = index - 2 + i + 1;
                  const marker = i === 2 ? '>>>' : '   ';
                  return `${marker} ${lineNum}: ${l.substring(0, 100)}`;
                })
                .join('\n');
              
              matches.push({
                line: index + 1,
                context: context
              });
            }
          });
          
          if (matches.length > 0) {
            issues.push({
              locale,
              pattern,
              count: matches.length,
              matches: matches
            });
            totalIssues += matches.length;
          }
        }
      }
    } catch (error) {
      console.error(`❌ ${locale}: 無法讀取文件 - ${error.message}`);
    }
  }

  // 輸出報告
  console.log('=== i18n 中文殘留自動化測試報告 ===\n');
  console.log(`檢查文件數: ${totalFiles}`);
  console.log(`發現問題數: ${totalIssues}\n`);

  if (issues.length === 0) {
    console.log('✅ 所有非中文語言都沒有中文殘留！');
    process.exit(0);
  } else {
    console.log('❌ 發現以下中文殘留：\n');
    
    for (const issue of issues) {
      console.log(`\n📍 ${issue.locale}: 發現 "${issue.pattern}" (${issue.count} 處)`);
      issue.matches.forEach((match, idx) => {
        console.log(`\n  位置 ${idx + 1} (第 ${match.line} 行):`);
        console.log(match.context);
      });
    }
    
    console.log(`\n\n❌ 測試失敗：共發現 ${totalIssues} 處中文殘留`);
    console.log(`\n建議執行以下命令修復：`);
    console.log(`  pnpm run i18n:fix:chinese`);
    process.exit(1);
  }
}

testChineseRemnants().catch(error => {
  console.error('測試執行錯誤:', error);
  process.exit(1);
});
