#!/usr/bin/env node

/**
 * 同步所有語言的合約註冊表標籤
 * 更新 contracts.items 為新的合約結構
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..');
const I18N_DIR = join(ROOT, 'src/i18n/messages');

// 新的合約標籤結構（繁體中文作為基準）
const newContractItems = {
  token: "$MOONINI Token (代幣核心)",
  vesting: "Vesting Vault (V2) (鎖倉管理)",
  pool: "Liquidity Pool (LP) (市場流動)",
  multisig: "Governance Multisig (權力中心)",
  timelock: "Timelock Controller (延遲治理)",
  emergency: "Emergency Vault (安全緩衝)"
};

// 各語言的翻譯對照表
const translations = {
  'zh-CN': {
    token: "$MOONINI Token (代币核心)",
    vesting: "Vesting Vault (V2) (锁仓管理)",
    pool: "Liquidity Pool (LP) (市场流动)",
    multisig: "Governance Multisig (权力中心)",
    timelock: "Timelock Controller (延迟治理)",
    emergency: "Emergency Vault (安全缓冲)"
  },
  'en-US': {
    token: "$MOONINI Token (Token Core)",
    vesting: "Vesting Vault (V2) (Lockup Management)",
    pool: "Liquidity Pool (LP) (Market Liquidity)",
    multisig: "Governance Multisig (Power Center)",
    timelock: "Timelock Controller (Delayed Governance)",
    emergency: "Emergency Vault (Safety Buffer)"
  },
  'en-GB': {
    token: "$MOONINI Token (Token Core)",
    vesting: "Vesting Vault (V2) (Lockup Management)",
    pool: "Liquidity Pool (LP) (Market Liquidity)",
    multisig: "Governance Multisig (Power Centre)",
    timelock: "Timelock Controller (Delayed Governance)",
    emergency: "Emergency Vault (Safety Buffer)"
  },
  'ja-JP': {
    token: "$MOONINI Token (トークンコア)",
    vesting: "Vesting Vault (V2) (ロックアップ管理)",
    pool: "Liquidity Pool (LP) (市場流動性)",
    multisig: "Governance Multisig (権力センター)",
    timelock: "Timelock Controller (遅延ガバナンス)",
    emergency: "Emergency Vault (安全バッファ)"
  },
  'ko-KR': {
    token: "$MOONINI Token (토큰 코어)",
    vesting: "Vesting Vault (V2) (잠금 관리)",
    pool: "Liquidity Pool (LP) (시장 유동성)",
    multisig: "Governance Multisig (권력 센터)",
    timelock: "Timelock Controller (지연 거버넌스)",
    emergency: "Emergency Vault (안전 버퍼)"
  },
  'es-ES': {
    token: "$MOONINI Token (Núcleo de Token)",
    vesting: "Vesting Vault (V2) (Gestión de Bloqueo)",
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)",
    timelock: "Timelock Controller (Gobernanza Retrasada)",
    emergency: "Emergency Vault (Buffer de Seguridad)"
  },
  'fr-FR': {
    token: "$MOONINI Token (Cœur de Token)",
    vesting: "Vesting Vault (V2) (Gestion de Blocage)",
    pool: "Liquidity Pool (LP) (Liquidité du Marché)",
    multisig: "Governance Multisig (Centre de Pouvoir)",
    timelock: "Timelock Controller (Gouvernance Retardée)",
    emergency: "Emergency Vault (Tampon de Sécurité)"
  },
  'de-DE': {
    token: "$MOONINI Token (Token-Kern)",
    vesting: "Vesting Vault (V2) (Sperrverwaltung)",
    pool: "Liquidity Pool (LP) (Marktliquidität)",
    multisig: "Governance Multisig (Machtzentrum)",
    timelock: "Timelock Controller (Verzögerte Governance)",
    emergency: "Emergency Vault (Sicherheitspuffer)"
  },
  'it-IT': {
    token: "$MOONINI Token (Nucleo Token)",
    vesting: "Vesting Vault (V2) (Gestione Blocco)",
    pool: "Liquidity Pool (LP) (Liquidità di Mercato)",
    multisig: "Governance Multisig (Centro di Potere)",
    timelock: "Timelock Controller (Governance Ritardata)",
    emergency: "Emergency Vault (Buffer di Sicurezza)"
  },
  'pt-BR': {
    token: "$MOONINI Token (Núcleo de Token)",
    vesting: "Vesting Vault (V2) (Gestão de Bloqueio)",
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)",
    timelock: "Timelock Controller (Governança Atrasada)",
    emergency: "Emergency Vault (Buffer de Segurança)"
  },
  'pt-PT': {
    token: "$MOONINI Token (Núcleo de Token)",
    vesting: "Vesting Vault (V2) (Gestão de Bloqueio)",
    pool: "Liquidity Pool (LP) (Liquidez de Mercado)",
    multisig: "Governance Multisig (Centro de Poder)",
    timelock: "Timelock Controller (Governança Atrasada)",
    emergency: "Emergency Vault (Buffer de Segurança)"
  },
  'ru-RU': {
    token: "$MOONINI Token (Ядро Токена)",
    vesting: "Vesting Vault (V2) (Управление Блокировкой)",
    pool: "Liquidity Pool (LP) (Рыночная Ликвидность)",
    multisig: "Governance Multisig (Центр Власти)",
    timelock: "Timelock Controller (Отложенное Управление)",
    emergency: "Emergency Vault (Буфер Безопасности)"
  },
  'ar-SA': {
    token: "$MOONINI Token (نواة الرمز)",
    vesting: "Vesting Vault (V2) (إدارة القفل)",
    pool: "Liquidity Pool (LP) (سيولة السوق)",
    multisig: "Governance Multisig (مركز السلطة)",
    timelock: "Timelock Controller (الحوكمة المؤجلة)",
    emergency: "Emergency Vault (مخزن الأمان)"
  },
  'hi-IN': {
    token: "$MOONINI Token (टोकन कोर)",
    vesting: "Vesting Vault (V2) (लॉकअप प्रबंधन)",
    pool: "Liquidity Pool (LP) (बाजार तरलता)",
    multisig: "Governance Multisig (शक्ति केंद्र)",
    timelock: "Timelock Controller (देरी शासन)",
    emergency: "Emergency Vault (सुरक्षा बफर)"
  },
  'th-TH': {
    token: "$MOONINI Token (แกนกลางโทเคน)",
    vesting: "Vesting Vault (V2) (การจัดการล็อค)",
    pool: "Liquidity Pool (LP) (สภาพคล่องตลาด)",
    multisig: "Governance Multisig (ศูนย์อำนาจ)",
    timelock: "Timelock Controller (การกำกับดูแลที่ล่าช้า)",
    emergency: "Emergency Vault (บัฟเฟอร์ความปลอดภัย)"
  },
  'vi-VN': {
    token: "$MOONINI Token (Lõi Token)",
    vesting: "Vesting Vault (V2) (Quản Lý Khóa)",
    pool: "Liquidity Pool (LP) (Thanh Khoản Thị Trường)",
    multisig: "Governance Multisig (Trung Tâm Quyền Lực)",
    timelock: "Timelock Controller (Quản Trị Trì Hoãn)",
    emergency: "Emergency Vault (Bộ Đệm An Toàn)"
  },
  'id-ID': {
    token: "$MOONINI Token (Inti Token)",
    vesting: "Vesting Vault (V2) (Manajemen Kunci)",
    pool: "Liquidity Pool (LP) (Likuiditas Pasar)",
    multisig: "Governance Multisig (Pusat Kekuasaan)",
    timelock: "Timelock Controller (Tata Kelola Tertunda)",
    emergency: "Emergency Vault (Buffer Keamanan)"
  },
  'tr-TR': {
    token: "$MOONINI Token (Token Çekirdeği)",
    vesting: "Vesting Vault (V2) (Kilitleme Yönetimi)",
    pool: "Liquidity Pool (LP) (Piyasa Likiditesi)",
    multisig: "Governance Multisig (Güç Merkezi)",
    timelock: "Timelock Controller (Gecikmeli Yönetim)",
    emergency: "Emergency Vault (Güvenlik Tamponu)"
  },
  'pl-PL': {
    token: "$MOONINI Token (Rdzeń Tokena)",
    vesting: "Vesting Vault (V2) (Zarządzanie Blokadą)",
    pool: "Liquidity Pool (LP) (Płynność Rynku)",
    multisig: "Governance Multisig (Centrum Władzy)",
    timelock: "Timelock Controller (Opóźnione Zarządzanie)",
    emergency: "Emergency Vault (Bufor Bezpieczeństwa)"
  },
  'nl-NL': {
    token: "$MOONINI Token (Token Kern)",
    vesting: "Vesting Vault (V2) (Vergrendelingsbeheer)",
    pool: "Liquidity Pool (LP) (Marktliquiditeit)",
    multisig: "Governance Multisig (Machtcentrum)",
    timelock: "Timelock Controller (Vertraagde Governance)",
    emergency: "Emergency Vault (Veiligheidsbuffer)"
  },
  'sv-SE': {
    token: "$MOONINI Token (Token Kärna)",
    vesting: "Vesting Vault (V2) (Låsningshantering)",
    pool: "Liquidity Pool (LP) (Marknadslikviditet)",
    multisig: "Governance Multisig (Maktcentrum)",
    timelock: "Timelock Controller (Fördröjd Styrning)",
    emergency: "Emergency Vault (Säkerhetsbuffert)"
  },
  'da-DK': {
    token: "$MOONINI Token (Token Kerne)",
    vesting: "Vesting Vault (V2) (Låseadministration)",
    pool: "Liquidity Pool (LP) (Markedslikviditet)",
    multisig: "Governance Multisig (Magtcenter)",
    timelock: "Timelock Controller (Forsinket Governance)",
    emergency: "Emergency Vault (Sikkerhedsbuffer)"
  },
  'no-NO': {
    token: "$MOONINI Token (Token Kjerne)",
    vesting: "Vesting Vault (V2) (Låseadministrasjon)",
    pool: "Liquidity Pool (LP) (Markedslikviditet)",
    multisig: "Governance Multisig (Maktssenter)",
    timelock: "Timelock Controller (Forsinket Styre)",
    emergency: "Emergency Vault (Sikkerhetsbuffer)"
  },
  'fi-FI': {
    token: "$MOONINI Token (Token Ydin)",
    vesting: "Vesting Vault (V2) (Lukituksen Hallinta)",
    pool: "Liquidity Pool (LP) (Markkinoiden Likviditeetti)",
    multisig: "Governance Multisig (Valtakeskus)",
    timelock: "Timelock Controller (Viivästetty Hallinto)",
    emergency: "Emergency Vault (Turvapuskuri)"
  },
  'cs-CZ': {
    token: "$MOONINI Token (Jádro Tokenu)",
    vesting: "Vesting Vault (V2) (Správa Zámku)",
    pool: "Liquidity Pool (LP) (Tržní Likvidita)",
    multisig: "Governance Multisig (Centrum Moci)",
    timelock: "Timelock Controller (Zpožděná Správa)",
    emergency: "Emergency Vault (Bezpečnostní Buffer)"
  },
  'hu-HU': {
    token: "$MOONINI Token (Token Mag)",
    vesting: "Vesting Vault (V2) (Zárolás Kezelése)",
    pool: "Liquidity Pool (LP) (Piaci Likviditás)",
    multisig: "Governance Multisig (Hatalom Központ)",
    timelock: "Timelock Controller (Késleltetett Irányítás)",
    emergency: "Emergency Vault (Biztonsági Puffer)"
  },
  'ro-RO': {
    token: "$MOONINI Token (Nucleu Token)",
    vesting: "Vesting Vault (V2) (Gestionarea Blocării)",
    pool: "Liquidity Pool (LP) (Lichiditate de Piață)",
    multisig: "Governance Multisig (Centru de Putere)",
    timelock: "Timelock Controller (Guvernanță Întârziată)",
    emergency: "Emergency Vault (Buffer de Securitate)"
  },
  'el-GR': {
    token: "$MOONINI Token (Πυρήνας Token)",
    vesting: "Vesting Vault (V2) (Διαχείριση Κλειδώματος)",
    pool: "Liquidity Pool (LP) (Ρευστότητα Αγοράς)",
    multisig: "Governance Multisig (Κέντρο Εξουσίας)",
    timelock: "Timelock Controller (Καθυστερημένη Διακυβέρνηση)",
    emergency: "Emergency Vault (Ρυθμιστικό Ασφαλείας)"
  },
  'he-IL': {
    token: "$MOONINI Token (ליבת אסימון)",
    vesting: "Vesting Vault (V2) (ניהול נעילה)",
    pool: "Liquidity Pool (LP) (נזילות שוק)",
    multisig: "Governance Multisig (מרכז כוח)",
    timelock: "Timelock Controller (ממשל מעוכב)",
    emergency: "Emergency Vault (חיץ אבטחה)"
  },
  'fa-IR': {
    token: "$MOONINI Token (هسته توکن)",
    vesting: "Vesting Vault (V2) (مدیریت قفل)",
    pool: "Liquidity Pool (LP) (نقدینگی بازار)",
    multisig: "Governance Multisig (مرکز قدرت)",
    timelock: "Timelock Controller (حاکمیت تأخیری)",
    emergency: "Emergency Vault (بافر امنیتی)"
  },
  'ur-PK': {
    token: "$MOONINI Token (ٹوکن کور)",
    vesting: "Vesting Vault (V2) (لاک اپ مینجمنٹ)",
    pool: "Liquidity Pool (LP) (مارکیٹ لیکویڈیٹی)",
    multisig: "Governance Multisig (پاور سینٹر)",
    timelock: "Timelock Controller (تاخیر شدہ گورننس)",
    emergency: "Emergency Vault (سیفٹی بفر)"
  },
  'uk-UA': {
    token: "$MOONINI Token (Ядро Токена)",
    vesting: "Vesting Vault (V2) (Управління Блокуванням)",
    pool: "Liquidity Pool (LP) (Ринкова Ліквідність)",
    multisig: "Governance Multisig (Центр Влади)",
    timelock: "Timelock Controller (Відкладене Управління)",
    emergency: "Emergency Vault (Буфер Безпеки)"
  },
  'bn-BD': {
    token: "$MOONINI Token (টোকেন কোর)",
    vesting: "Vesting Vault (V2) (লকআপ ম্যানেজমেন্ট)",
    pool: "Liquidity Pool (LP) (বাজার তারল্য)",
    multisig: "Governance Multisig (পাওয়ার সেন্টার)",
    timelock: "Timelock Controller (বিলম্বিত শাসন)",
    emergency: "Emergency Vault (নিরাপত্তা বাফার)"
  }
};

async function syncContracts() {
  const locales = Object.keys(translations).concat(['zh-TW']);
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const locale of locales) {
    const filePath = join(I18N_DIR, locale, 'docs.json');
    
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // 檢查路徑：docs.litepaper.content.contracts
      // 確保路徑存在
      if (!data.docs) {
        data.docs = {};
      }
      if (!data.docs.litepaper) {
        data.docs.litepaper = {};
      }
      if (!data.docs.litepaper.content) {
        data.docs.litepaper.content = {};
      }
      if (!data.docs.litepaper.content.contracts) {
        data.docs.litepaper.content.contracts = {
          title: "",
          description: "",
          items: {},
          status: ""
        };
      }
      
      const contractsPath = data.docs.litepaper.content.contracts;

      // 獲取翻譯（zh-TW 使用基準值）
      const items = locale === 'zh-TW' 
        ? newContractItems 
        : (translations[locale] || newContractItems);

      // 更新 items
      contractsPath.items = items;

      // 寫回文件
      const updatedContent = JSON.stringify(data, null, 2) + '\n';
      await writeFile(filePath, updatedContent, 'utf-8');
      
      console.log(`✅ ${locale}: 已更新合約標籤`);
      totalUpdated++;
    } catch (error) {
      console.error(`❌ ${locale}: 錯誤 - ${error.message}`);
    }
  }

  console.log(`\n📊 總結: ${totalUpdated} 個語言已更新, ${totalSkipped} 個語言已跳過`);
}

syncContracts().catch(console.error);
