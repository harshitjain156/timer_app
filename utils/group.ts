import { Timer } from '../context/TimerContext';

export function groupByCategory(timers: Timer[]): Record<string, Timer[]> {
  return timers.reduce((acc: Record<string, Timer[]>, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});
} 