import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Timer } from '../types/timer';
import { getItem, setItem } from '../utils/storage';

const TIMERS_KEY = 'timers_list';
const CATEGORIES_KEY = 'timer_categories';
const DEFAULT_CATEGORIES = ["Workout", "Study", "Break"];

interface TimerContextType {
  timers: Timer[];
  setTimers: React.Dispatch<React.SetStateAction<Timer[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  addTimer: (timer: Timer) => Promise<void>;
  updateTimer: (timer: Timer) => Promise<void>;
  deleteTimer: (id: string) => Promise<void>;
  addCategory: (cat: string) => Promise<void>;
  deleteCategory: (cat: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimerContext = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider');
  return ctx;
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  // Remove activeTimers and notifIds

  // Load timers and categories from AsyncStorage
  const refresh = async () => {
    const storedTimers = await getItem<Timer[]>(TIMERS_KEY);
    if (storedTimers) setTimers(storedTimers);
    const storedCats = await getItem<string[]>(CATEGORIES_KEY);
    let cats = storedCats ? storedCats : [];
    cats = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
    setCategories(cats);
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    setItem(TIMERS_KEY, timers);
  }, [timers]);

  const addTimer = async (timer: Timer) => {
    setTimers((prev) => [...prev, timer]);
  };

  const updateTimer = async (timer: Timer) => {
    setTimers((prev) => prev.map((t) => (t.id === timer.id ? timer : t)));
  };

  const deleteTimer = async (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = async (cat: string) => {
    setCategories((prev) => Array.from(new Set([...prev, cat])));
    await setItem(CATEGORIES_KEY, Array.from(new Set([...categories, cat])));
  };

  const deleteCategory = async (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    await setItem(CATEGORIES_KEY, categories.filter((c) => c !== cat));
  };

  return (
    <TimerContext.Provider value={{ timers, setTimers, categories, setCategories, addTimer, updateTimer, deleteTimer, addCategory, deleteCategory, refresh }}>
      {children}
    </TimerContext.Provider>
  );
}; 