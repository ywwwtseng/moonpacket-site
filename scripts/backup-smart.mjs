#!/usr/bin/env node

/**
 * 智能備份腳本
 * 備份 i18n 消息文件和重要配置文件
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const BACKUPS_DIR = join(ROOT, 'backups');

// 需要備份的文件和目錄
const BACKUP_PATTERNS = [
  'src/i18n/messages/**/*.json',
  'package.json',
  'public/data/roadmap.json',
  'src/i18n/loadMessages.ts',
];

// 簡單的文件複製函數（不使用 glob，直接遍歷）
function copyFile(src, dest) {
  try {
    const content = readFileSync(src);
    writeFileSync(dest, content);
    return true;
  } catch (error) {
    console.warn(`⚠️  無法備份 ${src}: ${error.message}`);
    return false;
  }
}

// walkDir 函數已移除，直接使用 fs 模塊

async function createBackup() {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .substring(0, 19);
  
  const backupName = `backup_${timestamp}`;
  const backupDir = join(BACKUPS_DIR, backupName);
  
  console.log(`📦 創建備份: ${backupName}\n`);
  
  // 創建備份目錄
  mkdirSync(backupDir, { recursive: true });
  
  let backupCount = 0;
  
  // 備份 i18n 消息文件
  const i18nDir = join(ROOT, 'src/i18n/messages');
  if (existsSync(i18nDir)) {
    const locales = readdirSync(i18nDir).filter(d => {
      const fullPath = join(i18nDir, d);
      return statSync(fullPath).isDirectory();
    });
    
    for (const locale of locales) {
      const localeDir = join(i18nDir, locale);
      const backupLocaleDir = join(backupDir, 'i18n', locale);
      mkdirSync(backupLocaleDir, { recursive: true });
      
      const files = readdirSync(localeDir).filter(f => f.endsWith('.json'));
      
      for (const file of files) {
        const src = join(localeDir, file);
        const dest = join(backupLocaleDir, file);
        if (copyFile(src, dest)) {
          backupCount++;
        }
      }
    }
  }
  
  // 備份重要配置文件
  const importantFiles = [
    'package.json',
    'public/data/roadmap.json',
    'src/i18n/loadMessages.ts',
  ];
  
  for (const file of importantFiles) {
    const src = join(ROOT, file);
    if (existsSync(src)) {
      const dest = join(backupDir, file);
      const destDir = pathDirname(dest);
      mkdirSync(destDir, { recursive: true });
      if (copyFile(src, dest)) {
        backupCount++;
      }
    }
  }
  
  // 創建備份信息文件
  const backupInfo = {
    timestamp: new Date().toISOString(),
    backupName,
    fileCount: backupCount,
    gitStatus: 'N/A', // 可以添加 git status 信息
  };
  
  writeFileSync(
    join(backupDir, 'backup-info.json'),
    JSON.stringify(backupInfo, null, 2)
  );
  
  console.log(`✅ 備份完成！`);
  console.log(`   備份位置: ${backupDir}`);
  console.log(`   備份文件數: ${backupCount}`);
  console.log(`\n💡 提示: 備份保存在 backups/${backupName}/`);
  
  return backupDir;
}

// 主函數
const argv = process.argv.slice(2);
const shouldPush = argv.includes('--push');

if (shouldPush) {
  console.log('⚠️  --push 選項需要 git 配置，當前僅支持本地備份\n');
}

createBackup().catch(error => {
  console.error('❌ 備份失敗:', error);
  process.exit(1);
});
