import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BulkActionsProps {
  onStartAll: () => void;
  onPauseAll: () => void;
  onResetAll: () => void;
  themeObj: any;
}

export default function BulkActions({ onStartAll, onPauseAll, onResetAll, themeObj }: BulkActionsProps) {
  return (
    <View style={styles.bulkActionsRow}>
      <TouchableOpacity style={[styles.bulkButton, styles.startButton, { backgroundColor: themeObj.green }]} onPress={onStartAll}>
        <Ionicons name="play" size={18} color="#fff" />
        <Text style={[styles.bulkButtonText, { color: '#fff' }]}>Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.bulkButton, styles.pauseButton, { backgroundColor: themeObj.red }]} onPress={onPauseAll}>
        <Ionicons name="pause" size={18} color="#fff" />
        <Text style={[styles.bulkButtonText, { color: '#fff' }]}>Pause All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.bulkButton, styles.resetButton, { backgroundColor: themeObj.accent }]} onPress={onResetAll}>
        <Ionicons name="refresh" size={18} color="#fff" />
        <Text style={[styles.bulkButtonText, { color: '#fff' }]}>Reset All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bulkActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginTop: 4,
    gap: 8,
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  bulkButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  startButton: {},
  pauseButton: {},
  resetButton: {},
}); 