import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const TIMERS_KEY = 'timers_list';
const CATEGORIES_KEY = 'timer_categories';

const lightTheme = {
  background: '#fff',
  text: '#22223b',
  accent: '#6366f1',
  green: '#22c55e',
  inputBg: '#f8faff',
  inputBorder: '#ccc',
  buttonBg: '#22c55e',
  buttonText: '#fff',
  categoryBg: '#e0e7ff',
  categorySelected: '#6366f1',
  categoryText: '#22223b',
  categoryTextSelected: '#fff',
  gray: '#999',
};
const darkTheme = {
  background: '#181926',
  text: '#f4f4f4',
  accent: '#a5b4fc',
  green: '#4ade80',
  inputBg: '#232946',
  inputBorder: '#232946',
  buttonBg: '#4ade80',
  buttonText: '#232946',
  categoryBg: '#232946',
  categorySelected: '#6366f1',
  categoryText: '#f4f4f4',
  categoryTextSelected: '#fff',
  gray: '#666',
};

export default function EditTimer({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const themeObj = theme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const params = useLocalSearchParams();
  let timerObj = { id: '', name: '', duration: 0, category: '', remaining: 0, status: 'Paused', halfwayAlert: false };
  if (params.timer) {
    try {
      timerObj = JSON.parse(params.timer as string);
    } catch {}
  }
  const [name, setName] = useState(timerObj.name);
  const [duration, setDuration] = useState(timerObj.duration.toString());
  const [category, setCategory] = useState(timerObj.category);
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [halfwayAlert, setHalfwayAlert] = useState(!!timerObj.halfwayAlert);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CATEGORIES_KEY);
      let cats = stored ? JSON.parse(stored) : ["Workout", "Study", "Break"];
      setCategories(cats);
      if (!cats.includes(category)) setCategory(cats[0] || "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTimer = async () => {
    if (!name.trim() || !duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid name and duration.");
      return;
    }
    setSaving(true);
    try {
      const stored = await AsyncStorage.getItem(TIMERS_KEY);
      let timers = stored ? JSON.parse(stored) : [];
      timers = timers.map((t: any) =>
        t.id === timerObj.id
          ? {
              ...t,
              name: name.trim(),
              duration: Number(duration),
              category,
              halfwayAlert,
              remaining: t.status === 'Completed' ? 0 : Math.min(t.remaining, Number(duration)),
            }
          : t
      );
      await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
      setSaving(false);
      router.back();
    } catch (e) {
      setSaving(false);
      Alert.alert("Error", "Failed to save timer.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }] }>
      <Text style={[styles.label, { color: themeObj.text }]}>Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeObj.inputBg, borderColor: themeObj.inputBorder, color: themeObj.text }]}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Workout Timer"
        placeholderTextColor={themeObj.text + '99'}
      />
      <Text style={[styles.label, { color: themeObj.text }]}>Duration (seconds)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeObj.inputBg, borderColor: themeObj.inputBorder, color: themeObj.text }]}
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 1500"
        keyboardType="numeric"
        placeholderTextColor={themeObj.text + '99'}
      />
      <Text style={[styles.label, { color: themeObj.text }]}>Category</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, { backgroundColor: category === cat ? themeObj.categorySelected : themeObj.categoryBg }]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? themeObj.categoryTextSelected : themeObj.categoryText, fontWeight: 'bold' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.halfwayRow}>
        <Ionicons name="notifications" size={20} color={halfwayAlert ? themeObj.accent : themeObj.gray} />
        <Text style={[styles.label, { color: themeObj.text, marginTop: 0, marginBottom: 0, marginLeft: 8 }]}>Halfway Alert</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} thumbColor={halfwayAlert ? themeObj.accent : themeObj.gray} />
      </View>
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: themeObj.buttonBg }]} onPress={saveTimer} disabled={saving}>
        <Text style={[styles.saveButtonText, { color: themeObj.buttonText }]}>{saving ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    marginVertical: 12,
    flexWrap: 'wrap',
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
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  halfwayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 0,
  },
}); 