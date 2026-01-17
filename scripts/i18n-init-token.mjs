import fs from 'fs';
import path from 'path';

const ALL_LOCALES = [
  'zh-TW', 'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'ar-SA', 'pt-BR', 'fr-FR', 'de-DE', 'es-ES', 
  'ru-RU', 'it-IT', 'id-ID', 'th-TH', 'vi-VN', 'uk-UA', 'tr-TR', 'pt-PT', 'pl-PL', 'nl-NL', 
  'sv-SE', 'fa-IR', 'he-IL', 'hi-IN', 'hu-HU', 'el-GR', 'bn-BD', 'cs-CZ', 'da-DK', 'no-NO', 
  'ro-RO', 'ur-PK', 'en-GB', 'fi-FI'
];

const SOURCE_LOCALE = 'zh-TW';
const MODULE_NAME = 'token.json';
const BASE_DIR = 'src/i18n/messages';

const sourcePath = path.join(BASE_DIR, SOURCE_LOCALE, MODULE_NAME);
const sourceContent = fs.readFileSync(sourcePath, 'utf8');

console.log(`🚀 Starting i18n initialization for module: ${MODULE_NAME}`);
console.log(`Source: ${sourcePath}`);

let count = 0;
for (const locale of ALL_LOCALES) {
  if (locale === SOURCE_LOCALE) continue;
  
  const targetDir = path.join(BASE_DIR, locale);
  const targetPath = path.join(targetDir, MODULE_NAME);
  
  if (!fs.existsSync(targetDir)) {
    console.warn(`⚠️ Directory not found: ${targetDir}, skipping...`);
    continue;
  }
  
  // Only write if doesn't exist to avoid overwriting existing work
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, sourceContent, 'utf8');
    count++;
  }
}

console.log(`✅ Finished! Initialized ${count} files.`);
