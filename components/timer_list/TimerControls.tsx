import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Timer } from "../../types/timer";

interface TimerControlsProps {
  timer: Timer;
  themeObj: any;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (timer: Timer) => void;
  onDelete: (id: string) => void;
}

export default function TimerControls({
  timer,
  themeObj,
  onStart,
  onPause,
  onReset,
  onEdit,
  onDelete,
}: TimerControlsProps) {
  return (
    <View style={styles.timerControls}>
      {timer.status !== "Running" && timer.status !== "Completed" && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.startButton,
            { backgroundColor: themeObj.green },
          ]}
          onPress={() => onStart(timer.id)}
        >
          <Ionicons name="play" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {timer.status === "Running" && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.pauseButton,
            { backgroundColor: themeObj.red },
          ]}
          onPress={() => onPause(timer.id)}
        >
          <Ionicons name="pause" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.controlButton,
          styles.resetButton,
          { backgroundColor: themeObj.accent },
        ]}
        onPress={() => onReset(timer.id)}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onEdit(timer);
        }}
        style={[styles.editButton, { backgroundColor: themeObj.buttonBg }]}
      >
        <Ionicons name="create-outline" size={18} color={themeObj.buttonText} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(timer.id)}
        style={[styles.deleteButton, { backgroundColor: themeObj.delete }]}
      >
        <Ionicons name="trash" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#e0e7ff",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#ffe4e6",
  },
});
