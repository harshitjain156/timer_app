import { useRouter } from "expo-router";
import React from "react";
import TimerForm from "../components/timer_list/TimerForm";
import { useTimerContext } from "../context/TimerContext";

export default function AddTimer() {
  const { addTimer, categories } = useTimerContext();
  const router = useRouter();
  return (
    <TimerForm
      categories={categories}
      mode="add"
      onSave={async (timer) => {
        await addTimer({ ...timer, id: Date.now().toString() });
        router.back();
      }}
    />
  );
}
