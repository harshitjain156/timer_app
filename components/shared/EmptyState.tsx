import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface EmptyStateProps {
  message: string;
  style?: ViewStyle;
  textColor?: string;
}

export default function EmptyState({ message, style, textColor }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textColor ? { color: textColor } : undefined]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    flex:1
  },
  text: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
}); 