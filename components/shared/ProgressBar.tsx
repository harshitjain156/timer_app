import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  themeObj: any;
}

export default function ProgressBar({ progress, themeObj }: ProgressBarProps) {
  return (
    <View style={[styles.progressBarBg, { backgroundColor: themeObj.progressBg }]}> 
      <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }, { backgroundColor: themeObj.progressFill }]} />
      <Text style={[styles.progressPercent, { color: themeObj.text }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarBg: {
    height: 18,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  progressPercent: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
    zIndex: 1,
  },
}); 