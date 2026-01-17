import React, { useState } from 'react';
import { TOKEN_INFO } from '@/config/token';
import SwapModal from './SwapModal';

interface Props {
  addresses: {
    token: string;
    vesting: string;
    pool: string;
    multisig: string;
  };
  labels: {
    token: string;
    vesting: string;
    pool: string;
    multisig: string;
  };
  networkLabel?: string;
  copySuccessLabel?: string;
  viewLabel?: string;
  tradeLabel?: string;
}

export default function TokenRegistryCard({ 
  addresses, 
  labels,
  networkLabel = 'Network: BNB Smart Chain (BSC)',
  copySuccessLabel = 'Copied!',
  viewLabel = 'View',
  tradeLabel = 'Buy'
}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSwapOpen, setIsSwapOpen] = useState(false);

  const handleCopy = (key: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderAddressRow = (key: string, label: string, address: string) => {
    const isToken = key === 'token';
    const isCopied = copiedKey === key;

    return (
      <div 
        key={key}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--gold)]/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className={`w-2 h-2 rounded-full ${address ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-yellow-500 animate-pulse'}`}></div>
          <span className="text-sm font-medium text-[var(--text-subtle)] group-hover:text-[var(--text)] transition-colors">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 font-mono text-xs transition-all ${isCopied ? 'bg-[var(--gold)]/20 border-[var(--gold)]/40' : ''}`}>
            <span className="text-[var(--text)] opacity-80 group-hover:opacity-100">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            
            <button
              onClick={() => handleCopy(key, address)}
              className="p-1 hover:text-[var(--gold)] transition-colors"
              title="Copy Address"
            >
              {isCopied ? (
                <span className="text-[10px] font-bold text-[var(--gold)] uppercase">{copySuccessLabel}</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>

          <a
            href={isToken ? `${TOKEN_INFO.explorerBaseUrl}${address}` : `https://bscscan.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-subtle)] hover:text-white transition-all"
            title={viewLabel}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          {isToken && (
            <button
              onClick={() => setIsSwapOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--gold)] text-[#0b1220] text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-[var(--gold)]/10"
            >
              {tradeLabel}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--card-bg)]/90 dark:bg-[var(--card-bg)]/30 backdrop-blur-md rounded-[2rem] border border-[var(--card-ring)] shadow-lg shadow-black/5 dark:shadow-none p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--text)]">
        <span className="text-[var(--gold)]">📜</span> 
        On-chain Registry
      </h2>
      
      <div className="space-y-4">
        {renderAddressRow('token', labels.token, addresses.token)}
        {renderAddressRow('vesting', labels.vesting, addresses.vesting)}
        {renderAddressRow('pool', labels.pool, addresses.pool)}
        {renderAddressRow('multisig', labels.multisig, addresses.multisig)}

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-subtle)] opacity-60">
          <span>{networkLabel}</span>
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Verified Contracts
          </span>
        </div>
      </div>

      <SwapModal 
        isOpen={isSwapOpen} 
        onClose={() => setIsSwapOpen(false)} 
      />
    </div>
  );
}
