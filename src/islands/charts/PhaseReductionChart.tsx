import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import FadeIn from '@/components/motion/FadeIn';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  labels: {
    title: string;
    xAxis: string;
    yAxis: string;
    phase: string;
    ratio: string;
    range: string;
  };
  data: Array<{
    phase: number;
    range: string;
    ratio: number;
  }>;
  isRTL?: boolean; // Added RTL support
}

export default function PhaseReductionChart({ labels, data, isRTL = false }: Props) {
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

  // 顏色方案：Growth Green Gradient
  const colors = [
    '#16A34A', // Phase 1 - Deep Green
    '#22C55E', // Phase 2 - Mid Green
    '#4ADE80', // Phase 3 - Light Green
    '#86EFAC', // Phase 4 - Pale Green
    '#A7F3D0', // Phase 5
    '#C1F5E0', // Phase 6
  ];

  const chartData = {
    labels: data.map(d => `${labels.phase} ${d.phase}`),
    datasets: [{
      label: labels.ratio,
      data: data.map(d => d.ratio),
      backgroundColor: colors.slice(0, data.length),
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
        display: false,
        rtl: isRTL,
        textDirection: isRTL ? 'rtl' : 'ltr',
      },
      tooltip: {
        rtl: isRTL,
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
            const phase = data[context.dataIndex];
            return `${labels.range}: ${phase.range} | ${labels.ratio}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        reverse: isRTL, // Reverse X axis for RTL
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
        position: isRTL ? 'right' : 'left', // Y axis on right for RTL
        title: {
          display: true,
          text: labels.yAxis,
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
    <FadeIn className="chart-wrapper h-[300px] md:h-[400px] lg:h-[500px]">
      <Bar data={chartData} options={options as any} />
    </FadeIn>
  );
}

