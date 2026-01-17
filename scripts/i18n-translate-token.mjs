import fs from 'fs';
import path from 'path';

// 所有語言的翻譯
const translations = {
  'zh-TW': {
    buy_now: "立即購買 $MOONINI",
    trade_on_pancake: "在 PancakeSwap 交易",
    price: "幣價",
    price_change_24h: "24h 漲跌",
    contract_address: "合約地址",
    copy_address: "複製地址",
    copy_success: "地址已複製",
    view_on_bscscan: "在 BscScan 查看",
    swap_modal: {
      title: "購買 $MOONINI",
      close: "關閉"
    }
  },
  'zh-CN': {
    buy_now: "立即购买 $MOONINI",
    trade_on_pancake: "在 PancakeSwap 交易",
    price: "币价",
    price_change_24h: "24h 涨跌",
    contract_address: "合约地址",
    copy_address: "复制地址",
    copy_success: "地址已复制",
    view_on_bscscan: "在 BscScan 查看",
    swap_modal: {
      title: "购买 $MOONINI",
      close: "关闭"
    }
  },
  'en-US': {
    buy_now: "Buy $MOONINI Now",
    trade_on_pancake: "Trade on PancakeSwap",
    price: "Price",
    price_change_24h: "24h Change",
    contract_address: "Contract Address",
    copy_address: "Copy Address",
    copy_success: "Copied!",
    view_on_bscscan: "View on BscScan",
    swap_modal: {
      title: "Buy $MOONINI",
      close: "Close"
    }
  },
  'en-GB': {
    buy_now: "Buy $MOONINI Now",
    trade_on_pancake: "Trade on PancakeSwap",
    price: "Price",
    price_change_24h: "24h Change",
    contract_address: "Contract Address",
    copy_address: "Copy Address",
    copy_success: "Copied!",
    view_on_bscscan: "View on BscScan",
    swap_modal: {
      title: "Buy $MOONINI",
      close: "Close"
    }
  },
  'ja-JP': {
    buy_now: "今すぐ $MOONINI を購入",
    trade_on_pancake: "PancakeSwap で取引",
    price: "価格",
    price_change_24h: "24時間変動",
    contract_address: "コントラクトアドレス",
    copy_address: "アドレスをコピー",
    copy_success: "アドレスをコピーしました",
    view_on_bscscan: "BscScan で表示",
    swap_modal: {
      title: "$MOONINI を購入",
      close: "閉じる"
    }
  },
  'ko-KR': {
    buy_now: "지금 $MOONINI 구매",
    trade_on_pancake: "PancakeSwap에서 거래",
    price: "가격",
    price_change_24h: "24시간 변동",
    contract_address: "컨트랙트 주소",
    copy_address: "주소 복사",
    copy_success: "주소가 복사되었습니다",
    view_on_bscscan: "BscScan에서 보기",
    swap_modal: {
      title: "$MOONINI 구매",
      close: "닫기"
    }
  },
  'es-ES': {
    buy_now: "Comprar $MOONINI ahora",
    trade_on_pancake: "Comerciar en PancakeSwap",
    price: "Precio",
    price_change_24h: "Cambio 24h",
    contract_address: "Dirección del contrato",
    copy_address: "Copiar dirección",
    copy_success: "¡Dirección copiada!",
    view_on_bscscan: "Ver en BscScan",
    swap_modal: {
      title: "Comprar $MOONINI",
      close: "Cerrar"
    }
  },
  'de-DE': {
    buy_now: "Jetzt $MOONINI kaufen",
    trade_on_pancake: "Auf PancakeSwap handeln",
    price: "Preis",
    price_change_24h: "24h Änderung",
    contract_address: "Vertragsadresse",
    copy_address: "Adresse kopieren",
    copy_success: "Adresse kopiert!",
    view_on_bscscan: "Auf BscScan anzeigen",
    swap_modal: {
      title: "$MOONINI kaufen",
      close: "Schließen"
    }
  },
  'fr-FR': {
    buy_now: "Acheter $MOONINI maintenant",
    trade_on_pancake: "Échanger sur PancakeSwap",
    price: "Prix",
    price_change_24h: "Variation 24h",
    contract_address: "Adresse du contrat",
    copy_address: "Copier l'adresse",
    copy_success: "Adresse copiée",
    view_on_bscscan: "Voir sur BscScan",
    swap_modal: {
      title: "Acheter $MOONINI",
      close: "Fermer"
    }
  },
  'it-IT': {
    buy_now: "Acquista $MOONINI ora",
    trade_on_pancake: "Scambia su PancakeSwap",
    price: "Prezzo",
    price_change_24h: "Variazione 24h",
    contract_address: "Indirizzo del contratto",
    copy_address: "Copia indirizzo",
    copy_success: "Indirizzo copiato!",
    view_on_bscscan: "Visualizza su BscScan",
    swap_modal: {
      title: "Acquista $MOONINI",
      close: "Chiudi"
    }
  },
  'pt-BR': {
    buy_now: "Comprar $MOONINI agora",
    trade_on_pancake: "Negociar no PancakeSwap",
    price: "Preço",
    price_change_24h: "Variação 24h",
    contract_address: "Endereço do contrato",
    copy_address: "Copiar endereço",
    copy_success: "Endereço copiado!",
    view_on_bscscan: "Ver no BscScan",
    swap_modal: {
      title: "Comprar $MOONINI",
      close: "Fechar"
    }
  },
  'pt-PT': {
    buy_now: "Comprar $MOONINI agora",
    trade_on_pancake: "Negociar no PancakeSwap",
    price: "Preço",
    price_change_24h: "Variação 24h",
    contract_address: "Endereço do contrato",
    copy_address: "Copiar endereço",
    copy_success: "Endereço copiado!",
    view_on_bscscan: "Ver no BscScan",
    swap_modal: {
      title: "Comprar $MOONINI",
      close: "Fechar"
    }
  },
  'ru-RU': {
    buy_now: "Купить $MOONINI сейчас",
    trade_on_pancake: "Торговать на PancakeSwap",
    price: "Цена",
    price_change_24h: "Изменение за 24ч",
    contract_address: "Адрес контракта",
    copy_address: "Копировать адрес",
    copy_success: "Адрес скопирован!",
    view_on_bscscan: "Посмотреть на BscScan",
    swap_modal: {
      title: "Купить $MOONINI",
      close: "Закрыть"
    }
  },
  'ar-SA': {
    buy_now: "شراء $MOONINI الآن",
    trade_on_pancake: "التداول على PancakeSwap",
    price: "السعر",
    price_change_24h: "التغيير 24 ساعة",
    contract_address: "عنوان العقد",
    copy_address: "نسخ العنوان",
    copy_success: "تم نسخ العنوان!",
    view_on_bscscan: "عرض على BscScan",
    swap_modal: {
      title: "شراء $MOONINI",
      close: "إغلاق"
    }
  },
  'fa-IR': {
    buy_now: "خرید $MOONINI اکنون",
    trade_on_pancake: "معامله در PancakeSwap",
    price: "قیمت",
    price_change_24h: "تغییر 24 ساعته",
    contract_address: "آدرس قرارداد",
    copy_address: "کپی آدرس",
    copy_success: "آدرس کپی شد!",
    view_on_bscscan: "مشاهده در BscScan",
    swap_modal: {
      title: "خرید $MOONINI",
      close: "بستن"
    }
  },
  'he-IL': {
    buy_now: "קנה $MOONINI עכשיו",
    trade_on_pancake: "סחר ב-PancakeSwap",
    price: "מחיר",
    price_change_24h: "שינוי 24 שעות",
    contract_address: "כתובת החוזה",
    copy_address: "העתק כתובת",
    copy_success: "הכתובת הועתקה!",
    view_on_bscscan: "צפה ב-BscScan",
    swap_modal: {
      title: "קנה $MOONINI",
      close: "סגור"
    }
  },
  'hi-IN': {
    buy_now: "अभी $MOONINI खरीदें",
    trade_on_pancake: "PancakeSwap पर ट्रेड करें",
    price: "मूल्य",
    price_change_24h: "24 घंटे में परिवर्तन",
    contract_address: "कॉन्ट्रैक्ट पता",
    copy_address: "पता कॉपी करें",
    copy_success: "पता कॉपी हो गया!",
    view_on_bscscan: "BscScan पर देखें",
    swap_modal: {
      title: "$MOONINI खरीदें",
      close: "बंद करें"
    }
  },
  'th-TH': {
    buy_now: "ซื้อ $MOONINI ตอนนี้",
    trade_on_pancake: "เทรดบน PancakeSwap",
    price: "ราคา",
    price_change_24h: "การเปลี่ยนแปลง 24 ชั่วโมง",
    contract_address: "ที่อยู่สัญญา",
    copy_address: "คัดลอกที่อยู่",
    copy_success: "คัดลอกที่อยู่แล้ว!",
    view_on_bscscan: "ดูบน BscScan",
    swap_modal: {
      title: "ซื้อ $MOONINI",
      close: "ปิด"
    }
  },
  'vi-VN': {
    buy_now: "Mua $MOONINI ngay",
    trade_on_pancake: "Giao dịch trên PancakeSwap",
    price: "Giá",
    price_change_24h: "Thay đổi 24h",
    contract_address: "Địa chỉ hợp đồng",
    copy_address: "Sao chép địa chỉ",
    copy_success: "Đã sao chép địa chỉ!",
    view_on_bscscan: "Xem trên BscScan",
    swap_modal: {
      title: "Mua $MOONINI",
      close: "Đóng"
    }
  },
  'id-ID': {
    buy_now: "Beli $MOONINI sekarang",
    trade_on_pancake: "Perdagangkan di PancakeSwap",
    price: "Harga",
    price_change_24h: "Perubahan 24j",
    contract_address: "Alamat kontrak",
    copy_address: "Salin alamat",
    copy_success: "Alamat disalin!",
    view_on_bscscan: "Lihat di BscScan",
    swap_modal: {
      title: "Beli $MOONINI",
      close: "Tutup"
    }
  },
  'tr-TR': {
    buy_now: "Şimdi $MOONINI satın al",
    trade_on_pancake: "PancakeSwap'da işlem yap",
    price: "Fiyat",
    price_change_24h: "24 saatlik değişim",
    contract_address: "Sözleşme adresi",
    copy_address: "Adresi kopyala",
    copy_success: "Adres kopyalandı!",
    view_on_bscscan: "BscScan'de görüntüle",
    swap_modal: {
      title: "$MOONINI satın al",
      close: "Kapat"
    }
  },
  'pl-PL': {
    buy_now: "Kup $MOONINI teraz",
    trade_on_pancake: "Handluj na PancakeSwap",
    price: "Cena",
    price_change_24h: "Zmiana 24h",
    contract_address: "Adres kontraktu",
    copy_address: "Skopiuj adres",
    copy_success: "Adres skopiowany!",
    view_on_bscscan: "Zobacz na BscScan",
    swap_modal: {
      title: "Kup $MOONINI",
      close: "Zamknij"
    }
  },
  'nl-NL': {
    buy_now: "Koop $MOONINI nu",
    trade_on_pancake: "Handel op PancakeSwap",
    price: "Prijs",
    price_change_24h: "24u verandering",
    contract_address: "Contractadres",
    copy_address: "Adres kopiëren",
    copy_success: "Adres gekopieerd!",
    view_on_bscscan: "Bekijk op BscScan",
    swap_modal: {
      title: "Koop $MOONINI",
      close: "Sluiten"
    }
  },
  'sv-SE': {
    buy_now: "Köp $MOONINI nu",
    trade_on_pancake: "Handla på PancakeSwap",
    price: "Pris",
    price_change_24h: "24h förändring",
    contract_address: "Kontraktsadress",
    copy_address: "Kopiera adress",
    copy_success: "Adress kopierad!",
    view_on_bscscan: "Visa på BscScan",
    swap_modal: {
      title: "Köp $MOONINI",
      close: "Stäng"
    }
  },
  'uk-UA': {
    buy_now: "Купити $MOONINI зараз",
    trade_on_pancake: "Торгувати на PancakeSwap",
    price: "Ціна",
    price_change_24h: "Зміна за 24 год",
    contract_address: "Адреса контракту",
    copy_address: "Копіювати адресу",
    copy_success: "Адресу скопійовано!",
    view_on_bscscan: "Переглянути на BscScan",
    swap_modal: {
      title: "Купити $MOONINI",
      close: "Закрити"
    }
  },
  'hu-HU': {
    buy_now: "Vásárolj $MOONINI-t most",
    trade_on_pancake: "Kereskedés a PancakeSwap-on",
    price: "Ár",
    price_change_24h: "24 órás változás",
    contract_address: "Szerződés címe",
    copy_address: "Cím másolása",
    copy_success: "Cím másolva!",
    view_on_bscscan: "Megtekintés a BscScan-en",
    swap_modal: {
      title: "Vásárolj $MOONINI-t",
      close: "Bezárás"
    }
  },
  'el-GR': {
    buy_now: "Αγοράστε $MOONINI τώρα",
    trade_on_pancake: "Συναλλαγή στο PancakeSwap",
    price: "Τιμή",
    price_change_24h: "Αλλαγή 24ωρου",
    contract_address: "Διεύθυνση συμβολαίου",
    copy_address: "Αντιγραφή διεύθυνσης",
    copy_success: "Η διεύθυνση αντιγράφηκε!",
    view_on_bscscan: "Προβολή στο BscScan",
    swap_modal: {
      title: "Αγοράστε $MOONINI",
      close: "Κλείσιμο"
    }
  },
  'bn-BD': {
    buy_now: "এখন $MOONINI কিনুন",
    trade_on_pancake: "PancakeSwap-এ ট্রেড করুন",
    price: "মূল্য",
    price_change_24h: "24 ঘন্টার পরিবর্তন",
    contract_address: "চুক্তির ঠিকানা",
    copy_address: "ঠিকানা কপি করুন",
    copy_success: "ঠিকানা কপি করা হয়েছে!",
    view_on_bscscan: "BscScan-এ দেখুন",
    swap_modal: {
      title: "$MOONINI কিনুন",
      close: "বন্ধ করুন"
    }
  },
  'cs-CZ': {
    buy_now: "Kupte si $MOONINI nyní",
    trade_on_pancake: "Obchodujte na PancakeSwap",
    price: "Cena",
    price_change_24h: "Změna za 24h",
    contract_address: "Adresa smlouvy",
    copy_address: "Kopírovat adresu",
    copy_success: "Adresa zkopírována!",
    view_on_bscscan: "Zobrazit na BscScan",
    swap_modal: {
      title: "Kupte si $MOONINI",
      close: "Zavřít"
    }
  },
  'da-DK': {
    buy_now: "Køb $MOONINI nu",
    trade_on_pancake: "Handel på PancakeSwap",
    price: "Pris",
    price_change_24h: "24t ændring",
    contract_address: "Kontraktadresse",
    copy_address: "Kopiér adresse",
    copy_success: "Adresse kopieret!",
    view_on_bscscan: "Se på BscScan",
    swap_modal: {
      title: "Køb $MOONINI",
      close: "Luk"
    }
  },
  'no-NO': {
    buy_now: "Kjøp $MOONINI nå",
    trade_on_pancake: "Handel på PancakeSwap",
    price: "Pris",
    price_change_24h: "24t endring",
    contract_address: "Kontraktadresse",
    copy_address: "Kopier adresse",
    copy_success: "Adresse kopiert!",
    view_on_bscscan: "Se på BscScan",
    swap_modal: {
      title: "Kjøp $MOONINI",
      close: "Lukk"
    }
  },
  'ro-RO': {
    buy_now: "Cumpără $MOONINI acum",
    trade_on_pancake: "Tranzacționează pe PancakeSwap",
    price: "Preț",
    price_change_24h: "Schimbare 24h",
    contract_address: "Adresa contractului",
    copy_address: "Copiază adresa",
    copy_success: "Adresa copiată!",
    view_on_bscscan: "Vezi pe BscScan",
    swap_modal: {
      title: "Cumpără $MOONINI",
      close: "Închide"
    }
  },
  'ur-PK': {
    buy_now: "ابھی $MOONINI خریدیں",
    trade_on_pancake: "PancakeSwap پر ٹریڈ کریں",
    price: "قیمت",
    price_change_24h: "24 گھنٹے کی تبدیلی",
    contract_address: "معاہدے کا پتہ",
    copy_address: "پتہ کاپی کریں",
    copy_success: "پتہ کاپی ہو گیا!",
    view_on_bscscan: "BscScan پر دیکھیں",
    swap_modal: {
      title: "$MOONINI خریدیں",
      close: "بند کریں"
    }
  },
  'fi-FI': {
    buy_now: "Osta $MOONINI nyt",
    trade_on_pancake: "Käy kauppaa PancakeSwapissa",
    price: "Hinta",
    price_change_24h: "24h muutos",
    contract_address: "Sopimuksen osoite",
    copy_address: "Kopioi osoite",
    copy_success: "Osoite kopioitu!",
    view_on_bscscan: "Näytä BscScanissa",
    swap_modal: {
      title: "Osta $MOONINI",
      close: "Sulje"
    }
  }
};

const BASE_DIR = 'src/i18n/messages';
const MODULE_NAME = 'token.json';

console.log('🚀 開始翻譯所有語言的 token.json...\n');

let successCount = 0;
let errorCount = 0;

for (const [locale, translation] of Object.entries(translations)) {
  const targetDir = path.join(BASE_DIR, locale);
  const targetPath = path.join(targetDir, MODULE_NAME);
  
  try {
    if (!fs.existsSync(targetDir)) {
      console.warn(`⚠️  目錄不存在: ${targetDir}, 跳過...`);
      errorCount++;
      continue;
    }
    
    const content = JSON.stringify(translation, null, 2);
    fs.writeFileSync(targetPath, content + '\n', 'utf8');
    console.log(`✅ ${locale}: 已更新`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${locale}: 錯誤 - ${error.message}`);
    errorCount++;
  }
}

console.log(`\n📊 完成！成功: ${successCount}, 失敗: ${errorCount}`);
