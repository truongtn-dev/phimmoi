import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

export default function MovieCarousel({ movies = [], onPressMovie }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wrap}>
      {movies.map((m) => (
        <View key={m.id} style={styles.item}>
          <MovieCard movie={m} onPress={() => onPressMovie?.(m)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8 },
  item: { marginRight: 12 },
});


