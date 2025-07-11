import BackButton from "@/components/shared/BackButton";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/shared/Card";
import { useThemeContext } from "../context/ThemeContext";
import { useTimerContext } from "../context/TimerContext";

const DEFAULT_CATEGORIES = ["Workout", "Study", "Break"];

export default function Categories() {
  const { themeObj } = useThemeContext();
  const { categories, addCategory, deleteCategory } = useTimerContext();
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <BackButton />
        <Text style={[styles.title, { color: themeObj.text }]}>Categories</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeObj.inputBg,
              borderColor: themeObj.inputBorder,
              color: themeObj.text,
            },
          ]}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Add new category"
          placeholderTextColor={themeObj.text + "99"}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: themeObj.buttonBg }]}
          onPress={(e) => addCategory(newCategory)}
          disabled={saving}
        >
          <Ionicons name="add" size={22} color={themeObj.buttonText} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Card
            style={{ ...styles.categoryCard, backgroundColor: themeObj.card }}
          >
            <Text style={[styles.categoryText, { color: themeObj.text }]}>
              {item}
            </Text>
            {DEFAULT_CATEGORIES.includes(item) ? null : (
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  { backgroundColor: themeObj.delete },
                ]}
                onPress={() => deleteCategory(item)}
              >
                <Ionicons name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </Card>
        )}
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    alignItems: "center",
    justifyContent: "center",
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    width: "100%",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
});
