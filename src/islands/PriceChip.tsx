import React, { useState, useEffect } from 'react';
import { TOKEN_INFO } from '@/config/token';

interface Props {
  label?: string;
  className?: string;
}

interface PriceData {
  priceUsd: string;
  priceChange24h: number;
  loading: boolean;
  error: boolean;
}

export default function PriceChip({ label = 'Price', className = '' }: Props) {
  const [data, setData] = useState<PriceData>({
    priceUsd: '0.00',
    priceChange24h: 0,
    loading: true,
    error: false
  });

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // 使用 DexScreener 代幣地址查詢，比 LP 更穩定
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_INFO.address}`,
          { cache: 'no-store' }
        );
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        
        // 尋找 BSC 鏈上的對應交易對
        const bscPair = json.pairs?.find((p: any) => p.chainId === 'bsc' && p.baseToken.address.toLowerCase() === TOKEN_INFO.address.toLowerCase());

        if (bscPair) {
          setData({
            priceUsd: bscPair.priceUsd || '0.00',
            priceChange24h: bscPair.priceChange?.h24 || 0,
            loading: false,
            error: false
          });
        } else {
          throw new Error('BSC Pair not found');
        }
      } catch (err) {
        console.warn('[PriceChip] Failed to fetch price:', err);
        setData(prev => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (data.loading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-white/5 animate-pulse ${className}`}>
        <div className="w-12 h-4 bg-white/10 rounded"></div>
        <div className="w-16 h-4 bg-white/10 rounded"></div>
      </div>
    );
  }

  const isPositive = data.priceChange24h >= 0;

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-white/5 hover:border-[var(--gold)]/30 transition-all cursor-default group ${className}`}
      title={`${TOKEN_INFO.displaySymbol} Price via DexScreener`}
    >
      <span className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">
        {label}
      </span>
      
      <span className="font-mono font-bold text-[var(--gold)] text-shadow-gold">
        ${parseFloat(data.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
      </span>

      {!data.error && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          isPositive 
            ? 'text-emerald-400 bg-emerald-400/10' 
            : 'text-rose-400 bg-rose-400/10'
        }`}>
          {isPositive ? '↑' : '↓'}{Math.abs(data.priceChange24h)}%
        </span>
      )}

      {data.error && (
        <span className="text-[10px] text-rose-400 opacity-50">API Offline</span>
      )}
    </div>
  );
}
