export type Timer = {
  id: string;
  name: string;
  duration: number;
  category: string;
  remaining: number;
  status: 'Running' | 'Paused' | 'Completed';
  halfwayAlert?: boolean;
}; 