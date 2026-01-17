#!/usr/bin/env node

/**
 * 修復所有語言描述文字中的中文殘留
 * 修復 docs.whitepaper.content.contracts.description 中的中文
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

// 各語言的翻譯對照（用於描述文字）
const translations = {
  'zh-TW': {
    '流動性池 (LP)': '流動性池 (LP)',
    '緊急提款多簽錢包': '緊急提款多簽錢包'
  },
  'zh-CN': {
    '流動性池 (LP)': '流动性池 (LP)',
    '緊急提款多簽錢包': '紧急提款多签钱包'
  },
  'en-US': {
    '流動性池 (LP)': 'Liquidity Pool (LP)',
    '緊急提款多簽錢包': 'Emergency Multisig Wallet'
  },
  'en-GB': {
    '流動性池 (LP)': 'Liquidity Pool (LP)',
    '緊急提款多簽錢包': 'Emergency Multisig Wallet'
  },
  'ja-JP': {
    '流動性池 (LP)': '流動性プール (LP)',
    '緊急提款多簽錢包': '緊急引き出しマルチシグウォレット'
  },
  'ko-KR': {
    '流動性池 (LP)': '유동성 풀 (LP)',
    '緊急提款多簽錢包': '긴급 인출 멀티시그 지갑'
  },
  'es-ES': {
    '流動性池 (LP)': 'Pool de Liquidez (LP)',
    '緊急提款多簽錢包': 'Billetera Multisig de Emergencia'
  },
  'fr-FR': {
    '流動性池 (LP)': 'Pool de Liquidité (LP)',
    '緊急提款多簽錢包': 'Portefeuille Multisig d\'Urgence'
  },
  'de-DE': {
    '流動性池 (LP)': 'Liquiditätspool (LP)',
    '緊急提款多簽錢包': 'Notfall-Multisig-Wallet'
  },
  'it-IT': {
    '流動性池 (LP)': 'Pool di Liquidità (LP)',
    '緊急提款多簽錢包': 'Portafoglio Multisig di Emergenza'
  },
  'pt-BR': {
    '流動性池 (LP)': 'Pool de Liquidez (LP)',
    '緊急提款多簽錢包': 'Carteira Multisig de Emergência'
  },
  'pt-PT': {
    '流動性池 (LP)': 'Pool de Liquidez (LP)',
    '緊急提款多簽錢包': 'Carteira Multisig de Emergência'
  },
  'ru-RU': {
    '流動性池 (LP)': 'Пул Ликвидности (LP)',
    '緊急提款多簽錢包': 'Кошелек Мультиподписи для Чрезвычайных Ситуаций'
  },
  'ar-SA': {
    '流動性池 (LP)': 'مجمع السيولة (LP)',
    '緊急提款多簽錢包': 'محفظة متعددة التوقيع للطوارئ'
  },
  'hi-IN': {
    '流動性池 (LP)': 'तरलता पूल (LP)',
    '緊急提款多簽錢包': 'आपातकालीन मल्टीसिग वॉलेट'
  },
  'th-TH': {
    '流動性池 (LP)': 'พูลสภาพคล่อง (LP)',
    '緊急提款多簽錢包': 'กระเป๋าเงินหลายลายเซ็นฉุกเฉิน'
  },
  'vi-VN': {
    '流動性池 (LP)': 'Pool Thanh Khoản (LP)',
    '緊急提款多簽錢包': 'Ví Đa Chữ Ký Khẩn Cấp'
  },
  'id-ID': {
    '流動性池 (LP)': 'Pool Likuiditas (LP)',
    '緊急提款多簽錢包': 'Dompet Multisig Darurat'
  },
  'tr-TR': {
    '流動性池 (LP)': 'Likidite Havuzu (LP)',
    '緊急提款多簽錢包': 'Acil Durum Multisig Cüzdanı'
  },
  'pl-PL': {
    '流動性池 (LP)': 'Pula Płynności (LP)',
    '緊急提款多簽錢包': 'Portfel Multisig Awaryjny'
  },
  'nl-NL': {
    '流動性池 (LP)': 'Liquiditeitspool (LP)',
    '緊急提款多簽錢包': 'Nood-Multisig Portemonnee'
  },
  'sv-SE': {
    '流動性池 (LP)': 'Likviditetspool (LP)',
    '緊急提款多簽錢包': 'Nödsituation Multisig Plånbok'
  },
  'da-DK': {
    '流動性池 (LP)': 'Likviditetspool (LP)',
    '緊急提款多簽錢包': 'Nødsituation Multisig Tegnebog'
  },
  'no-NO': {
    '流動性池 (LP)': 'Likviditetspool (LP)',
    '緊急提款多簽錢包': 'Nødsituasjon Multisig Lommebok'
  },
  'fi-FI': {
    '流動性池 (LP)': 'Likviditeettipooli (LP)',
    '緊急提款多簽錢包': 'Hätätilanteen Multisig Lompakko'
  },
  'cs-CZ': {
    '流動性池 (LP)': 'Pool Likvidity (LP)',
    '緊急提款多簽錢包': 'Multisig Peněženka pro Nouzové Situace'
  },
  'hu-HU': {
    '流動性池 (LP)': 'Likviditási Pool (LP)',
    '緊急提款多簽錢包': 'Vészhelyzeti Multisig Tárca'
  },
  'ro-RO': {
    '流動性池 (LP)': 'Pool de Lichiditate (LP)',
    '緊急提款多簽錢包': 'Portofel Multisig de Urgență'
  },
  'el-GR': {
    '流動性池 (LP)': 'Πισίνα Ρευστότητας (LP)',
    '緊急提款多簽錢包': 'Πορτοφόλι Πολλαπλών Υπογραφών Έκτακτης Ανάγκης'
  },
  'he-IL': {
    '流動性池 (LP)': 'בריכת נזילות (LP)',
    '緊急提款多簽錢包': 'ארנק חתימה מרובה חירום'
  },
  'fa-IR': {
    '流動性池 (LP)': 'استخر نقدینگی (LP)',
    '緊急提款多簽錢包': 'کیف پول چند امضایی اضطراری'
  },
  'ur-PK': {
    '流動性池 (LP)': 'لکویڈیٹی پول (LP)',
    '緊急提款多簽錢包': 'ایمرجنسی ملٹی سگ والیٹ'
  },
  'uk-UA': {
    '流動性池 (LP)': 'Пул Ліквідності (LP)',
    '緊急提款多簽錢包': 'Гаманець Мультипідпису для Надзвичайних Ситуацій'
  },
  'bn-BD': {
    '流動性池 (LP)': 'লিকুইডিটি পুল (LP)',
    '緊急提款多簽錢包': 'জরুরী মাল্টিসিগ ওয়ালেট'
  }
};

async function fixDescriptionAll() {
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
      const data = JSON.parse(await readFile(filePath, 'utf-8'));
      let modified = false;
      
      // 修復 docs.whitepaper.content.contracts.description 中的中文
      if (data.docs?.whitepaper?.content?.contracts?.description) {
        const desc = data.docs.whitepaper.content.contracts.description;
        if (Array.isArray(desc)) {
          for (let i = 0; i < desc.length; i++) {
            let text = desc[i];
            if (typeof text === 'string') {
              const original = text;
              // 替換所有中文
              text = text.replace(/\*\*流動性池 \(LP\)\*\*/g, `**${trans['流動性池 (LP)']}**`);
              text = text.replace(/\*\*緊急提款多簽錢包\*\*/g, `**${trans['緊急提款多簽錢包']}**`);
              text = text.replace(/\$moonini/gi, '$MOONINI');
              if (text !== original) {
                desc[i] = text;
                modified = true;
              }
            }
          }
        }
      }
      
      // 修復 docs.developer.contracts.description 中的中文
      if (data.docs?.developer?.contracts?.description) {
        const desc = data.docs.developer.contracts.description;
        if (Array.isArray(desc)) {
          for (let i = 0; i < desc.length; i++) {
            let text = desc[i];
            if (typeof text === 'string') {
              const original = text;
              // 替換所有中文
              text = text.replace(/\*\*流動性池 \(LP\)\*\*/g, `**${trans['流動性池 (LP)']}**`);
              text = text.replace(/\*\*緊急提款多簽錢包\*\*/g, `**${trans['緊急提款多簽錢包']}**`);
              text = text.replace(/\$moonini/gi, '$MOONINI');
              if (text !== original) {
                desc[i] = text;
                modified = true;
              }
            }
          }
        }
      }
      
      if (modified) {
        const updatedContent = JSON.stringify(data, null, 2) + '\n';
        await writeFile(filePath, updatedContent, 'utf-8');
        console.log(`✅ ${locale}: 已修復描述文字中的中文`);
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

fixDescriptionAll().catch(console.error);
