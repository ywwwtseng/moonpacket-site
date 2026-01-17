#!/usr/bin/env node

/**
 * 一次性修復所有語言中「流動性池」和「緊急提款多簽錢包」的中文殘留
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const I18N_DIR = join(ROOT, 'src/i18n/messages');

// 各語言的完整翻譯
const translations = {
  'zh-TW': {
    pool: "Liquidity Pool (LP) (市場流動)",
    multisig: "Governance Multisig (權力中心)"
  },
  'zh-CN': {
    pool: "Liquidity Pool (LP) (市场流动)",
    multisig: "Governance Multisig (权力中心)"
  },
  'en-US': {
    pool: "Liquidity Pool (LP) (Market Liquidity)",
    multisig: "Governance Multisig (Power Center)"
  },
  'en-GB': {
    pool: "Liquidity Pool (LP) (Market Liquidity)",
    multisig: "Governance Multisig (Power Centre)"
  },
  'ja-JP': {
    pool: "Liquidity Pool (LP) (市場流動性)",
    multisig: "Governance Multisig (権力センター)"
  },
  'ko-KR': {
    pool: "Liquidity Pool (LP) (시장 유동성)",
    multisig: "Governance Multisig (권력 센터)"
  },
  'es-ES': {
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)"
  },
  'fr-FR': {
    pool: "Liquidity Pool (LP) (Liquidité du Marché)",
    multisig: "Governance Multisig (Centre de Pouvoir)"
  },
  'de-DE': {
    pool: "Liquidity Pool (LP) (Marktliquidität)",
    multisig: "Governance Multisig (Machtzentrum)"
  },
  'it-IT': {
    pool: "Liquidity Pool (LP) (Liquidità di Mercato)",
    multisig: "Governance Multisig (Centro di Potere)"
  },
  'pt-BR': {
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)"
  },
  'pt-PT': {
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)"
  },
  'ru-RU': {
    pool: "Liquidity Pool (LP) (Рыночная Ликвидность)",
    multisig: "Governance Multisig (Центр Власти)"
  },
  'ar-SA': {
    pool: "Liquidity Pool (LP) (سيولة السوق)",
    multisig: "Governance Multisig (مركز السلطة)"
  },
  'hi-IN': {
    pool: "Liquidity Pool (LP) (बाजार तरलता)",
    multisig: "Governance Multisig (शक्ति केंद्र)"
  },
  'th-TH': {
    pool: "Liquidity Pool (LP) (สภาพคล่องตลาด)",
    multisig: "Governance Multisig (ศูนย์อำนาจ)"
  },
  'vi-VN': {
    pool: "Liquidity Pool (LP) (Thanh Khoản Thị Trường)",
    multisig: "Governance Multisig (Trung Tâm Quyền Lực)"
  },
  'id-ID': {
    pool: "Liquidity Pool (LP) (Likuiditas Pasar)",
    multisig: "Governance Multisig (Pusat Kekuasaan)"
  },
  'tr-TR': {
    pool: "Liquidity Pool (LP) (Piyasa Likiditesi)",
    multisig: "Governance Multisig (Güç Merkezi)"
  },
  'pl-PL': {
    pool: "Liquidity Pool (LP) (Płynność Rynku)",
    multisig: "Governance Multisig (Centrum Władzy)"
  },
  'nl-NL': {
    pool: "Liquidity Pool (LP) (Marktliquiditeit)",
    multisig: "Governance Multisig (Machtcentrum)"
  },
  'sv-SE': {
    pool: "Liquidity Pool (LP) (Marknadslikviditet)",
    multisig: "Governance Multisig (Maktcentrum)"
  },
  'da-DK': {
    pool: "Liquidity Pool (LP) (Markedslikviditet)",
    multisig: "Governance Multisig (Magtcenter)"
  },
  'no-NO': {
    pool: "Liquidity Pool (LP) (Markedslikviditet)",
    multisig: "Governance Multisig (Maktssenter)"
  },
  'fi-FI': {
    pool: "Liquidity Pool (LP) (Markkinoiden Likviditeetti)",
    multisig: "Governance Multisig (Valtakeskus)"
  },
  'cs-CZ': {
    pool: "Liquidity Pool (LP) (Tržní Likvidita)",
    multisig: "Governance Multisig (Centrum Moci)"
  },
  'hu-HU': {
    pool: "Liquidity Pool (LP) (Piaci Likviditás)",
    multisig: "Governance Multisig (Hatalom Központ)"
  },
  'ro-RO': {
    pool: "Liquidity Pool (LP) (Lichiditate de Piață)",
    multisig: "Governance Multisig (Centru de Putere)"
  },
  'el-GR': {
    pool: "Liquidity Pool (LP) (Ρευστότητα Αγοράς)",
    multisig: "Governance Multisig (Κέντρο Εξουσίας)"
  },
  'he-IL': {
    pool: "Liquidity Pool (LP) (נזילות שוק)",
    multisig: "Governance Multisig (מרכז כוח)"
  },
  'fa-IR': {
    pool: "Liquidity Pool (LP) (نقدینگی بازار)",
    multisig: "Governance Multisig (مرکز قدرت)"
  },
  'ur-PK': {
    pool: "Liquidity Pool (LP) (مارکیٹ لیکویڈیٹی)",
    multisig: "Governance Multisig (پاور سینٹر)"
  },
  'uk-UA': {
    pool: "Liquidity Pool (LP) (Ринкова Ліквідність)",
    multisig: "Governance Multisig (Центр Влади)"
  },
  'bn-BD': {
    pool: "Liquidity Pool (LP) (বাজার তারল্য)",
    multisig: "Governance Multisig (পাওয়ার সেন্টার)"
  }
};

async function fixAllChineseRemnants() {
  const locales = await readdir(I18N_DIR);
  let totalFixed = 0;
  let totalSkipped = 0;

  for (const locale of locales) {
    if (locale === '.DS_Store' || locale.endsWith('.bak')) continue;
    
    const filePath = join(I18N_DIR, locale, 'docs.json');
    const trans = translations[locale];
    
    if (!trans) {
      console.log(`⏭️  ${locale}: 無翻譯對照表，跳過`);
      totalSkipped++;
      continue;
    }
    
    try {
      let content = await readFile(filePath, 'utf-8');
      let modified = false;
      
      // 檢查並替換 docs.content.contracts.items 中的中文
      if (content.includes('"pool": "Liquidity Pool (流動性池)"')) {
        content = content.replace(
          /"pool": "Liquidity Pool \(流動性池\)"/g,
          `"pool": "${trans.pool}"`
        );
        modified = true;
      }
      
      if (content.includes('"multisig": "Emergency Multisig (緊急提款多簽錢包)"')) {
        content = content.replace(
          /"multisig": "Emergency Multisig \(緊急提款多簽錢包\)"/g,
          `"multisig": "${trans.multisig}"`
        );
        modified = true;
      }
      
      // 也檢查其他可能的格式
      if (content.includes('流動性池') && content.includes('"pool"')) {
        // 使用正則表達式替換所有包含流動性池的 pool 項目
        content = content.replace(
          /"pool":\s*"[^"]*流動性池[^"]*"/g,
          `"pool": "${trans.pool}"`
        );
        modified = true;
      }
      
      if (content.includes('緊急提款多簽錢包') && content.includes('"multisig"')) {
        // 使用正則表達式替換所有包含緊急提款多簽錢包的 multisig 項目
        content = content.replace(
          /"multisig":\s*"[^"]*緊急提款多簽錢包[^"]*"/g,
          `"multisig": "${trans.multisig}"`
        );
        modified = true;
      }
      
      // 修復描述文字中的中文（在列表項目中）
      // 替換 "- **流動性池 (LP)**：" 為對應語言的翻譯
      const poolLabel = trans.pool.match(/\(([^)]+)\)/)?.[1] || trans.pool;
      const multisigLabel = trans.multisig.match(/\(([^)]+)\)/)?.[1] || trans.multisig;
      
      // 替換描述文字中的中文
      if (content.includes('**流動性池 (LP)**')) {
        content = content.replace(
          /\*\*流動性池 \(LP\)\*\*/g,
          `**${poolLabel} (LP)**`
        );
        modified = true;
      }
      
      if (content.includes('**緊急提款多簽錢包**')) {
        content = content.replace(
          /\*\*緊急提款多簽錢包\*\*/g,
          `**${multisigLabel}**`
        );
        modified = true;
      }
      
      // 確保 $MOONINI 是大寫
      const originalContent = content;
      content = content.replace(/\$moonini/gi, '$MOONINI');
      if (content !== originalContent) {
        modified = true;
      }
      
      if (modified) {
        await writeFile(filePath, content, 'utf-8');
        console.log(`✅ ${locale}: 已修復中文殘留`);
        totalFixed++;
      } else {
        console.log(`⏭️  ${locale}: 無需修改`);
        totalSkipped++;
      }
    } catch (error) {
      console.error(`❌ ${locale}: 錯誤 - ${error.message}`);
    }
  }

  console.log(`\n📊 總結: ${totalFixed} 個語言已修復, ${totalSkipped} 個語言無需修改`);
}

fixAllChineseRemnants().catch(console.error);
