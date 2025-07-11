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
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: 24,
    borderRadius: 6,
    zIndex: 0,
  },
  progressPercent: {
    zIndex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
}); 