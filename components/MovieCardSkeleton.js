import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MovieCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.poster} />
      <View style={styles.info}>
        <View style={styles.line} />
        <View style={[styles.line, { width: '60%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  poster: { width: 80, height: 120, backgroundColor: '#eee', borderRadius: 6 },
  info: { flex: 1, marginLeft: 12 },
  line: { height: 12, backgroundColor: '#eee', marginBottom: 8, borderRadius: 4 },
});
