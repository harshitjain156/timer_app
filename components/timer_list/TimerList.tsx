import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Appearance, FlatList, Platform, Alert as RNAlert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CategorySection from './CategorySection';
import HeaderBar from './HeaderBar';

type Timer = {
  id: string;
  name: string;
  duration: number;
  category: string;
  remaining: number;
  status: 'Running' | 'Paused' | 'Completed';
  halfwayAlert?: boolean; // New field for halfway alert
};

const TIMERS_KEY = 'timers_list';
const CATEGORIES_KEY = 'timer_categories';
const DEFAULT_CATEGORIES = ["Workout", "Study", "Break"];
const TIMER_HISTORY_KEY = 'timer_history';

const lightTheme = {
  background: '#f8faff',
  card: '#fff',
  text: '#22223b',
  accent: '#6366f1',
  green: '#22c55e',
  red: '#ef4444',
  gray: '#888',
  blue: '#007AFF',
  progressBg: '#e0e7ff',
  progressFill: '#22c55e',
  buttonBg: '#e0e7ff',
  buttonText: '#6366f1',
};
const darkTheme = {
  background: '#181926',
  card: '#232946',
  text: '#f4f4f4',
  accent: '#a5b4fc',
  green: '#4ade80',
  red: '#f87171',
  gray: '#a1a1aa',
  blue: '#60a5fa',
  progressBg: '#232946',
  progressFill: '#4ade80',
  buttonBg: '#232946',
  buttonText: '#a5b4fc',
};

function formatTime(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

function getStatus(timer: Timer) {
  if (timer.status === 'Completed') return 'Completed';
  if (timer.status === 'Running') return 'Running';
  if (timer.status === 'Paused') return 'Paused';
  return 'Paused';
}

// Helper to schedule a notification
async function scheduleNotification(seconds: number, title: string, body: string) {
  return await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, channelId: 'timer-alerts' },
  });
}
// Helper to cancel notifications
async function cancelNotification(id: string) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}

export default function TimerList() {
  const router = useRouter();
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeTimers, setActiveTimers] = useState<Record<string, NodeJS.Timeout>>({}); // id: intervalId
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
  const themeObj = theme === 'dark' ? darkTheme : lightTheme;

  // Load timers and categories from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const storedTimers = await AsyncStorage.getItem(TIMERS_KEY);
      console.log('Loaded timers on mount:', storedTimers);
      if (storedTimers) setTimers(JSON.parse(storedTimers));
      const storedCats = await AsyncStorage.getItem(CATEGORIES_KEY);
      console.log('Loaded categories on mount:', storedCats);
      let cats = storedCats ? JSON.parse(storedCats) : [];
      cats = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
      setCategories(cats);
    })();
  }, []);

  // Load timers and categories from AsyncStorage on focus
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const storedTimers = await AsyncStorage.getItem(TIMERS_KEY);
        if (storedTimers) setTimers(JSON.parse(storedTimers));
        const storedCats = await AsyncStorage.getItem(CATEGORIES_KEY);
        let cats = storedCats ? JSON.parse(storedCats) : [];
        cats = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
        setCategories(cats);
      })();
    }, [])
  );

  // Save timers to AsyncStorage whenever timers change
  useEffect(() => {
    if(timers.length>0)
        AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  }, [timers]);

  // Only show categories that have at least one timer
  const visibleCategories = categories.filter(cat => timers.some(timer => timer.category === cat));

  // Group timers by category
  const grouped: Record<string, Timer[]> = visibleCategories.reduce((acc: Record<string, Timer[]>, cat: string) => {
    acc[cat] = timers.filter((timer) => timer.category === cat);
    return acc;
  }, {});

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const addToHistory = async (timer: Timer) => {
    const entry = {
      name: timer.name,
      completedAt: Date.now(),
    };
    try {
      const stored = await AsyncStorage.getItem(TIMER_HISTORY_KEY);
      const history = stored ? JSON.parse(stored) : [];
      history.unshift(entry);
      await AsyncStorage.setItem(TIMER_HISTORY_KEY, JSON.stringify(history));
    } catch {}
  };

  // Notification setup (channel for Android)
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    Notifications.getPermissionsAsync().then((status) => {
      if (!status.granted) Notifications.requestPermissionsAsync();
    });
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('timer-alerts', {
        name: 'Timer Alerts',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  // Track scheduled notification IDs for each timer
  const [notifIds, setNotifIds] = useState<Record<string, { halfway?: string; complete?: string }>>({});

  const handleStart = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'Running' }
          : t.status === 'Running'
          ? { ...t, status: 'Paused' }
          : t
      )
    );
    if (!activeTimers[id]) {
      const timer = timers.find((t) => t.id === id);
      if (!timer) return;
      // Cancel any previous notifications
      if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
      if (notifIds[id]?.complete) await cancelNotification(notifIds[id].complete!);
      // Schedule halfway alert if enabled
      let halfwayId: string | undefined;
      if (timer.halfwayAlert && timer.remaining > 1) {
        const halfway = Math.floor(timer.remaining / 2);
        halfwayId = await scheduleNotification(
          halfway,
          'Halfway Alert',
          `Timer "${timer.name}" is halfway done!`
        );
      }
      // Schedule completion alert
      const completeId = await scheduleNotification(
        timer.remaining,
        'Timer Complete',
        `Timer "${timer.name}" is complete!`
      );
      setNotifIds((prev) => ({ ...prev, [id]: { halfway: halfwayId, complete: completeId } }));
      const intervalId = setInterval(() => {
        setTimers((prev) =>
          prev.map((t) => {
            if (t.id === id && t.status === 'Running') {
              // Show halfway alert in foreground
              if (t.halfwayAlert && t.remaining === Math.floor(t.duration / 2)) {
                RNAlert.alert('Halfway Alert', `Timer "${t.name}" is halfway done!`);
              }
              if (t.remaining > 1) {
                return { ...t, remaining: t.remaining - 1 };
              } else {
                clearInterval(activeTimers[id]);
                setActiveTimers((a) => {
                  const copy = { ...a };
                  delete copy[id];
                  return copy;
                });
                addToHistory({ ...t, remaining: 0, status: 'Completed' });
                // Cancel scheduled notifications after completion
                if (notifIds[id]?.halfway) cancelNotification(notifIds[id].halfway!);
                if (notifIds[id]?.complete) cancelNotification(notifIds[id].complete!);
                setNotifIds((prev) => {
                  const copy = { ...prev };
                  delete copy[id];
                  return copy;
                });
                return { ...t, remaining: 0, status: 'Completed' };
              }
            }
            return t;
          })
        );
      }, 1000);
      setActiveTimers((prev) => ({ ...prev, [id]: intervalId }));
    }
  };

  const handlePause = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Paused' } : t))
    );
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    // Cancel scheduled notifications
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete) await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleReset = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remaining: t.duration, status: 'Paused' }
          : t
      )
    );
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    // Cancel scheduled notifications
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete) await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleDelete = async (id: string) => {
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    // Cancel scheduled notifications
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete) await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (timer: Timer) => {
    router.push({ pathname: '/edit-timer', params: { timer: JSON.stringify(timer) } });
  };

  // Bulk actions for a category
  const handleStartAll = (cat: string) => {
    grouped[cat].forEach((timer) => {
        console.log(timer.id,timer.name,timer.status,"======")
      if (timer.status !== 'Running' && timer.status !== 'Completed') {
        handleStart(timer.id);
      }
    });
  };
  const handlePauseAll = (cat: string) => {
    grouped[cat].forEach((timer) => {
      if (timer.status === 'Running') {
        handlePause(timer.id);
      }
    });
  };
  const handleResetAll = (cat: string) => {
    grouped[cat].forEach((timer) => {
      handleReset(timer.id);
    });
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Progress bar component
  const ProgressBar = ({ progress }: { progress: number }) => (
    <View style={[styles.progressBarBg, { backgroundColor: themeObj.progressBg }]}>
      <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }, { backgroundColor: themeObj.progressFill }]} />
      <Text style={[styles.progressPercent, { color: themeObj.text }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <HeaderBar
        theme={theme}
        themeObj={themeObj}
        onToggleTheme={toggleTheme}
        onCategories={() => router.push('/categories')}
        onHistory={() => router.push('/history')}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: themeObj.buttonBg }]} onPress={() => router.push('/add-timer')}>
        <Ionicons name="add-circle" size={28} color={themeObj.green} />
        <Text style={[styles.addButtonText, { color: themeObj.green }]}>Add Timer</Text>
      </TouchableOpacity>
      {Object.keys(grouped).length === 0 ? (
        <Text style={[styles.emptyText, { color: themeObj.gray }]}>No timers yet. Add one!</Text>
      ) : (
        <FlatList
          data={Object.keys(grouped)}
          keyExtractor={(cat) => cat}
          renderItem={({ item: cat }) => (
            <CategorySection
              category={cat}
              timers={grouped[cat]}
              expanded={!!expanded[cat]}
              onToggleExpand={toggleExpand}
              onStartAll={() => handleStartAll(cat)}
              onPauseAll={() => handlePauseAll(cat)}
              onResetAll={() => handleResetAll(cat)}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onEdit={handleEdit}
              onDelete={handleDelete}
              themeObj={themeObj}
              theme={theme}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 40,
  },
  categorySection: {
    marginBottom: 18,
    borderRadius: 12,
    shadowColor: '#a5b4fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e7ff',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timersList: {
    padding: 10,
  },
  timerCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#a5b4fc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#e0e7ff',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerTime: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'center',
  },
  progressBarBg: {
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: 24,
    borderRadius: 6,
    zIndex: 0,
  },
  progressPercent: {
    zIndex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  controlButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#6366f1',
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#ffe4e6',
  },
  bulkActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginTop: 4,
    gap: 8,
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  bulkButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeSwitcher: {
    marginRight: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  historyNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  historyNavText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  headerIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  headerIconText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});
