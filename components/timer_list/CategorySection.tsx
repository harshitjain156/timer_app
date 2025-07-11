import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BulkActions from './BulkActions';
import TimerCard, { Timer } from './TimerCard';

interface CategorySectionProps {
  category: string;
  timers: Timer[];
  expanded: boolean;
  onToggleExpand: (cat: string) => void;
  onStartAll: () => void;
  onPauseAll: () => void;
  onResetAll: () => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (timer: Timer) => void;
  onDelete: (id: string) => void;
  themeObj: any;
  theme: 'light' | 'dark';
}

export default function CategorySection({ category, timers, expanded, onToggleExpand, onStartAll, onPauseAll, onResetAll, onStart, onPause, onReset, onEdit, onDelete, themeObj, theme }: CategorySectionProps) {
  return (
    <View style={[styles.categorySection, { backgroundColor: themeObj.card }]}> 
      <TouchableOpacity style={[styles.categoryHeader, { borderBottomColor: themeObj.accent }]} onPress={() => onToggleExpand(category)}>
        <Text style={[styles.categoryTitle, { color: themeObj.accent }]}>{category}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={themeObj.accent}
        />
      </TouchableOpacity>
      {expanded && (
        <BulkActions
          onStartAll={onStartAll}
          onPauseAll={onPauseAll}
          onResetAll={onResetAll}
          themeObj={themeObj}
        />
      )}
      {expanded && (
        <View style={styles.timersList}>
          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              themeObj={themeObj}
              onStart={onStart}
              onPause={onPause}
              onReset={onReset}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: 18,
    borderRadius: 12,
    shadowColor: '#a5b4fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e7ff',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timersList: {
    padding: 10,
  },
}); 