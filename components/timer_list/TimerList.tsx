import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useThemeContext } from "../../context/ThemeContext";
import { useTimerContext } from "../../context/TimerContext";
import { useTimerControlContext } from "../../context/TimerControlContext";
import { Timer } from "../../types/timer";
import { groupByCategory } from "../../utils/group";
import EmptyState from "../shared/EmptyState";
import CategorySection from "./CategorySection";
import HeaderBar from "./HeaderBar";

export default function TimerList() {
  const router = useRouter();
  const { timers, categories } = useTimerContext();
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    deleteTimerWithControl,
    startAllTimersInCategory,
    pauseAllInCategory,
    resetAllInCategory,
  } = useTimerControlContext();
  const { theme, themeObj, toggleTheme } = useThemeContext();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const grouped = groupByCategory(timers);
  const visibleCategories = Object.keys(grouped);

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleEdit = (timer: Timer) => {
    router.push({
      pathname: "/edit-timer",
      params: { timer: JSON.stringify(timer) },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <HeaderBar
        theme={theme}
        themeObj={themeObj}
        onToggleTheme={toggleTheme}
        onCategories={() => router.push("/categories")}
        onHistory={() => router.push("/history")}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: themeObj.buttonBg }]}
        onPress={() => router.push("/add-timer")}
      >
        <Ionicons name="add-circle" size={28} color={themeObj.buttonText} />
        <Text style={[styles.addButtonText, { color: themeObj.buttonText }]}>
          Add Timer
        </Text>
      </TouchableOpacity>
      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          message="No timers yet. Add one!"
          textColor={themeObj.gray}
        />
      ) : (
        <FlatList
          data={visibleCategories}
          keyExtractor={(cat) => cat}
          renderItem={({ item: cat }) => (
            <CategorySection
              category={cat}
              timers={grouped[cat]}
              expanded={!!expanded[cat]}
              onToggleExpand={toggleExpand}
              onStartAll={() => startAllTimersInCategory(cat)}
              onPauseAll={() => pauseAllInCategory(cat)}
              onResetAll={() => resetAllInCategory(cat)}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onEdit={handleEdit}
              onDelete={deleteTimerWithControl}
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
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
  },
});
