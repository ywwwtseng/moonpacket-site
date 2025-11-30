// 全局 Mermaid 初始化 - 客户端组件
import { useEffect } from 'react';
import mermaid from 'mermaid';

let isInitialized = false;

function initAndRender() {
  if (isInitialized && typeof window.mermaid !== 'undefined') {
    renderAll();
    return;
  }

  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#0c1e3a';
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#E32521';
  const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#FFBA00';
  const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#ffffff';
  const cardRing = getComputedStyle(document.documentElement).getPropertyValue('--card-ring').trim() || 'rgba(0,0,0,.06)';
  const numColor = theme === 'dark' ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)';

  mermaid.initialize({
    startOnLoad: false,
    theme,
      themeVariables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      primaryColor,
      primaryTextColor: '#ffffff',
      primaryBorderColor: primaryColor,
      secondaryColor: goldColor,
      secondaryTextColor: '#0c1e3a',
      tertiaryColor: numColor,
      tertiaryTextColor: '#ffffff',
      lineColor: primaryColor,
      border1: primaryColor,
      border2: goldColor,
      nodeBkg: cardBg,
      mainBkg: cardBg,
      textColor,
      edgeLabelBackground: cardBg,
      clusterBkg: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      clusterBorder: cardRing,
      defaultLinkColor: primaryColor,
      nodeBorder: primaryColor,
      noteBkgColor: theme === 'dark' ? 'rgba(255,186,0,0.15)' : 'rgba(255,186,0,0.1)',
      noteTextColor: textColor,
      noteBorderColor: goldColor,
      cScale0: primaryColor,
      cScale1: goldColor,
      cScale2: numColor,
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
      padding: 30,
      nodeSpacing: 80,
      rankSpacing: 100,
    },
  });

  (window as any).mermaid = mermaid;
  isInitialized = true;
  renderAll();
}

function renderAll() {
  const elements = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-content]');
  
  if (elements.length === 0) {
    console.warn('[MermaidInit] 未找到任何 Mermaid 图表元素');
    return;
  }

  console.log(`[MermaidInit] 找到 ${elements.length} 个图表元素，开始渲染...`);

  elements.forEach((el) => {
    // 跳过已渲染的元素
    if (el.querySelector('svg')) {
      console.log(`[MermaidInit] 图表已渲染，跳过:`, el.id);
      return;
    }

    // 从 data-mermaid-content 属性读取内容
    let content = el.getAttribute('data-mermaid-content')?.trim();
    
    // 如果没有 data 属性，尝试从 textContent 读取（作为后备）
    if (!content) {
      content = el.textContent?.trim() || '';
    }
    
    if (!content) {
      console.warn(`[MermaidInit] 图表元素没有内容:`, el.id);
      return;
    }

    // 验证内容格式 (更加寬鬆，支援 sequenceDiagram, gantt 等)
    // if (!content.startsWith('graph ') && !content.startsWith('flowchart ')) {
    //   console.warn(`[MermaidInit] 注意: 图表内容不是以 standard graph/flowchart 开头:`, content.substring(0, 20));
    // }

    console.log(`[MermaidInit] 正在渲染图表:`, el.id);
    console.log(`[MermaidInit] 内容预览:`, content.substring(0, 100));

    // 设置内容到元素（Mermaid 会读取 textContent）
    el.textContent = content;

    // 确保元素可见且有尺寸
    if (el.offsetWidth === 0 || el.offsetHeight === 0) {
      console.warn(`[MermaidInit] 图表元素没有尺寸，等待后重试:`, el.id);
      setTimeout(() => {
        if (!el.querySelector('svg')) {
          renderSingle(el);
        }
      }, 500);
      return;
    }

    renderSingle(el);
  });
}

function renderSingle(el: HTMLElement) {
  try {
    mermaid.run({
      nodes: [el],
    }).then(() => {
      console.log(`[MermaidInit] ✅ 图表渲染成功:`, el.id);
      // 确保 SVG 正确显示
      const svg = el.querySelector('svg');
      if (svg) {
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
      }
    }).catch((err) => {
      console.error(`[MermaidInit] ❌ 图表渲染错误:`, el.id, err?.message || err);
      console.error(`[MermaidInit] 错误详情:`, err);
      // 显示错误提示
      el.innerHTML = `<div style="color: red; padding: 1rem; background: rgba(255,0,0,0.1); border-radius: 0.5rem; font-family: monospace; font-size: 12px;">
        <strong>图表渲染错误</strong><br/>
        错误: ${err?.message || String(err)}<br/>
        <small>图表 ID: ${el.id}</small>
      </div>`;
    });
  } catch (err) {
    console.error(`[MermaidInit] ❌ 图表渲染异常:`, el.id, err);
  }
}

export default function MermaidInit() {
  useEffect(() => {
    // 多次尝试初始化，确保图表能及时渲染
    const init = () => {
      // 先尝试一次
      initAndRender();
      
      // 如果没找到元素，延迟再试
      setTimeout(() => {
        const elements = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-content]');
        if (elements.length > 0) {
          initAndRender();
        }
      }, 300);
      
      // 再次延迟尝试（用于动态加载的内容）
      setTimeout(() => {
        initAndRender();
      }, 1000);
    };

    // 立即尝试初始化
    init();

    // 在 DOMContentLoaded 时也尝试
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    }

    // 在 load 事件时也尝试
    window.addEventListener('load', init, { once: true });

    // 监听主题切换
    let themeObserver: MutationObserver | null = null;
    const initThemeObserver = () => {
      themeObserver = new MutationObserver(() => {
        if (!isInitialized) return;
        isInitialized = false;
        const elements = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-content]');
        elements.forEach((el) => {
          if (el.querySelector('svg')) {
            el.innerHTML = '';
          }
        });
        setTimeout(() => {
          initAndRender();
        }, 200);
      });

      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    };

    // 等待 DOM 完全加载后再初始化主题监听
    if (document.readyState === 'complete') {
      initThemeObserver();
    } else {
      window.addEventListener('load', initThemeObserver, { once: true });
    }

    return () => {
      if (themeObserver) {
        themeObserver.disconnect();
      }
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}
