#!/usr/bin/env node

/**
 * 修復所有語言中合約標籤還保留中文的問題
 * 掃描並替換所有包含中文的合約標籤
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

// 中文到各語言的翻譯對照表
const translations = {
  'zh-TW': {
    '代幣核心': '代幣核心',
    '鎖倉管理': '鎖倉管理',
    '市場流動': '市場流動',
    '權力中心': '權力中心',
    '延遲治理': '延遲治理',
    '安全緩衝': '安全緩衝',
    '流動性池': '流動性池',
    '緊急提款多簽錢包': '緊急提款多簽錢包'
  },
  'zh-CN': {
    '代幣核心': '代币核心',
    '鎖倉管理': '锁仓管理',
    '市場流動': '市场流动',
    '權力中心': '权力中心',
    '延遲治理': '延迟治理',
    '安全緩衝': '安全缓冲',
    '流動性池': '流动性池',
    '緊急提款多簽錢包': '紧急提款多签钱包'
  },
  'ja-JP': {
    '代幣核心': 'トークンコア',
    '鎖倉管理': 'ロックアップ管理',
    '市場流動': '市場流動性',
    '權力中心': '権力センター',
    '延遲治理': '遅延ガバナンス',
    '安全緩衝': '安全バッファ',
    '流動性池': '市場流動性',
    '緊急提款多簽錢包': '緊急引き出しマルチシグウォレット'
  },
  'ko-KR': {
    '代幣核心': '토큰 코어',
    '鎖倉管理': '잠금 관리',
    '市場流動': '시장 유동성',
    '權力中心': '권력 센터',
    '延遲治理': '지연 거버넌스',
    '安全緩衝': '안전 버퍼',
    '流動性池': '시장 유동성',
    '緊急提款多簽錢包': '긴급 인출 멀티시그 지갑'
  },
  'en-US': {
    '代幣核心': 'Token Core',
    '鎖倉管理': 'Lockup Management',
    '市場流動': 'Market Liquidity',
    '權力中心': 'Power Center',
    '延遲治理': 'Delayed Governance',
    '安全緩衝': 'Safety Buffer',
    '流動性池': 'Market Liquidity',
    '緊急提款多簽錢包': 'Emergency Multisig Wallet'
  },
  'en-GB': {
    '代幣核心': 'Token Core',
    '鎖倉管理': 'Lockup Management',
    '市場流動': 'Market Liquidity',
    '權力中心': 'Power Centre',
    '延遲治理': 'Delayed Governance',
    '安全緩衝': 'Safety Buffer',
    '流動性池': 'Market Liquidity',
    '緊急提款多簽錢包': 'Emergency Multisig Wallet'
  },
  'es-ES': {
    '代幣核心': 'Núcleo de Token',
    '鎖倉管理': 'Gestión de Bloqueo',
    '市場流動': 'Liquidez de Mercado',
    '權力中心': 'Centro de Poder',
    '延遲治理': 'Gobernanza Retrasada',
    '安全緩衝': 'Buffer de Seguridad',
    '流動性池': 'Liquidez de Mercado',
    '緊急提款多簽錢包': 'Billetera Multisig de Emergencia'
  },
  'fr-FR': {
    '代幣核心': 'Cœur de Token',
    '鎖倉管理': 'Gestion de Blocage',
    '市場流動': 'Liquidité du Marché',
    '權力中心': 'Centre de Pouvoir',
    '延遲治理': 'Gouvernance Retardée',
    '安全緩衝': 'Tampon de Sécurité',
    '流動性池': 'Liquidité du Marché',
    '緊急提款多簽錢包': 'Portefeuille Multisig d\'Urgence'
  },
  'de-DE': {
    '代幣核心': 'Token-Kern',
    '鎖倉管理': 'Sperrverwaltung',
    '市場流動': 'Marktliquidität',
    '權力中心': 'Machtzentrum',
    '延遲治理': 'Verzögerte Governance',
    '安全緩衝': 'Sicherheitspuffer',
    '流動性池': 'Marktliquidität',
    '緊急提款多簽錢包': 'Notfall-Multisig-Wallet'
  },
  'it-IT': {
    '代幣核心': 'Nucleo Token',
    '鎖倉管理': 'Gestione Blocco',
    '市場流動': 'Liquidità di Mercato',
    '權力中心': 'Centro di Potere',
    '延遲治理': 'Governance Ritardata',
    '安全緩衝': 'Buffer di Sicurezza',
    '流動性池': 'Liquidità di Mercato',
    '緊急提款多簽錢包': 'Portafoglio Multisig di Emergenza'
  },
  'pt-BR': {
    '代幣核心': 'Núcleo de Token',
    '鎖倉管理': 'Gestão de Bloqueio',
    '市場流動': 'Liquidez de Mercado',
    '權力中心': 'Centro de Poder',
    '延遲治理': 'Governança Atrasada',
    '安全緩衝': 'Buffer de Segurança',
    '流動性池': 'Liquidez de Mercado',
    '緊急提款多簽錢包': 'Carteira Multisig de Emergência'
  },
  'pt-PT': {
    '代幣核心': 'Núcleo de Token',
    '鎖倉管理': 'Gestão de Bloqueio',
    '市場流動': 'Liquidez de Mercado',
    '權力中心': 'Centro de Poder',
    '延遲治理': 'Governança Atrasada',
    '安全緩衝': 'Buffer de Segurança',
    '流動性池': 'Liquidez de Mercado',
    '緊急提款多簽錢包': 'Carteira Multisig de Emergência'
  },
  'ru-RU': {
    '代幣核心': 'Ядро Токена',
    '鎖倉管理': 'Управление Блокировкой',
    '市場流動': 'Рыночная Ликвидность',
    '權力中心': 'Центр Власти',
    '延遲治理': 'Отложенное Управление',
    '安全緩衝': 'Буфер Безопасности',
    '流動性池': 'Рыночная Ликвидность',
    '緊急提款多簽錢包': 'Кошелек Мультиподписи для Чрезвычайных Ситуаций'
  },
  'ar-SA': {
    '代幣核心': 'نواة الرمز',
    '鎖倉管理': 'إدارة القفل',
    '市場流動': 'سيولة السوق',
    '權力中心': 'مركز السلطة',
    '延遲治理': 'الحوكمة المؤجلة',
    '安全緩衝': 'مخزن الأمان',
    '流動性池': 'سيولة السوق',
    '緊急提款多簽錢包': 'محفظة متعددة التوقيع للطوارئ'
  },
  'hi-IN': {
    '代幣核心': 'टोकन कोर',
    '鎖倉管理': 'लॉकअप प्रबंधन',
    '市場流動': 'बाजार तरलता',
    '權力中心': 'शक्ति केंद्र',
    '延遲治理': 'देरी शासन',
    '安全緩衝': 'सुरक्षा बफर',
    '流動性池': 'बाजार तरलता',
    '緊急提款多簽錢包': 'आपातकालीन मल्टीसिग वॉलेट'
  },
  'th-TH': {
    '代幣核心': 'แกนกลางโทเคน',
    '鎖倉管理': 'การจัดการล็อค',
    '市場流動': 'สภาพคล่องตลาด',
    '權力中心': 'ศูนย์อำนาจ',
    '延遲治理': 'การกำกับดูแลที่ล่าช้า',
    '安全緩衝': 'บัฟเฟอร์ความปลอดภัย',
    '流動性池': 'สภาพคล่องตลาด',
    '緊急提款多簽錢包': 'กระเป๋าเงินหลายลายเซ็นฉุกเฉิน'
  },
  'vi-VN': {
    '代幣核心': 'Lõi Token',
    '鎖倉管理': 'Quản Lý Khóa',
    '市場流動': 'Thanh Khoản Thị Trường',
    '權力中心': 'Trung Tâm Quyền Lực',
    '延遲治理': 'Quản Trị Trì Hoãn',
    '安全緩衝': 'Bộ Đệm An Toàn',
    '流動性池': 'Thanh Khoản Thị Trường',
    '緊急提款多簽錢包': 'Ví Đa Chữ Ký Khẩn Cấp'
  },
  'id-ID': {
    '代幣核心': 'Inti Token',
    '鎖倉管理': 'Manajemen Kunci',
    '市場流動': 'Likuiditas Pasar',
    '權力中心': 'Pusat Kekuasaan',
    '延遲治理': 'Tata Kelola Tertunda',
    '安全緩衝': 'Buffer Keamanan',
    '流動性池': 'Likuiditas Pasar',
    '緊急提款多簽錢包': 'Dompet Multisig Darurat'
  },
  'tr-TR': {
    '代幣核心': 'Token Çekirdeği',
    '鎖倉管理': 'Kilitleme Yönetimi',
    '市場流動': 'Piyasa Likiditesi',
    '權力中心': 'Güç Merkezi',
    '延遲治理': 'Gecikmeli Yönetim',
    '安全緩衝': 'Güvenlik Tamponu',
    '流動性池': 'Piyasa Likiditesi',
    '緊急提款多簽錢包': 'Acil Durum Multisig Cüzdanı'
  },
  'pl-PL': {
    '代幣核心': 'Rdzeń Tokena',
    '鎖倉管理': 'Zarządzanie Blokadą',
    '市場流動': 'Płynność Rynku',
    '權力中心': 'Centrum Władzy',
    '延遲治理': 'Opóźnione Zarządzanie',
    '安全緩衝': 'Bufor Bezpieczeństwa',
    '流動性池': 'Płynność Rynku',
    '緊急提款多簽錢包': 'Portfel Multisig Awaryjny'
  },
  'nl-NL': {
    '代幣核心': 'Token Kern',
    '鎖倉管理': 'Vergrendelingsbeheer',
    '市場流動': 'Marktliquiditeit',
    '權力中心': 'Machtcentrum',
    '延遲治理': 'Vertraagde Governance',
    '安全緩衝': 'Veiligheidsbuffer',
    '流動性池': 'Marktliquiditeit',
    '緊急提款多簽錢包': 'Nood-Multisig Portemonnee'
  },
  'sv-SE': {
    '代幣核心': 'Token Kärna',
    '鎖倉管理': 'Låsningshantering',
    '市場流動': 'Marknadslikviditet',
    '權力中心': 'Maktcentrum',
    '延遲治理': 'Fördröjd Styrning',
    '安全緩衝': 'Säkerhetsbuffert',
    '流動性池': 'Marknadslikviditet',
    '緊急提款多簽錢包': 'Nödsituation Multisig Plånbok'
  },
  'da-DK': {
    '代幣核心': 'Token Kerne',
    '鎖倉管理': 'Låseadministration',
    '市場流動': 'Markedslikviditet',
    '權力中心': 'Magtcenter',
    '延遲治理': 'Forsinket Governance',
    '安全緩衝': 'Sikkerhedsbuffer',
    '流動性池': 'Markedslikviditet',
    '緊急提款多簽錢包': 'Nødsituation Multisig Tegnebog'
  },
  'no-NO': {
    '代幣核心': 'Token Kjerne',
    '鎖倉管理': 'Låseadministrasjon',
    '市場流動': 'Markedslikviditet',
    '權力中心': 'Maktssenter',
    '延遲治理': 'Forsinket Styre',
    '安全緩衝': 'Sikkerhetsbuffer',
    '流動性池': 'Markedslikviditet',
    '緊急提款多簽錢包': 'Nødsituasjon Multisig Lommebok'
  },
  'fi-FI': {
    '代幣核心': 'Token Ydin',
    '鎖倉管理': 'Lukituksen Hallinta',
    '市場流動': 'Markkinoiden Likviditeetti',
    '權力中心': 'Valtakeskus',
    '延遲治理': 'Viivästetty Hallinto',
    '安全緩衝': 'Turvapuskuri',
    '流動性池': 'Markkinoiden Likviditeetti',
    '緊急提款多簽錢包': 'Hätätilanteen Multisig Lompakko'
  },
  'cs-CZ': {
    '代幣核心': 'Jádro Tokenu',
    '鎖倉管理': 'Správa Zámku',
    '市場流動': 'Tržní Likvidita',
    '權力中心': 'Centrum Moci',
    '延遲治理': 'Zpožděná Správa',
    '安全緩衝': 'Bezpečnostní Buffer',
    '流動性池': 'Tržní Likvidita',
    '緊急提款多簽錢包': 'Multisig Peněženka pro Nouzové Situace'
  },
  'hu-HU': {
    '代幣核心': 'Token Mag',
    '鎖倉管理': 'Zárolás Kezelése',
    '市場流動': 'Piaci Likviditás',
    '權力中心': 'Hatalom Központ',
    '延遲治理': 'Késleltetett Irányítás',
    '安全緩衝': 'Biztonsági Puffer',
    '流動性池': 'Piaci Likviditás',
    '緊急提款多簽錢包': 'Vészhelyzeti Multisig Tárca'
  },
  'ro-RO': {
    '代幣核心': 'Nucleu Token',
    '鎖倉管理': 'Gestionarea Blocării',
    '市場流動': 'Lichiditate de Piață',
    '權力中心': 'Centru de Putere',
    '延遲治理': 'Guvernanță Întârziată',
    '安全緩衝': 'Buffer de Securitate',
    '流動性池': 'Lichiditate de Piață',
    '緊急提款多簽錢包': 'Portofel Multisig de Urgență'
  },
  'el-GR': {
    '代幣核心': 'Πυρήνας Token',
    '鎖倉管理': 'Διαχείριση Κλειδώματος',
    '市場流動': 'Ρευστότητα Αγοράς',
    '權力中心': 'Κέντρο Εξουσίας',
    '延遲治理': 'Καθυστερημένη Διακυβέρνηση',
    '安全緩衝': 'Ρυθμιστικό Ασφαλείας',
    '流動性池': 'Ρευστότητα Αγοράς',
    '緊急提款多簽錢包': 'Πορτοφόλι Πολλαπλών Υπογραφών Έκτακτης Ανάγκης'
  },
  'he-IL': {
    '代幣核心': 'ליבת אסימון',
    '鎖倉管理': 'ניהול נעילה',
    '市場流動': 'נזילות שוק',
    '權力中心': 'מרכז כוח',
    '延遲治理': 'ממשל מעוכב',
    '安全緩衝': 'חיץ אבטחה',
    '流動性池': 'נזילות שוק',
    '緊急提款多簽錢包': 'ארנק חתימה מרובה חירום'
  },
  'fa-IR': {
    '代幣核心': 'هسته توکن',
    '鎖倉管理': 'مدیریت قفل',
    '市場流動': 'نقدینگی بازار',
    '權力中心': 'مرکز قدرت',
    '延遲治理': 'حاکمیت تأخیری',
    '安全緩衝': 'بافر امنیتی',
    '流動性池': 'نقدینگی بازار',
    '緊急提款多簽錢包': 'کیف پول چند امضایی اضطراری'
  },
  'ur-PK': {
    '代幣核心': 'ٹوکن کور',
    '鎖倉管理': 'لاک اپ مینجمنٹ',
    '市場流動': 'مارکیٹ لیکویڈیٹی',
    '權力中心': 'پاور سینٹر',
    '延遲治理': 'تاخیر شدہ گورننس',
    '安全緩衝': 'سیفٹی بفر',
    '流動性池': 'مارکیٹ لیکویڈیٹی',
    '緊急提款多簽錢包': 'ایمرجنسی ملٹی سگ والیٹ'
  },
  'uk-UA': {
    '代幣核心': 'Ядро Токена',
    '鎖倉管理': 'Управління Блокуванням',
    '市場流動': 'Ринкова Ліквідність',
    '權力中心': 'Центр Влади',
    '延遲治理': 'Відкладене Управління',
    '安全緩衝': 'Буфер Безпеки',
    '流動性池': 'Ринкова Ліквідність',
    '緊急提款多簽錢包': 'Гаманець Мультипідпису для Надзвичайних Ситуацій'
  },
  'bn-BD': {
    '代幣核心': 'টোকেন কোর',
    '鎖倉管理': 'লকআপ ম্যানেজমেন্ট',
    '市場流動': 'বাজার তারল্য',
    '權力中心': 'পাওয়ার সেন্টার',
    '延遲治理': 'বিলম্বিত শাসন',
    '安全緩衝': 'নিরাপত্তা বাফার',
    '流動性池': 'বাজার তারল্য',
    '緊急提款多簽錢包': 'জরুরী মাল্টিসিগ ওয়ালেট'
  }
};

// 需要替換的中文模式
const chinesePatterns = [
  /流動性池/g,
  /緊急提款多簽錢包/g,
  /市場流動/g,
  /權力中心/g,
  /延遲治理/g,
  /安全緩衝/g,
  /代幣核心/g,
  /鎖倉管理/g
];

async function fixChineseInContracts() {
  const locales = await readdir(I18N_DIR);
  let totalFixed = 0;
  let totalSkipped = 0;

  for (const locale of locales) {
    if (locale === '.DS_Store') continue;
    
    const filePath = join(I18N_DIR, locale, 'docs.json');
    
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      let modified = false;
      
      // 檢查並修復 docs.content.contracts.items
      if (data.docs?.content?.contracts?.items) {
        const items = data.docs.content.contracts.items;
        const trans = translations[locale] || translations['en-US'];
        
        for (const [key, value] of Object.entries(items)) {
          if (typeof value === 'string') {
            let newValue = value;
            // 替換所有中文
            for (const [chinese, translated] of Object.entries(trans)) {
              if (newValue.includes(chinese)) {
                newValue = newValue.replace(new RegExp(chinese, 'g'), translated);
                modified = true;
              }
            }
            // 確保 $MOONINI 是大寫
            newValue = newValue.replace(/\$moonini/gi, '$MOONINI');
            if (newValue !== value) {
              items[key] = newValue;
            }
          }
        }
      }
      
      // 檢查並修復 docs.litepaper.content.contracts.items
      if (data.docs?.litepaper?.content?.contracts?.items) {
        const items = data.docs.litepaper.content.contracts.items;
        const trans = translations[locale] || translations['en-US'];
        
        for (const [key, value] of Object.entries(items)) {
          if (typeof value === 'string') {
            let newValue = value;
            // 替換所有中文
            for (const [chinese, translated] of Object.entries(trans)) {
              if (newValue.includes(chinese)) {
                newValue = newValue.replace(new RegExp(chinese, 'g'), translated);
                modified = true;
              }
            }
            // 確保 $MOONINI 是大寫
            newValue = newValue.replace(/\$moonini/gi, '$MOONINI');
            if (newValue !== value) {
              items[key] = newValue;
            }
          }
        }
      }
      
      if (modified) {
        const updatedContent = JSON.stringify(data, null, 2) + '\n';
        await writeFile(filePath, updatedContent, 'utf-8');
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

fixChineseInContracts().catch(console.error);
