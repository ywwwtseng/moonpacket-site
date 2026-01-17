#!/usr/bin/env node
/**
 * 批量替換所有語言版本的 story.json 文件中的 $moonpacket 為 $MOONINI
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MESSAGES_DIR = join(__dirname, '../src/i18n/messages');

async function fixMoonpacketToMoonini() {
  try {
    const locales = await readdir(MESSAGES_DIR);
    let totalFixed = 0;
    let filesProcessed = 0;
    let filesWithIssues = [];

    for (const locale of locales) {
      const storyPath = join(MESSAGES_DIR, locale, 'story.json');
      
      try {
        const content = await readFile(storyPath, 'utf-8');
        const originalContent = content;
        
        // 替換所有 $moonpacket 為 $MOONINI（不區分大小寫）
        // 同時將小寫的 $moonini 統一為大寫 $MOONINI
        let fixedContent = content.replace(/\$moonpacket/gi, '$MOONINI');
        const moonpacketMatches = (originalContent.match(/\$moonpacket/gi) || []).length;
        fixedContent = fixedContent.replace(/\$moonini/g, '$MOONINI');
        const mooniniMatches = (originalContent.match(/\$moonini/g) || []).length;
        
        if (originalContent !== fixedContent) {
          await writeFile(storyPath, fixedContent, 'utf-8');
          totalFixed += moonpacketMatches + mooniniMatches;
          filesProcessed++;
          const changes = [];
          if (moonpacketMatches > 0) changes.push(`${moonpacketMatches} 處 $moonpacket`);
          if (mooniniMatches > 0) changes.push(`${mooniniMatches} 處 $moonini`);
          console.log(`✅ ${locale}: 替換了 ${changes.join(' + ')} → $MOONINI`);
        } else {
          console.log(`⏭️  ${locale}: 無需修改（已正確）`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`⚠️  ${locale}: story.json 不存在，跳過`);
        } else {
          filesWithIssues.push({ locale, error: error.message });
          console.error(`❌ ${locale}: 處理失敗 - ${error.message}`);
        }
      }
    }

    console.log('\n📊 總結:');
    console.log(`   處理文件數: ${filesProcessed}`);
    console.log(`   總替換數: ${totalFixed}`);
    if (filesWithIssues.length > 0) {
      console.log(`   失敗文件數: ${filesWithIssues.length}`);
      filesWithIssues.forEach(({ locale, error }) => {
        console.log(`     - ${locale}: ${error}`);
      });
    }
    
    if (totalFixed > 0) {
      console.log('\n✅ 所有 $moonpacket 已成功替換為 $MOONINI！');
    } else {
      console.log('\n✅ 沒有發現需要替換的內容。');
    }
  } catch (error) {
    console.error('❌ 腳本執行失敗:', error);
    process.exit(1);
  }
}

fixMoonpacketToMoonini();
