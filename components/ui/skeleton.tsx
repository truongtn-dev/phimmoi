import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type Props = { style?: ViewStyle };

export default function Skeleton({ style }: Props) {
  return <View style={[styles.skeleton, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 12,
  },
});
