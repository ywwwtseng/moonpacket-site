// 全局 Mermaid 初始化脚本 - 简化版本
// 统一处理所有 Mermaid 图表的渲染

import mermaid from 'mermaid';

// 全局初始化标志
let isInitialized = false;

function initAndRender() {
  if (isInitialized && typeof window.mermaid !== 'undefined') {
    // 已经初始化，只渲染新元素
    renderAll();
    return;
  }

  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#0c1e3a';
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#E32521';
  const goldColor = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#FFBA00';
  const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#ffffff';
  const cardRing = getComputedStyle(document.documentElement).getPropertyValue('--card-ring').trim() || 'rgba(0,0,0,.06)';
  const numColor = theme === 'dark' ? '#22c55e' : '#16a34a';

  mermaid.initialize({
    startOnLoad: false,
    theme,
    themeVariables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
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
      padding: 20,
      nodeSpacing: 60,
      rankSpacing: 100,
    },
  });

  window.mermaid = mermaid;
  isInitialized = true;
  renderAll();
}

function renderAll() {
  const elements = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-content]');
  elements.forEach((el) => {
    // 跳过已渲染的元素
    if (el.querySelector('svg')) {
      return;
    }

    const content = el.getAttribute('data-mermaid-content')?.trim();
    if (!content) {
      return;
    }

    // 设置内容
    el.textContent = content;

    // 渲染
    try {
      mermaid.run({
        nodes: [el],
      }).catch((err) => {
        console.error('Mermaid render error for', el.id, ':', err);
      });
    } catch (err) {
      console.error('Mermaid run exception for', el.id, ':', err);
    }
  });
}

// 页面加载完成后初始化
function start() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initAndRender, 100);
    });
  } else {
    setTimeout(initAndRender, 100);
  }
}

start();

// 监听主题切换
let themeObserver: MutationObserver | null = null;
if (typeof window !== 'undefined') {
  themeObserver = new MutationObserver(() => {
    // 主题切换时重新初始化并重新渲染
    isInitialized = false;
    const elements = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-content]');
    elements.forEach((el) => {
      if (el.querySelector('svg')) {
        el.innerHTML = '';
      }
    });
    setTimeout(initAndRender, 200);
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

