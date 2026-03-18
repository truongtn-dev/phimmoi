import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function PhimCard({ phim, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title}>{phim?.title || phim?.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 140 },
  poster: { width: 140, height: 200, backgroundColor: '#ddd', borderRadius: 6 },
  info: { marginTop: 8 },
  title: { fontSize: 14, fontWeight: '600' },
});
