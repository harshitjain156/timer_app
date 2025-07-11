import { Timer } from "@/types/timer";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import TimerForm from "../components/timer_list/TimerForm";
import { useTimerContext } from "../context/TimerContext";
import { useTimerControlContext } from "../context/TimerControlContext";

export default function EditTimer() {
  const router = useRouter();
  const { timer } = useLocalSearchParams();
  const { updateTimer, categories, timers } = useTimerContext();
  const { deleteTimerWithControl } = useTimerControlContext();
  const obj = JSON.parse(timer as string);
  const timerObj: Timer = obj || {
    id: "",
    name: "",
    duration: 0,
    category: "",
    remaining: 0,
    status: "Paused",
    halfwayAlert: false,
  };
  return (
    <TimerForm
      categories={categories}
      mode="edit"
      initialValues={timerObj}
      onSave={async (timer) => {
        await updateTimer({ ...timer, id: timerObj.id });
        router.back();
      }}
      onDelete={async () => {
        await deleteTimerWithControl(timerObj.id);
        router.back();
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  categoryRow: {
    flexDirection: "row",
    marginVertical: 12,
    flexWrap: "wrap",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  halfwayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 0,
  },
  deleteButton: {
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
