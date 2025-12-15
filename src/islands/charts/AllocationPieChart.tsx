import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import FadeIn from '@/components/motion/FadeIn';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

interface Props {
  labels: {
    title: string;
    public: string;
    team: string;
    operations: string;
    tech: string;
    marketing: string;
    investors: string;
  };
  data: {
    public: number;
    team: {
      operations: number;
      tech: number;
      marketing: number;
      investors: number;
    };
  };
  isRTL?: boolean; // Added RTL support
}

export default function AllocationPieChart({ labels, data, isRTL = false }: Props) {
  const [isDark, setIsDark] = useState(false);
  const [textColor, setTextColor] = useState('#0c1e3a');
  const [bgColor, setBgColor] = useState('#ffffff');

  // 監聽主題變化
  useEffect(() => {
    const updateTheme = () => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme') || 'light';
      const isDarkMode = theme === 'dark';
      setIsDark(isDarkMode);
      // 使用 CSS 變量
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

  // 顏色方案：Moonpacket Financial Theme (High Contrast)
  const colors = {
    public: '#E32521',      // Primary Red (90% Public Share)
    operations: '#10B981',  // Emerald Green
    tech: '#3B82F6',        // Blue
    marketing: '#FFBA00',   // Gold (Brand Gold)
    investors: '#8B5CF6',   // Purple
  };

  const chartData = {
    labels: [
      labels.public,
      labels.operations,
      labels.tech,
      labels.marketing,
      labels.investors,
    ],
    datasets: [{
      data: [
        data.public,
        data.team.operations,
        data.team.tech,
        data.team.marketing,
        data.team.investors,
      ],
      backgroundColor: [
        colors.public,
        colors.operations,
        colors.tech,
        colors.marketing,
        colors.investors,
      ],
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
    }],
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
        rtl: isRTL, // RTL Support
        textDirection: isRTL ? 'rtl' : 'ltr',
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
        rtl: isRTL, // RTL Support
        textDirection: isRTL ? 'rtl' : 'ltr',
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
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
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
    <FadeIn className="chart-wrapper h-[300px] md:h-[400px] lg:h-[500px]">
      <Pie data={chartData} options={options as any} />
    </FadeIn>
  );
}

