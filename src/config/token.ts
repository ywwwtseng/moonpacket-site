/**
 * $MOONINI 代幣核心配置
 * 唯一事實來源 (SSOT)
 */

export const TOKEN_INFO = {
  symbol: "MOONINI",
  displaySymbol: "$MOONINI",
  name: "Moonini",
  address: "0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe",
  decimals: 18,
  chain: "BSC",
  explorerBaseUrl: "https://bscscan.com/token/",
  pancakeUrl: "https://pancakeswap.finance/swap?outputCurrency=0xe4d5857271c7978F5fe6b29A73C97142D6d8Befe",
  lpAddress: "0x24248E591eC8FDeC9776f87C497746867305963E"
} as const;

export const SWAP_WIDGET_CONFIG = {
  theme: "dark",
  accentColor: "#f3ba2f",
  // PancakeSwap Widget 參數
  feeRecipient: "0x8c1c793E73372aCD30DD05fE4Cc718A4ADbe1219", // 使用您的緊急提款多簽地址作為推薦人（如果適用）
};
