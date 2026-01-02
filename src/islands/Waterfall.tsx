import { useEffect } from 'react';
import { externals } from '@/config/app';

interface WaterfallProps {
  src: string;
  selector: string;
  intervalMs?: number;
  sentFromLabel?: string;
  claimedLabel?: string;
  totalLabel?: string;
  progressLabel?: string;
  userFallback?: string;
  groupFallback?: string;
}

// DYNAMIC: Red packet waterfall placeholder
// HOW TO REPLACE API LATER:
// - Change `src` to your real endpoint; JSON schema in /public/data/waterfall.json
export default function Waterfall({
  src,
  selector,
  intervalMs,
  sentFromLabel,
  claimedLabel,
  totalLabel,
  progressLabel,
  userFallback,
  groupFallback,
}: WaterfallProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window !== 'undefined') {
      console.debug('[Waterfall] component mounted, selector:', selector);
    }

    const root = document.querySelector(selector) as HTMLElement | null;
    if (!root) {
      if (typeof window !== 'undefined') {
        console.error('[Waterfall] selector not found:', selector);
      }
      return;
    }
    const container = root as HTMLElement;

    if (typeof window !== 'undefined') {
      console.debug('[Waterfall] root element found, current children:', container.children.length);
    }
    // detect RTL from <html dir="rtl">
    const isRtl =
      typeof document !== 'undefined' &&
      document.documentElement &&
      document.documentElement.getAttribute('dir') === 'rtl';
    let data: any[] = [];
    let idx = 0;
    let timer: any = null;
    let displayedIds = new Set<string>();

    function mapGroupUrl(name: string): string {
      if (/TON Builders/i.test(name)) return externals.telegram.supergroup;
      if (/Meme Rocket/i.test(name)) return externals.telegram.supergroup;
      if (/Moon Club A/i.test(name)) return externals.telegram.supergroup;
      if (/moonpacket/i.test(name)) return externals.telegram.supergroup;
      return '';
    }

    function mock(n: number): any[] {
      const users = [
        'Alice',
        'Bob',
        'Carol',
        'Dave',
        'Erin',
        'Frank',
        'Grace',
        'Heidi',
        'Ivan',
        'Judy',
        'Ken',
        'Lily',
        'Ming',
        'Nina',
        'Owen',
        'Paul',
        'Queenie',
        'Ray',
        'Sara',
        'Tom',
        'Una',
        'Vic',
        'Will',
        'Xena',
        'Yao',
        'Zack',
      ];
      const groups = ['Moon Club A', 'TON Builders', 'Meme Rocket', 'moonpacket 總群'];
      const ccys = ['USDT', 'ETH', 'SOL', 'TON'];
      const now = Date.now();
      const items: any[] = [];
      for (let i = 0; i < n; i++) {
        const total = +(Math.random() * 200 + 50).toFixed(2);
        const claimed = Math.floor(Math.random() * 100);
        const quota = 100;
        items.push({
          id: `mock_${i}`,
          user: users[i % users.length],
          group: groups[i % groups.length],
          link: mapGroupUrl(groups[i % groups.length]),
          amount: +(Math.random() * 12 + 1).toFixed(2),
          ccy: ccys[i % ccys.length],
          ts: new Date(now - i * 20_000).toISOString(),
          total_amount: total,
          claimed_count: claimed,
          total_count: quota,
        });
      }
      return items;
    }

    function redPacketIcon(): string {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="#E32521"/><path d="M4 8l8 4 8-4" fill="#FFBA00"/></svg>`;
    }

    function currencyIcon(ccy: string): string {
      const base =
        'width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';
      if (ccy === 'USDT') {
        return `<svg ${base}><circle cx="12" cy="12" r="10" fill="#26A17B"/><path d="M7 7h10v2h-4v3.5c2.5.2 4 .7 4 1.5s-2.9 1.5-5 1.5-5-.7-5-1.5c0-.8 1.5-1.3 4-1.5V9H7V7z" fill="#fff"/></svg>`;
      }
      if (ccy === 'ETH') {
        return `<svg ${base}><circle cx="12" cy="12" r="10" fill="#627EEA"/><path d="M12 4l5 8-5 3-5-3 5-8zm0 16l5-7-5 3-5-3 5 7z" fill="#fff"/></svg>`;
      }
      if (ccy === 'SOL') {
        return `<svg ${base}><circle cx="12" cy="12" r="10" fill="#14F195"/><path d="M7 9l2-2h8l-2 2H7zm0 4l2-2h8l-2 2H7zm0 4l2-2h8l-2 2H7z" fill="#0B1F1A"/></svg>`;
      }
      if (ccy === 'BNB') {
        return `<svg ${base}><circle cx="12" cy="12" r="10" fill="#F3BA2F"/><path d="M12 4l2.5 2.5-5.5 5.5L12 17l3-3-5.5-5.5L12 4zm-2.5 2.5L7 9l2.5 2.5L12 9l-2.5-2.5zm5 0L17 9l-2.5 2.5L12 9l2.5-2.5zM7 15l2.5 2.5L12 15l-2.5-2.5L7 15zm10 0l-2.5 2.5L12 15l2.5-2.5L17 15z" fill="#fff"/></svg>`;
      }
      // TON default
      return `<svg ${base}><circle cx="12" cy="12" r="10" fill="#0098EA"/><path d="M12 6c3 0 5 1.5 5 3.7 0 .9-.3 1.7-.8 2.4L12 18l-4.2-5.9c-.5-.7-.8-1.5-.8-2.4C7 7.5 9 6 12 6z" fill="#fff"/></svg>`;
    }

    function tokenIcon(item: any, ccy: string): string {
      // 优先使用 token_icon（如果存在）
      if (item && item.token_icon) {
        const icon = String(item.token_icon);
        // 如果是 URL 或 base64 图片
        if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:image/')) {
          return `<img src="${icon}" alt="${ccy}" width="14" height="14" class="rounded-full flex-shrink-0" style="width: 14px; height: 14px; object-fit: cover; border-radius: 50%; display: inline-block; overflow: hidden;" />`;
        }
        // 如果是 SVG 字符串
        if (icon.trim().startsWith('<svg')) {
          return icon;
        }
      }
      // 回退到 currencyIcon
      return currencyIcon(ccy);
    }

    function fmtInt(n: any): string {
      try {
        return new Intl.NumberFormat(undefined).format(Number(n || 0));
      } catch (_) {
        return String(n || 0);
      }
    }

    // 转换新 API 格式到组件期望的格式
    function transformApiItem(apiItem: any): any {
      // 解析 token_id，格式如 "BNB:18:bsc" -> 提取币种和精度
      let ccy = 'USDT';
      let decimals = 18;
      if (apiItem.token_id) {
        const parts = String(apiItem.token_id).split(':');
        if (parts.length >= 1) {
          ccy = parts[0].toUpperCase();
        }
        if (parts.length >= 2) {
          decimals = parseInt(parts[1], 10) || 18;
        }
      }

      // 转换金额：从 wei/最小单位转换为正常单位
      const divisor = Math.pow(10, decimals);
      const balance = Number(apiItem.balance || 0) / divisor;
      const total = Number(apiItem.total || 0) / divisor;
      const amount = Number(apiItem.amount || 0) / divisor;
      

      // sented_usdt 是已发送的 USDT 等价金额（可能已经是转换后的值）
      const sentedUsdt = apiItem.sented_usdt ? Number(apiItem.sented_usdt) : null;
      const recipients = Number(apiItem.recipients || 0);

      // const amount = total - balance;

      // total_amount 使用 sented_usdt（如果存在，这是已发送的总 USDT 等价金额）
      // 否则使用转换后的 total（原始代币总金额）
      const totalAmount = total;

      // 构建 Telegram 群组链接
      let link = '';
      if (apiItem.tg_chat_username) {
        const message_id = apiItem.message_id?.split(':')[1] || '';
        if (message_id) {
          link = `https://t.me/${apiItem.tg_chat_username}/${message_id}`;
        } else {
          link = `https://t.me/${apiItem.tg_chat_username}`;
        }
      } else if (apiItem.tg_chat_id) {
        // 如果是数字 ID，可能需要特殊处理
        link = mapGroupUrl(apiItem.tg_chat_name || '');
      } else {
        link = mapGroupUrl(apiItem.tg_chat_name || '');
      }

      // 计算 total_count：如果没有明确的值，使用一个合理的默认值
      // 可以根据 claimed_count 和 total_amount 估算，或使用固定值
      const claimedCount = Number(apiItem.recipients || 0);
      const totalCount =
        apiItem.total_count || (claimedCount > 0 ? Math.max(claimedCount * 2, 50) : 100);

      return {
        id: apiItem.id || `evt_${Date.now()}_${Math.random()}`,
        user: apiItem.user_first_name || userFallback || 'User',
        group: apiItem.tg_chat_name || groupFallback || 'Group',
        link: link,
        token_icon: apiItem.token_icon,
        amount,
        ccy: ccy,
        ts: apiItem.created_at || new Date().toISOString(),
        total_amount: totalAmount,
        claimed_count: claimedCount,
        total_count: totalCount,
      };
    }

    function renderOne(item: any) {
      const card = document.createElement('div');
      card.className =
        'col-span-1 sm:col-span-2 lg:col-span-3 p-3 md:p-4 rounded-lg bg-white ring-1 ring-black/5 hover:ring-black/10 hover:shadow-md transition-all text-sm';
      card.style.transition = 'transform .28s ease, opacity .28s ease';
      card.style.transform = 'translateY(-12px)';
      card.style.opacity = '0';
      const ccy = item && item.ccy ? String(item.ccy) : 'USDT';
      // function formatAmt(v: any, curr: string): string {
      //   var n = Number(v == null ? 0 : v);
      //   let decimals = 2;
      //   if (n < 0.01) decimals = 4;
      //   else if (n < 1) decimals = 3;
      //   var opts = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
      //   try {
      //     return new Intl.NumberFormat(undefined, opts).format(n);
      //   } catch (_) {
      //     return String(n.toFixed(decimals));
      //   }
      // }

      function formatAmt(v: any) {
        if (v === undefined || v === null) {
          return undefined;
        }
      
        if (v === '0' || v === 0) {
          return '0';
        }
      
        let digits = 0;
        const number = Number(v);
      
        if (number > 10000) {
          digits = 1;
        } else if (number > 1000) {
          digits = 2;
        } else if (number > 100) {
          digits = 2;
        } else if (number > 10) {
          digits = 2;
        } else if (number === 1) {
          digits = 2;
        } else if (number > 1) {
          digits = 3;
        } else if (number === 0) {
          digits = 2;
        } else if (number > 0.1) {
          digits = 3;
        } else if (number > 0.01) {
          digits = 4;
        } else {
          digits = 8;
        }
      
        // 無條件捨去（向下取整）
        const multiplier = Math.pow(10, digits);
        const floored = Math.floor(number * multiplier) / multiplier;
      
        return floored
          .toLocaleString('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
          })
          .replace(/\.?0+$/, '');
      }

      const groupHref =
        (item && (item.link || item.group_link)) ||
        mapGroupUrl(item && item.group ? String(item.group) : '');
      const textAlignTail = isRtl ? 'text-left' : 'text-right';
      card.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-3">
            <div class="inline-flex items-center gap-2 font-semibold text-base">
              ${redPacketIcon()}
              <span>${item.user || userFallback || ''}</span>
            </div>
            <div class="inline-flex items-center gap-1.5 text-primary font-bold text-base">
              ${tokenIcon(item, ccy)}
              <span>${claimedLabel || ''} <span class="num">${formatAmt(item.amount)}</span> ${ccy}</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-textSubtle">
            <span class="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              ${groupHref ? `<a href="${groupHref}" target="_blank" rel="noopener" class="underline hover:opacity-80">${item.group || groupFallback || ''}</a>` : item.group || groupFallback || ''}
            </span>
            <span class="hidden sm:inline text-gray-400">•</span>
            <span>${totalLabel || 'Total'} <span class="num font-medium">${formatAmt(item.total_amount ?? item.amount * 100)}</span> ${ccy}</span>
            <span class="hidden sm:inline text-gray-400">•</span>
            <span>${progressLabel || 'Progress'} <span class="font-medium">${fmtInt(item.claimed_count ?? 0)}</span>/<span class="font-medium">${fmtInt(item.total_count ?? 100)}</span></span>
            <span class="hidden sm:inline text-gray-400">•</span>
            <span class="${textAlignTail}">${new Date(item.ts || Date.now()).toLocaleTimeString()}</span>
          </div>
        </div>
      `;
      // FLIP：插入前記錄既有元素位置
      const existing = Array.from(container.children) as HTMLElement[];
      const prevTops = existing.map((el) => el.getBoundingClientRect().top);

      // 插入到容器頂部
      container.prepend(card);

      // 既有元素位置改變後，進行轉場（被向下「擠壓」）
      const afterChildren = Array.from(container.children) as HTMLElement[];
      for (let i = 1; i < afterChildren.length; i++) {
        // 跳過剛插入的新卡片
        const el = afterChildren[i];
        const newTop = el.getBoundingClientRect().top;
        const oldTop = prevTops[i - 1];
        const delta = oldTop - newTop;
        if (Math.abs(delta) > 0.5) {
          el.style.willChange = 'transform';
          el.style.transition = 'transform .28s ease';
          el.style.transform = `translateY(${delta}px)`;
          // 下一幀回到 0，完成平滑下移
          requestAnimationFrame(() => {
            el.style.transform = 'translateY(0)';
          });
        }
      }

      // 新卡片落下動效
      requestAnimationFrame(() => {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      });
      const max = 20;
      while (container.children.length > max) {
        const last = container.lastElementChild as HTMLElement | null;
        if (last && last.parentNode) last.parentNode.removeChild(last);
        else break;
      }
    }

    function cycle() {
      if (!data.length) return;
      let rendered = 0;
      const maxBatch = 3; 
      while (rendered < maxBatch && idx < data.length) {
        const item = data[idx];
        const itemId = item.id || `${item.user}_${item.ts}_${item.amount}`;
        if (!displayedIds.has(itemId)) {
          renderOne(item);
          displayedIds.add(itemId);
          rendered++;
        }
        idx++;
      }
    }

    async function load() {
      try {
        const r = await fetch(src, { cache: 'no-store' });
        if (!r.ok) {
          // API 失败，清空数据
          data = [];
          idx = 0;
          container.innerHTML = '';
          if (typeof window !== 'undefined') {
            console.warn('[Waterfall] API not ok, status:', r.status);
          }
          return Promise.resolve();
        }
        const j = await r.json();
        // 支持新格式 { data: [...] } 和旧格式 { items: [...] }
        const rawItems = (j && j.data) || (j && j.items) || [];
        // 转换 API 数据格式
        const jsonItems = rawItems.map((item: any) => {
          // 如果已经是转换后的格式（有 ccy 字段），直接返回
          if (item.ccy) {
            return item;
          }
          // 否则转换为新格式
          return transformApiItem(item);
        });

        const isInitialLoad = data.length === 0;

        if (isInitialLoad) {
          data = jsonItems.slice(0, 100);
          container.innerHTML = '';
          displayedIds.clear();
          const initial = Math.min(20, data.length);
          if (typeof window !== 'undefined') {
            console.debug('[Waterfall] Initial load, rendering', initial, 'items');
          }
          for (let i = 0; i < initial; i++) {
            if (data[i]) {
              const itemId = data[i].id || `${data[i].user}_${data[i].ts}_${data[i].amount}`;
              renderOne(data[i]);
              displayedIds.add(itemId);
            }
          }
          idx = initial;
        } else {
          const newItems = jsonItems.slice(0, 100);
          const newData: any[] = [];
          for (const item of newItems) {
            const itemId = item.id || `${item.user}_${item.ts}_${item.amount}`;
            if (!displayedIds.has(itemId)) {
              newData.push(item);
            }
          }

          if (newData.length > 0) {
            if (typeof window !== 'undefined') {
              console.debug('[Waterfall] Found', newData.length, 'new items');
            }
            data = [...newData, ...data].slice(0, 100);
            idx = 0;
          } else {
            if (typeof window !== 'undefined') {
              console.debug('[Waterfall] No new items found');
            }
          }
        }

        return Promise.resolve();
      } catch (err) {
        if (typeof window !== 'undefined') {
          console.error('[Waterfall] load() error:', err);
        }
        return Promise.resolve();
      }
    }

    // 使用不同間隔，形成「波浪」般的周期感
    const wave = [1100, 1500, 900, 1400, 1200];
    let wi = 0;
    let tick: any = null;
    function schedule() {
      tick = setTimeout(() => {
        cycle();
        wi = (wi + 1) % wave.length;
        schedule();
      }, wave[wi]);
    }

    // 先加载数据，然后启动动画调度
    load()
      .then(() => {
        // 数据加载完成后，立即开始动画调度
        if (typeof window !== 'undefined') {
          console.debug(
            '[Waterfall] data loaded, starting animation schedule. data.length:',
            data.length,
          );
        }
        schedule();
      })
      .catch((err) => {
        if (typeof window !== 'undefined') {
          console.error('[Waterfall] load() failed:', err);
        }
        // 即使失败也启动动画调度（如果有数据的话）
        if (data.length > 0) {
          schedule();
        }
      });

    timer = setInterval(async () => {
      await load();
    }, intervalMs || 60000);
    return () => {
      timer && clearInterval(timer);
      if (tick) clearTimeout(tick);
    };
  }, [src, selector, intervalMs]);
  return null;
}
