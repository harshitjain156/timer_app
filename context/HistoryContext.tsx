import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { HistoryEntry } from "../types/history";
import { getItem, removeItem, setItem } from "../utils/storage";

const TIMER_HISTORY_KEY = "timer_history";

interface HistoryContextType {
  history: HistoryEntry[];
  addToHistory: (entry: HistoryEntry) => Promise<void>;
  clearHistory: () => Promise<void>;
  exportHistory: () => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistoryContext = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx)
    throw new Error("useHistoryContext must be used within HistoryProvider");
  return ctx;
};
const [loading, setLoading] = useState(false);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = async () => {
    const stored = await getItem<HistoryEntry[]>(TIMER_HISTORY_KEY);
    if (stored) setHistory(stored);
  };

  useEffect(() => {
    refresh();
  }, []);

  const addToHistory = async (entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev]);
    const arr = (await getItem<HistoryEntry[]>(TIMER_HISTORY_KEY)) || [];
    arr.unshift(entry);
    await setItem(TIMER_HISTORY_KEY, arr);
  };

  const clearHistory = async () => {
    setHistory([]);
    await removeItem(TIMER_HISTORY_KEY);
  };

  const exportHistory = async () => {
    try {
      if (history.length == 0)
        return Alert.alert("No Data", "Could not export timer history.");
      // setLoading(true)
      const fileUri = FileSystem.cacheDirectory + "timer_history.json";
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(history, null, 2)
      );
      await Sharing.shareAsync(fileUri, { mimeType: "application/json" });
      // setLoading(false)
    } catch (e) {
      setLoading(false);
      Alert.alert("Export Failed", "Could not export timer history.");
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        exportHistory,
        refresh,
        loading,
        setLoading,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
