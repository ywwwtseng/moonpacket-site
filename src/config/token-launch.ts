/**
 * 代幣發行配置
 * 
 * 使用說明：
 * 1. 啟用倒計時：設置 launchDate 為發幣日期（ISO 8601 格式）
 *    例如：'2025-12-31T00:00:00Z' 或 '2025-12-31T08:00:00+08:00'
 * 
 * 2. 禁用倒計時：設置 launchDate 為空字串 ''，或設置 isLaunched 為 true
 * 
 * 3. 發幣後：設置 isLaunched 為 true，倒計時區塊將自動隱藏
 */
export const TOKEN_LAUNCH_CONFIG = {
  // 設置為發幣日期（ISO 8601 格式），或留空表示未確定
  // 格式：'YYYY-MM-DDTHH:mm:ssZ' 或 'YYYY-MM-DDTHH:mm:ss+08:00'
  launchDate: '', // '2025-12-31T00:00:00Z' 或 ''（空字串表示未啟用）
  
  // 是否已發幣（手動設置）
  // true = 已發幣，倒計時區塊隱藏
  // false = 未發幣，根據 launchDate 決定是否顯示倒計時
  isLaunched: false,
} as const;

/**
 * 判斷是否應該顯示倒計時
 * 
 * 返回 true 的條件：
 * 1. launchDate 不為空
 * 2. isLaunched 為 false
 * 3. 當前時間 < launchDate
 */
export function shouldShowCountdown(): boolean {
  // 如果已發幣，不顯示倒計時
  if (TOKEN_LAUNCH_CONFIG.isLaunched) return false;
  
  // 如果未設置發幣日期，不顯示倒計時
  if (!TOKEN_LAUNCH_CONFIG.launchDate) return false;
  
  // 檢查當前時間是否已超過發幣時間
  try {
    const launch = new Date(TOKEN_LAUNCH_CONFIG.launchDate);
    const now = new Date();
    
    // 如果日期無效，不顯示倒計時
    if (isNaN(launch.getTime())) return false;
    
    // 如果當前時間 >= 發幣時間，不顯示倒計時（建議設置 isLaunched = true）
    return now < launch;
  } catch {
    return false;
  }
}

