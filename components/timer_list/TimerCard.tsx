import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProgressBar from "../../components/shared/ProgressBar";
import { Timer } from "../../types/timer";
import { formatTime } from "../../utils/format";
import Card from "../shared/Card";
import TimerControls from "./TimerControls";

interface TimerCardProps {
  timer: Timer;
  themeObj: any;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (timer: Timer) => void;
  onDelete: (id: string) => void;
}

function getStatus(timer: Timer) {
  if (timer.status === "Completed") return "Completed";
  if (timer.status === "Running") return "Running";
  if (timer.status === "Paused") return "Paused";
  return "Paused";
}

export default function TimerCard({
  timer,
  themeObj,
  onStart,
  onPause,
  onReset,
  onEdit,
  onDelete,
}: TimerCardProps) {
  const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;
  return (
    <Card style={{ ...styles.timerCard, backgroundColor: themeObj.card }}>
      <View
        style={[styles.timerHeader, { borderBottomColor: themeObj.accent }]}
      >
        <Text style={[styles.timerName, { color: themeObj.text }]}>
          {timer.name}
        </Text>
        {timer.halfwayAlert && (
          <Ionicons
            name="notifications"
            size={18}
            color={themeObj.accent}
            style={{ marginRight: 4 }}
          />
        )}
        <Text style={[styles.timerStatus, { color: themeObj.gray }]}>
          {getStatus(timer)}
        </Text>
      </View>
      <Text style={[styles.timerTime, { color: themeObj.text }]}>
        {formatTime(timer.remaining)}
      </Text>
      <ProgressBar progress={progress} themeObj={themeObj} />
      <TimerControls
        timer={timer}
        themeObj={themeObj}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  timerCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#a5b4fc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  timerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#e0e7ff",
  },
  timerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timerStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timerTime: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
    alignSelf: "center",
  },
  timerControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  controlButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "#22c55e",
  },
  pauseButton: {
    backgroundColor: "#ef4444",
  },
  resetButton: {
    backgroundColor: "#6366f1",
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#e0e7ff",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#ffe4e6",
  },
});
