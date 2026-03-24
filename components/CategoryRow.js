import React, { memo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from './SkeletonLoader';
import { COLORS, FONT, SPACING } from '../constants/theme';

function CategoryRow({ title, icon, movies, isLoading, onMoviePress }) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(i) => String(i)}
          renderItem={() => <MovieCardSkeleton />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    );
  }

  if (!movies?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item._id || item.slug || String(Math.random())}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => onMoviePress?.(item)} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        snapToInterval={152}
        decelerationRate="fast"
      />
    </View>
  );
}

export default memo(CategoryRow);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  titleWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, paddingHorizontal: SPACING.lg },
  icon: { marginRight: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700' },
  list: { paddingHorizontal: SPACING.lg },
});
