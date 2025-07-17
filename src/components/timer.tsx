import { useState, useEffect, useRef } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (endTime: number): TimeLeft => {
  const now = Date.now();
  const distance = endTime - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const areEqual = (a: TimeLeft, b: TimeLeft): boolean => {
  return (
    a.days === b.days &&
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    a.seconds === b.seconds
  );
};

export const Timer = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTime = useRef(new Date(date).getTime());

  useEffect(() => {
    const update = () => {
      const next = calculateTimeLeft(endTime.current);
      setTimeLeft((prev) => (areEqual(prev, next) ? prev : next));
    };

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <>
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h `}
      {minutes > 0 && `${minutes}m `}
      {seconds >= 0 && `${seconds}s`}
    </>
  );
};
