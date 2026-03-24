import React, { memo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from '../../constants/theme';
import { getPhimImageUrl } from '../../services/phimapi';

function MovieCard({ movie, onPress, width = 140 }) {
  const posterUri = getPhimImageUrl(movie?.poster_url || movie?.thumb_url);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      <Image source={{ uri: posterUri }} style={[styles.poster, { width, height: width * 1.5 }]} />
      <Text style={styles.title}>{movie?.name || movie?.title || 'Đang cập nhật'}</Text>
      <Text style={styles.sub} numberOfLines={1}>{movie?.year || ''} {movie?.origin_name ? `• ${movie.origin_name}` : ''}</Text>
    </Pressable>
  );
}

export default memo(MovieCard);

const styles = StyleSheet.create({
  card: { marginRight: SPACING.md, ...SHADOW.card },
  poster: { borderRadius: RADIUS.lg, backgroundColor: COLORS.card },
  title: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: '600', marginTop: SPACING.sm, paddingHorizontal: 2 },
  sub: { color: COLORS.textSecondary, fontSize: FONT.xs, paddingHorizontal: 2, marginTop: 2 },
});


