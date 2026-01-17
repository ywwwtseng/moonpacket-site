import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKEN_INFO } from '@/config/token';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  closeLabel?: string;
}

export default function SwapModal({ 
  isOpen, 
  onClose, 
  title = 'Swap $MOONINI', 
  closeLabel = 'Close' 
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // PancakeSwap URL with preset tokens: USDT -> MOONINI
  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
  const pancakeUrl = `https://pancakeswap.finance/swap?inputCurrency=${USDT_ADDRESS}&outputCurrency=${TOKEN_INFO.address}`;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[500px] bg-[#1d2230] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)]"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--gold)] to-yellow-200 p-0.5 shadow-[0_0_20px_rgba(243,186,47,0.3)]">
                  <div className="w-full h-full rounded-[14px] bg-[#0b1220] flex items-center justify-center overflow-hidden">
                    <img src="/moonini.svg" alt="Token" className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                    {title}
                  </h3>
                  <p className="text-[10px] text-[var(--gold)] font-bold uppercase tracking-widest opacity-60">
                    Binance Smart Chain
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-white/40 group-hover:text-white transition-colors">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Iframe */}
            <div className="relative z-10 w-full h-[580px] bg-black/40">
              <iframe
                src={pancakeUrl}
                title="PancakeSwap"
                className="absolute inset-0 w-full h-full border-0"
                allow="payment"
              />
            </div>

            {/* Security Footer */}
            <div className="relative z-10 px-8 py-4 bg-white/5 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                Secure Transaction via PancakeSwap
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
