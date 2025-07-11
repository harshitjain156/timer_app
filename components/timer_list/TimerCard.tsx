import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from './ProgressBar';

export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remaining: number;
  status: 'Running' | 'Paused' | 'Completed';
  halfwayAlert?: boolean;
}

interface TimerCardProps {
  timer: Timer;
  themeObj: any;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onEdit: (timer: Timer) => void;
  onDelete: (id: string) => void;
}

function formatTime(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

function getStatus(timer: Timer) {
  if (timer.status === 'Completed') return 'Completed';
  if (timer.status === 'Running') return 'Running';
  if (timer.status === 'Paused') return 'Paused';
  return 'Paused';
}

export default function TimerCard({ timer, themeObj, onStart, onPause, onReset, onEdit, onDelete }: TimerCardProps) {
  const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;
  return (
    <View style={[styles.timerCard, { backgroundColor: themeObj.card }]}> 
      <View style={[styles.timerHeader, { borderBottomColor: themeObj.accent }]}> 
        <Text style={[styles.timerName, { color: themeObj.text }]}>{timer.name}</Text>
        {timer.halfwayAlert && (
          <Ionicons name="notifications" size={18} color={themeObj.accent} style={{ marginRight: 4 }} />
        )}
        <Text style={[styles.timerStatus, { color: themeObj.gray }]}>{getStatus(timer)}</Text>
        <TouchableOpacity onPress={() => onEdit(timer)} style={[styles.editButton, { backgroundColor: themeObj.buttonBg }]}> 
          <Ionicons name="create-outline" size={18} color={themeObj.buttonText} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(timer.id)} style={[styles.deleteButton, { backgroundColor: themeObj.red }]}> 
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.timerTime, { color: themeObj.text }]}>{formatTime(timer.remaining)}</Text>
      <ProgressBar progress={progress} themeObj={themeObj} />
      <View style={styles.timerControls}>
        {timer.status !== 'Running' && timer.status !== 'Completed' && (
          <TouchableOpacity style={[styles.controlButton, styles.startButton, { backgroundColor: themeObj.green }]} onPress={() => onStart(timer.id)}>
            <Ionicons name="play" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {timer.status === 'Running' && (
          <TouchableOpacity style={[styles.controlButton, styles.pauseButton, { backgroundColor: themeObj.red }]} onPress={() => onPause(timer.id)}>
            <Ionicons name="pause" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.controlButton, styles.resetButton, { backgroundColor: themeObj.accent }]} onPress={() => onReset(timer.id)}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#a5b4fc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#e0e7ff',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerTime: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  controlButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#6366f1',
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#ffe4e6',
  },
}); 