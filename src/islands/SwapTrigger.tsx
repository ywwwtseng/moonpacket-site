import React, { useState, useEffect } from 'react';
import SwapModal from './SwapModal';

interface Props {
  buttonText?: string;
  modalTitle?: string;
  closeLabel?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

// 客戶端專用的 tokenify 函數（只處理代幣符號，與 server 端 brandify 邏輯一致）
function clientTokenify(input?: string): string {
  if (!input) return "";
  let text = input.toString();

  // 如果已經包含代幣標籤，跳過處理
  if (text.includes('token-mark')) {
    return text;
  }

  // 保護已有的 HTML 標籤
  const placeholders: string[] = [];
  text = text.replace(/<[^>]*>/g, (match) => {
    placeholders.push(match);
    return `__HTML_TAG_${placeholders.length - 1}__`;
  });

  // 處理代幣符號：$MOONINI 或 $moonini -> $MOONINI (全大寫，token-mark)
  // 使用與 server 端 brandify 相同的正則表達式
  text = text.replace(/\$moonini/gi, '__TOKEN_MARK__');

  // 還原所有佔位符為實際 HTML
  text = text.replace(/__TOKEN_MARK__/g, '<span class="token-mark">$MOONINI</span>');

  // 還原 HTML 標籤
  text = text.replace(/__HTML_TAG_(\d+)__/g, (_, index) => placeholders[parseInt(index)]);

  return text;
}

export default function SwapTrigger({ 
  buttonText = 'Buy $MOONINI', 
  modalTitle,
  closeLabel,
  className = '',
  variant = 'primary'
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [processedText, setProcessedText] = useState<string>('');

  // 客戶端掛載後立即處理 tokenify（只處理代幣符號）
  useEffect(() => {
    if (buttonText) {
      setProcessedText(clientTokenify(buttonText));
    }
  }, [buttonText]);

  const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 font-bold rounded-full transition-all duration-300 overflow-hidden group";
  
  const variants = {
    primary: "bg-[var(--gold)] text-[#0b1220] hover:scale-105 hover:shadow-[0_0_20px_rgba(243,186,47,0.4)]",
    outline: "border-2 border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]",
    ghost: "text-[var(--text-subtle)] hover:text-[var(--gold)] hover:bg-white/5"
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {processedText ? (
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          ) : (
            <span>{buttonText}</span>
          )}
          
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover:translate-x-1 transition-transform inline-block ml-1">
            <path d="M10.5 4.5L15 9M15 9L10.5 13.5M15 9H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>

      <SwapModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={modalTitle}
        closeLabel={closeLabel}
      />
    </>
  );
}
