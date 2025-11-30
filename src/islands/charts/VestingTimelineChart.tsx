import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  labels: {
    title: string;
    cliff: string;
    linear: string;
    total: string;
    months: string;
    operations: string;
    tech: string;
    marketing: string;
    investors: string;
  };
  data: Array<{
    category: string;
    cliff: number;
    linear: number;
    total: number;
  }>;
}

export default function VestingTimelineChart({ labels, data }: Props) {
  const [isDark, setIsDark] = useState(false);
  const [textColor, setTextColor] = useState('#0c1e3a');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    const updateTheme = () => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme') || 'light';
      const isDarkMode = theme === 'dark';
      setIsDark(isDarkMode);
      const computed = getComputedStyle(html);
      setTextColor(computed.getPropertyValue('--text').trim() || (isDarkMode ? '#e6edf3' : '#0c1e3a'));
      setBgColor(computed.getPropertyValue('--card-bg').trim() || (isDarkMode ? '#121a2a' : '#ffffff'));
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // 顏色方案（使用品牌色）
  const colors = {
    cliff: '#F97316',      // 鎖倉期 - 橙色
    linear: '#16A34A',     // 線性釋放期 - 綠色
  };

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: labels.cliff,
        data: data.map(d => d.cliff),
        backgroundColor: colors.cliff,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
      },
      {
        label: labels.linear,
        data: data.map(d => d.linear),
        backgroundColor: colors.linear,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    backgroundColor: bgColor,
    plugins: {
      title: {
        display: true,
        text: labels.title,
        color: textColor,
        font: {
          family: 'Sora, system-ui, sans-serif',
          size: 20,
          weight: 600,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(18, 26, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          family: 'Sora, system-ui, sans-serif',
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const categoryData = data[context.dataIndex];
            const total = categoryData.total;
            return `${context.dataset.label}: ${value} ${labels.months} | ${labels.total}: ${total} ${labels.months}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColor,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: `時間（${labels.months}）`,
          color: textColor,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 600,
          },
        },
        ticks: {
          color: textColor,
          font: {
            family: 'IBM Plex Sans, Inter, system-ui, sans-serif',
            size: 12,
          },
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
}

