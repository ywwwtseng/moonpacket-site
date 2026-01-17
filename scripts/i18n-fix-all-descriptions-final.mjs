#!/usr/bin/env node

/**
 * 最終修復：修復所有語言描述文字中的中文殘留
 * 修復所有包含「流動性池」和「緊急提款多簽錢包」的地方
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

// 各語言的翻譯對照
const translations = {
  'zh-TW': { pool: '流動性池 (LP)', multisig: '緊急提款多簽錢包' },
  'zh-CN': { pool: '流动性池 (LP)', multisig: '紧急提款多签钱包' },
  'en-US': { pool: 'Liquidity Pool (LP)', multisig: 'Emergency Multisig Wallet' },
  'en-GB': { pool: 'Liquidity Pool (LP)', multisig: 'Emergency Multisig Wallet' },
  'ja-JP': { pool: '流動性プール (LP)', multisig: '緊急引き出しマルチシグウォレット' },
  'ko-KR': { pool: '유동성 풀 (LP)', multisig: '긴급 인출 멀티시그 지갑' },
  'es-ES': { pool: 'Pool de Liquidez (LP)', multisig: 'Billetera Multisig de Emergencia' },
  'fr-FR': { pool: 'Pool de Liquidité (LP)', multisig: 'Portefeuille Multisig d\'Urgence' },
  'de-DE': { pool: 'Liquiditätspool (LP)', multisig: 'Notfall-Multisig-Wallet' },
  'it-IT': { pool: 'Pool di Liquidità (LP)', multisig: 'Portafoglio Multisig di Emergenza' },
  'pt-BR': { pool: 'Pool de Liquidez (LP)', multisig: 'Carteira Multisig de Emergência' },
  'pt-PT': { pool: 'Pool de Liquidez (LP)', multisig: 'Carteira Multisig de Emergência' },
  'ru-RU': { pool: 'Пул Ликвидности (LP)', multisig: 'Кошелек Мультиподписи для Чрезвычайных Ситуаций' },
  'ar-SA': { pool: 'مجمع السيولة (LP)', multisig: 'محفظة متعددة التوقيع للطوارئ' },
  'hi-IN': { pool: 'तरलता पूल (LP)', multisig: 'आपातकालीन मल्टीसिग वॉलेट' },
  'th-TH': { pool: 'พูลสภาพคล่อง (LP)', multisig: 'กระเป๋าเงินหลายลายเซ็นฉุกเฉิน' },
  'vi-VN': { pool: 'Pool Thanh Khoản (LP)', multisig: 'Ví Đa Chữ Ký Khẩn Cấp' },
  'id-ID': { pool: 'Pool Likuiditas (LP)', multisig: 'Dompet Multisig Darurat' },
  'tr-TR': { pool: 'Likidite Havuzu (LP)', multisig: 'Acil Durum Multisig Cüzdanı' },
  'pl-PL': { pool: 'Pula Płynności (LP)', multisig: 'Portfel Multisig Awaryjny' },
  'nl-NL': { pool: 'Liquiditeitspool (LP)', multisig: 'Nood-Multisig Portemonnee' },
  'sv-SE': { pool: 'Likviditetspool (LP)', multisig: 'Nödsituation Multisig Plånbok' },
  'da-DK': { pool: 'Likviditetspool (LP)', multisig: 'Nødsituation Multisig Tegnebog' },
  'no-NO': { pool: 'Likviditetspool (LP)', multisig: 'Nødsituasjon Multisig Lommebok' },
  'fi-FI': { pool: 'Likviditeettipooli (LP)', multisig: 'Hätätilanteen Multisig Lompakko' },
  'cs-CZ': { pool: 'Pool Likvidity (LP)', multisig: 'Multisig Peněženka pro Nouzové Situace' },
  'hu-HU': { pool: 'Likviditási Pool (LP)', multisig: 'Vészhelyzeti Multisig Tárca' },
  'ro-RO': { pool: 'Pool de Lichiditate (LP)', multisig: 'Portofel Multisig de Urgență' },
  'el-GR': { pool: 'Πισίνα Ρευστότητας (LP)', multisig: 'Πορτοφόλι Πολλαπλών Υπογραφών Έκτακτης Ανάγκης' },
  'he-IL': { pool: 'בריכת נזילות (LP)', multisig: 'ארנק חתימה מרובה חירום' },
  'fa-IR': { pool: 'استخر نقدینگی (LP)', multisig: 'کیف پول چند امضایی اضطراری' },
  'ur-PK': { pool: 'لکویڈیٹی پول (LP)', multisig: 'ایمرجنسی ملٹی سگ والیٹ' },
  'uk-UA': { pool: 'Пул Ліквідності (LP)', multisig: 'Гаманець Мультипідпису для Надзвичайних Ситуацій' },
  'bn-BD': { pool: 'লিকুইডিটি পুল (LP)', multisig: 'জরুরী মাল্টিসিগ ওয়ালেট' }
};

async function fixAllDescriptionsFinal() {
  const locales = await readdir(I18N_DIR);
  let totalFixed = 0;

  for (const locale of locales) {
    if (locale === '.DS_Store' || locale.endsWith('.bak')) continue;
    
    const filePath = join(I18N_DIR, locale, 'docs.json');
    const trans = translations[locale];
    
    if (!trans) continue;
    
    try {
      let content = await readFile(filePath, 'utf-8');
      const original = content;
      
      // 替換所有格式的中文
      // 格式1: "**流動性池 (LP)**"
      content = content.replace(/\*\*流動性池 \(LP\)\*\*/g, `**${trans.pool}**`);
      // 格式2: "- **流動性池 (LP)**："
      content = content.replace(/-\s*\*\*流動性池 \(LP\)\*\*/g, `- **${trans.pool}**`);
      // 格式3: "**緊急提款多簽錢包**"
      content = content.replace(/\*\*緊急提款多簽錢包\*\*/g, `**${trans.multisig}**`);
      // 格式4: "- **緊急提款多簽錢包**："
      content = content.replace(/-\s*\*\*緊急提款多簽錢包\*\*/g, `- **${trans.multisig}**`);
      
      // 修復錯誤的替換結果（如 "LP (LP)" 或只有部分翻譯）
      if (content.includes('**LP (LP)**')) {
        content = content.replace(/\*\*LP \(LP\)\*\*/g, `**${trans.pool}**`);
      }
      if (content.includes('- **LP (LP)**')) {
        content = content.replace(/-\s*\*\*LP \(LP\)\*\*/g, `- **${trans.pool}**`);
      }
      
      // 確保 $MOONINI 是大寫
      content = content.replace(/\$moonini/gi, '$MOONINI');
      
      if (content !== original) {
        await writeFile(filePath, content, 'utf-8');
        console.log(`✅ ${locale}: 已修復`);
        totalFixed++;
      }
    } catch (error) {
      console.error(`❌ ${locale}: ${error.message}`);
    }
  }

  console.log(`\n📊 總結: ${totalFixed} 個語言已修復`);
}

fixAllDescriptionsFinal().catch(console.error);
