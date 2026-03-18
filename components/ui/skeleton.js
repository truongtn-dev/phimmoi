import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Skeleton({ style }) {
  return <View style={[styles.skel, style]} />;
}

const styles = StyleSheet.create({ skel: { backgroundColor: '#eee', borderRadius: 4 } });
