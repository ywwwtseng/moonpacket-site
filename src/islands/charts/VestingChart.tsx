import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import FadeIn from '@/components/motion/FadeIn';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  labels: {
    months: string;
    team: string;
    investors: string;
    public: string;
  };
  isRTL?: boolean;
}

export default function VestingChart({ labels, isRTL = false }: Props) {
  const [isDark, setIsDark] = useState(false);
  const [textColor, setTextColor] = useState('#0c1e3a');

  useEffect(() => {
    const updateTheme = () => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme') || 'light';
      const isDarkMode = theme === 'dark';
      setIsDark(isDarkMode);
      const computed = getComputedStyle(html);
      setTextColor(computed.getPropertyValue('--text').trim() || (isDarkMode ? '#e6edf3' : '#0c1e3a'));
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // 模擬 48 個月的釋放數據
  const months = Array.from({ length: 49 }, (_, i) => i); // 0 to 48
  
  // Public: 90% (模擬減半釋放，曲線變緩)
  const publicData = months.map(m => {
    return 90 * (1 - Math.pow(0.95, m)); // 模擬對數增長
  });

  // Team: 10% (3個月鎖倉，然後線性)
  const teamData = months.map(m => {
    if (m <= 3) return 0;
    const progress = Math.min((m - 3) / 45, 1);
    return 6 * progress; // 6% for team
  });

  // Investors: 4% (3個月鎖倉，然後線性)
  const investorData = months.map(m => {
    if (m <= 3) return 0;
    const progress = Math.min((m - 3) / 33, 1);
    return 4 * progress; // 4% for investors
  });

  const chartData = {
    labels: months.map(m => `M${m}`),
    datasets: [
      {
        label: labels.team,
        data: teamData,
        borderColor: '#E32521', // Primary Red
        backgroundColor: 'rgba(227, 37, 33, 0.5)',
        fill: true,
        tension: 0.4,
      },
      {
        label: labels.investors,
        data: investorData,
        borderColor: '#FFBA00', // Gold
        backgroundColor: 'rgba(255, 186, 0, 0.5)',
        fill: true,
        tension: 0.4,
      },
      // 我們主要展示團隊和投資人的釋放壓力，Public 可以作為背景或不顯示以免混淆
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, maxTicksLimit: 12 },
        title: { display: true, text: labels.months, color: textColor }
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: textColor, callback: (v: any) => v + '%' },
        stacked: true, // 堆疊顯示總量
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor, usePointStyle: true }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        rtl: isRTL,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%`
        }
      }
    }
  };

  return (
    <FadeIn className="h-[300px] w-full">
      <Line data={chartData} options={options as any} />
    </FadeIn>
  );
}

