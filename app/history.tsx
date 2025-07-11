import BackButton from "@/components/shared/BackButton";
import EmptyState from "@/components/shared/EmptyState";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/shared/Card";
import { useHistoryContext } from "../context/HistoryContext";
import { useThemeContext } from "../context/ThemeContext";

export default function History() {
  const { history, exportHistory, loading, clearHistory } = useHistoryContext();
  const { themeObj } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }]}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 12,
          alignItems: "center",
          width: "100%",
        }}
      >
        <BackButton />
        <View style={[styles.headerRow, { alignItems: "center" }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: themeObj.text }]}>
              Timer History
            </Text>
            <TouchableOpacity
              style={[
                styles.exportButton,
                { backgroundColor: themeObj.buttonBg },
              ]}
              onPress={exportHistory}
              disabled={loading}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={themeObj.buttonText}
              />
              <Text
                style={[
                  styles.exportButtonText,
                  { color: themeObj.buttonText },
                ]}
              >
                {loading ? "Exporting..." : "Export"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: themeObj.delete }]}
            onPress={clearHistory}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {history.length == 0 ? (
        <EmptyState
          message="No completed timers yet."
          textColor={themeObj.subtitle}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <Card
              style={{ ...styles.sessionItem, backgroundColor: themeObj.card }}
            >
              <Ionicons
                name="timer-outline"
                size={20}
                color={themeObj.accent}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.sessionText, { color: themeObj.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.sessionDate, { color: themeObj.subtitle }]}>
                {item.completedAt}
              </Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  sessionItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: 300,
    alignItems: "flex-start",
  },
  sessionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 16,
  },
  sessionDate: {
    fontSize: 14,
    marginTop: 4,
  },
});
