import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const TIMER_HISTORY_KEY = 'timer_history';

const lightTheme = {
  background: '#fff',
  text: '#22223b',
  card: '#f0f0f0',
  subtitle: '#666',
  buttonBg: '#e0e7ff',
  buttonText: '#6366f1',
};
const darkTheme = {
  background: '#181926',
  text: '#f4f4f4',
  card: '#232946',
  subtitle: '#a1a1aa',
  buttonBg: '#232946',
  buttonText: '#a5b4fc',
};

export default function History({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const themeObj = theme === 'dark' ? darkTheme : lightTheme;
  const [history, setHistory] = useState<{ name: string; completedAt: number }[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(TIMER_HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    })();
  }, []);

  const exportHistory = async () => {
    setExporting(true);
    try {
      const fileUri = FileSystem.cacheDirectory + 'timer_history.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(history, null, 2));
      await Sharing.shareAsync(fileUri, { mimeType: 'application/json' });
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export timer history.');
    }
    setExporting(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeObj.background }] }>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: themeObj.text }]}>Timer History</Text>
        <TouchableOpacity style={[styles.exportButton, { backgroundColor: themeObj.buttonBg }]} onPress={exportHistory} disabled={exporting}>
          <Ionicons name="download-outline" size={20} color={themeObj.buttonText} />
          <Text style={[styles.exportButtonText, { color: themeObj.buttonText }]}>{exporting ? 'Exporting...' : 'Export'}</Text>
        </TouchableOpacity>
      </View>
      {history.length === 0 ? (
        <Text style={[styles.subtitle, { color: themeObj.subtitle }]}>No completed timers yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={[styles.sessionItem, { backgroundColor: themeObj.card }] }>
              <Text style={[styles.sessionText, { color: themeObj.text }]}>{item.name}</Text>
              <Text style={[styles.sessionDate, { color: themeObj.subtitle }]}>{new Date(item.completedAt).toLocaleString()}</Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 16,
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
  sessionDate: {
    fontSize: 14,
    marginTop: 4,
  },
});
