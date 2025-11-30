import { useEffect, useState } from 'react';

interface Props {
  launchDate: string;
  labels: {
    title: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function CountdownTimer({ launchDate, labels }: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!launchDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const launch = new Date(launchDate).getTime();
      const diff = launch - now;

      if (diff <= 0) {
        // 已到發幣時間，隱藏倒計時（由父組件處理）
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    // 立即更新一次
    updateCountdown();

    // 每秒更新一次
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  return (
    <div className="countdown-content">
      <h3 className="countdown-title">{labels.title}</h3>
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">{labels.days}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">{labels.hours}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">{labels.minutes}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">{labels.seconds}</span>
        </div>
      </div>
    </div>
  );
}

