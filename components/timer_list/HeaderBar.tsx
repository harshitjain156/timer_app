import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderBarProps {
  theme: 'light' | 'dark';
  themeObj: any;
  onToggleTheme: () => void;
  onCategories: () => void;
  onHistory: () => void;
}

export default function HeaderBar({ theme, themeObj, onToggleTheme, onCategories, onHistory }: HeaderBarProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.title, { color: themeObj.text }]}>Timers</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.themeSwitcher} onPress={onToggleTheme}>
          <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={22} color={themeObj.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerIconButton, { backgroundColor: themeObj.buttonBg }]} onPress={onCategories}>
          <Ionicons name="list-circle-outline" size={24} color={themeObj.buttonText} />
          <Text style={[styles.headerIconText, { color: themeObj.buttonText }]}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.historyNavButton, { backgroundColor: themeObj.buttonBg }]} onPress={onHistory}>
          <Ionicons name="time-outline" size={24} color={themeObj.buttonText} />
          <Text style={[styles.historyNavText, { color: themeObj.buttonText }]}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 0,
    alignSelf: 'center',
  },
  themeSwitcher: {
    marginRight: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  historyNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  historyNavText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  headerIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  headerIconText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
}); 