import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export default function MovieCard({ movie, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.posterPlaceholder}>
        <Text style={styles.posterText}>Poster</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{movie?.title}</Text>
        <Text numberOfLines={2} style={styles.overview}>{movie?.overview}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  posterPlaceholder: { width: 80, height: 120, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  posterText: { color: '#666' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  overview: { color: '#444', marginTop: 6 },
});
