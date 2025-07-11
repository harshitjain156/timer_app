import { useTimerContext } from "@/context/TimerContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeContext } from "../../context/ThemeContext";
import { Timer } from "../../types/timer";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";

interface TimerFormProps {
  initialValues?: Partial<Timer>;
  categories: string[];
  onSave: (timer: Timer) => void;
  onDelete?: () => void;
  mode: "add" | "edit";
  loading?: boolean;
  theme?: "light" | "dark";
}

export default function TimerForm({
  initialValues = {},
  onSave,
  onDelete,
  mode,
  loading = false,
}: TimerFormProps) {
  const { categories } = useTimerContext();
  const { themeObj } = useThemeContext();
  const [name, setName] = useState(initialValues.name || "");
  const [duration, setDuration] = useState(
    initialValues.duration ? String(initialValues.duration) : ""
  );
  const [category, setCategory] = useState(
    initialValues.category || categories[0] || ""
  );
  const [halfwayAlert, setHalfwayAlert] = useState(
    !!initialValues.halfwayAlert
  );

  useEffect(() => {
    if (categories.length && !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories]);

  const handleSave = () => {
    if (
      !name.trim() ||
      !duration.trim() ||
      isNaN(Number(duration)) ||
      Number(duration) <= 0
    ) {
      Alert.alert("Invalid Input", "Please enter a valid name and duration.");
      return;
    }
    const timer: Timer = {
      id: mode === "add" ? Date.now().toString() : initialValues.id || "",
      name: name.trim(),
      duration: Number(duration),
      category,
      remaining: Number(duration),
      status: initialValues.status || "Paused",
      halfwayAlert,
    };
    onSave(timer);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <BackButton />
        <Text style={[styles.title, { color: themeObj.text }]}>
          {mode === "add" ? "Add Timer" : "Edit Timer"}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeObj.inputBg,
            borderColor: themeObj.inputBorder,
            color: themeObj.text,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Timer Name"
        placeholderTextColor={themeObj.gray}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeObj.inputBg,
            borderColor: themeObj.inputBorder,
            color: themeObj.text,
          },
        ]}
        value={duration}
        onChangeText={setDuration}
        placeholder="Duration (seconds)"
        placeholderTextColor={themeObj.gray}
        keyboardType="numeric"
      />
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  category === cat
                    ? themeObj.categorySelected
                    : themeObj.categoryBg,
              },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={{
                color:
                  category === cat
                    ? themeObj.categoryTextSelected
                    : themeObj.categoryText,
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { backgroundColor: themeObj.categoryBg },
          ]}
          onPress={() => router.push("/categories")}
        >
          <Ionicons name="add-circle" size={20} color={themeObj.categoryText} />
        </TouchableOpacity>
      </View>
      <View style={styles.switchRow}>
        <Text style={{ color: themeObj.text }}>Halfway Alert</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>
      <PrimaryButton onPress={handleSave} disabled={loading}>
        {loading
          ? mode === "add"
            ? "Saving..."
            : "Saving..."
          : mode === "add"
          ? "Add Timer"
          : "Save Changes"}
      </PrimaryButton>
      {mode === "edit" && onDelete && (
        <SecondaryButton onPress={onDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete Timer"}
        </SecondaryButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  headerIconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  headerIconText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 4,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  saveButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
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
