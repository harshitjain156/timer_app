import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const CATEGORIES_KEY = 'timer_categories';
const DEFAULT_CATEGORIES = ["Workout", "Study", "Break"];

const lightTheme = {
  background: '#fff',
  text: '#22223b',
  inputBg: '#f8faff',
  inputBorder: '#ccc',
  buttonBg: '#22c55e',
  buttonText: '#fff',
  card: '#e0e7ff',
  delete: '#ef4444',
};
const darkTheme = {
  background: '#181926',
  text: '#f4f4f4',
  inputBg: '#232946',
  inputBorder: '#232946',
  buttonBg: '#4ade80',
  buttonText: '#232946',
  card: '#232946',
  delete: '#f87171',
};

export default function Categories({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const themeObj = theme === 'dark' ? darkTheme : lightTheme;
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CATEGORIES_KEY);
      let cats = stored ? JSON.parse(stored) : [];
      // Always include defaults, deduplicated
      cats = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
      setCategories(cats);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
    })();
  }, []);

  const saveCategories = async (cats: string[]) => {
    // Always include defaults, deduplicated
    const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
    setCategories(merged);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(merged));
  };

  const addCategory = async () => {
    const cat = newCategory.trim();
    if (!cat) return;
    if (categories.includes(cat)) {
      Alert.alert('Duplicate', 'This category already exists.');
      return;
    }
    setSaving(true);
    await saveCategories([cat, ...categories]);
    setNewCategory("");
    setSaving(false);
  };

  const deleteCategory = async (cat: string) => {
    const filtered = categories.filter((c) => c !== cat);
    await saveCategories(filtered);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }] }>
      <Text style={[styles.title, { color: themeObj.text }]}>Categories</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { backgroundColor: themeObj.inputBg, borderColor: themeObj.inputBorder, color: themeObj.text }]}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Add new category"
          placeholderTextColor={themeObj.text + '99'}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: themeObj.buttonBg }]} onPress={addCategory} disabled={saving}>
          <Ionicons name="add" size={22} color={themeObj.buttonText} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[styles.categoryCard, { backgroundColor: themeObj.card }] }>
            <Text style={[styles.categoryText, { color: themeObj.text }]}>{item}</Text>
            {DEFAULT_CATEGORIES.includes(item) ? null : (
              <TouchableOpacity style={[styles.deleteButton, { backgroundColor: themeObj.delete }]} onPress={() => deleteCategory(item)}>
                <Ionicons name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    width: '100%',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
}); 