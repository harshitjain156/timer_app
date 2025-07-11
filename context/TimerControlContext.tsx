import { currentFormattedDate } from "@/utils/format";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  cancelNotification,
  scheduleNotification,
} from "../notification/notificationService";
import { useHistoryContext } from "./HistoryContext";
import { useTimerContext } from "./TimerContext";

interface TimerControlContextType {
  startTimer: (id: string) => Promise<void>;
  pauseTimer: (id: string) => Promise<void>;
  resetTimer: (id: string) => Promise<void>;
  deleteTimerWithControl: (id: string) => Promise<void>;
  startAllInCategory: (cat: string) => void;
  pauseAllInCategory: (cat: string) => void;
  resetAllInCategory: (cat: string) => void;
  startAllTimersInCategory: (cat: string) => Promise<void>;
}

const TimerControlContext = createContext<TimerControlContextType | undefined>(
  undefined
);

export const useTimerControlContext = () => {
  const ctx = useContext(TimerControlContext);
  if (!ctx)
    throw new Error(
      "useTimerControlContext must be used within TimerControlProvider"
    );
  return ctx;
};

export const TimerControlProvider = ({ children }: { children: ReactNode }) => {
  const { timers, setTimers } = useTimerContext();
  const { addToHistory } = useHistoryContext();
  const [activeTimers, setActiveTimers] = useState<
    Record<string, NodeJS.Timeout>
  >({});
  const [notifIds, setNotifIds] = useState<
    Record<string, { halfway?: string; complete?: string }>
  >({});

  const startTimer = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Running" } : t))
    );
    if (!activeTimers[id]) {
      const timer = timers.find((t) => t.id === id);
      if (!timer) return;
      if (notifIds[id]?.halfway)
        await cancelNotification(notifIds[id].halfway!);
      if (notifIds[id]?.complete)
        await cancelNotification(notifIds[id].complete!);
      let halfwayId: string | undefined;
      if (timer.halfwayAlert && timer.remaining > 1) {
        const halfway = Math.floor(timer.remaining / 2);
        halfwayId = await scheduleNotification(
          halfway,
          "Halfway Alert",
          `Timer "${timer.name}" is halfway done!`
        );
      }
      const completeId = await scheduleNotification(
        timer.remaining,
        "Timer Complete",
        `Timer "${timer.name}" is complete!`
      );
      setNotifIds((prev) => ({
        ...prev,
        [id]: { halfway: halfwayId, complete: completeId },
      }));
      const intervalId = setInterval(() => {
        setTimers((prev) =>
          prev.map((t) => {
            if (t.id === id && t.status === "Running") {
              if (
                t.halfwayAlert &&
                t.remaining === Math.floor(t.duration / 2)
              ) {
                // Optionally: show in-app alert
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
                if (notifIds[id]?.halfway)
                  cancelNotification(notifIds[id].halfway!);
                if (notifIds[id]?.complete)
                  cancelNotification(notifIds[id].complete!);
                setNotifIds((prev) => {
                  const copy = { ...prev };
                  delete copy[id];
                  return copy;
                });
                const currentDate = currentFormattedDate();
                addToHistory({ name: t.name, completedAt: currentDate });
                return { ...t, remaining: 0, status: "Completed" };
              }
            }
            return t;
          })
        );
      }, 1000);
      setActiveTimers((prev) => ({ ...prev, [id]: intervalId }));
    }
  };

  const startAllTimersInCategory = async (category: string) => {
    // 1. Set all timers in the category to 'Running'
    setTimers((prev) =>
      prev.map((t) =>
        t.category === category ? { ...t, status: "Running" } : t
      )
    );

    // 2. Cancel and reschedule notifications for all timers in the category
    const timersToStart = timers.filter((t) => t.category === category);
    for (const timer of timersToStart) {
      if (notifIds[timer.id]?.halfway)
        await cancelNotification(notifIds[timer.id].halfway!);
      if (notifIds[timer.id]?.complete)
        await cancelNotification(notifIds[timer.id].complete!);

      let halfwayId: string | undefined;
      if (timer.halfwayAlert && timer.remaining > 1) {
        const halfway = Math.floor(timer.remaining / 2);
        halfwayId = await scheduleNotification(
          halfway,
          "Halfway Alert",
          `Timer "${timer.name}" is halfway done!`
        );
      }
      const completeId = await scheduleNotification(
        timer.remaining,
        "Timer Complete",
        `Timer "${timer.name}" is complete!`
      );
      setNotifIds((prev) => ({
        ...prev,
        [timer.id]: { halfway: halfwayId, complete: completeId },
      }));
    }

    // 3. Start a single global interval if not already running
    if (!activeTimers["__global__"]) {
      const globalIntervalId = setInterval(() => {
        setTimers((prev) =>
          prev.map((t) => {
            if (t.status === "Running" && t.remaining > 0) {
              // Check for halfway alert (optional in-app alert)
              if (
                t.halfwayAlert &&
                t.remaining === Math.floor(t.duration / 2)
              ) {
                // Optionally: show in-app alert
              }
              if (t.remaining > 1) {
                return { ...t, remaining: t.remaining - 1 };
              } else {
                // Timer completed
                // Cancel notifications for this timer
                if (notifIds[t.id]?.halfway)
                  cancelNotification(notifIds[t.id].halfway!);
                if (notifIds[t.id]?.complete)
                  cancelNotification(notifIds[t.id].complete!);
                setNotifIds((prev) => {
                  const copy = { ...prev };
                  delete copy[t.id];
                  return copy;
                });
                const date = currentFormattedDate();
                addToHistory({ name: t.name, completedAt: date });
                return { ...t, remaining: 0, status: "Completed" };
              }
            }
            return t;
          })
        );

        // After updating, check if any timers are still running
        setTimers((currentTimers) => {
          const anyRunning = currentTimers.some(
            (t) => t.status === "Running" && t.remaining > 0
          );
          if (!anyRunning) {
            clearInterval(activeTimers["__global__"]);
            setActiveTimers((prev) => {
              const copy = { ...prev };
              delete copy["__global__"];
              return copy;
            });
          }
          return currentTimers;
        });
      }, 1000);

      setActiveTimers((prev) => ({
        ...prev,
        ["__global__"]: globalIntervalId,
      }));
    }
  };
  const pauseTimer = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Paused" } : t))
    );
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete)
      await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  const resetTimer = async (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, remaining: t.duration, status: "Paused" } : t
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
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete)
      await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  const deleteTimerWithControl = async (id: string) => {
    if (activeTimers[id]) {
      clearInterval(activeTimers[id]);
      setActiveTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
    if (notifIds[id]?.halfway) await cancelNotification(notifIds[id].halfway!);
    if (notifIds[id]?.complete)
      await cancelNotification(notifIds[id].complete!);
    setNotifIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };
  // Bulk actions
  const startAllInCategory = (cat: string) => {
    timers
      .filter((t) => t.category === cat)
      .forEach((timer) => {
        if (timer.status !== "Running" && timer.status !== "Completed") {
          startTimer(timer.id);
        }
      });
  };
  const pauseAllInCategory = (cat: string) => {
    timers
      .filter((t) => t.category === cat)
      .forEach((timer) => {
        if (timer.status === "Running") {
          pauseTimer(timer.id);
        }
      });
  };
  const resetAllInCategory = (cat: string) => {
    timers
      .filter((t) => t.category === cat)
      .forEach((timer) => {
        resetTimer(timer.id);
      });
  };

  return (
    <TimerControlContext.Provider
      value={{
        startTimer,
        pauseTimer,
        resetTimer,
        deleteTimerWithControl,
        startAllInCategory,
        pauseAllInCategory,
        resetAllInCategory,
        startAllTimersInCategory,
      }}
    >
      {children}
    </TimerControlContext.Provider>
  );
};
