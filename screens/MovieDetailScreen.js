import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPhimDetail, getPhimImageUrl } from '../services/phimapi';

export default function MovieDetailScreen({ route }) {
  const { slug } = route.params || {};
  const { data, isLoading } = useQuery(['phim-detail', slug], () => getPhimDetail(slug), { enabled: !!slug });

  const movie = data?.movie;

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (!movie) return <View style={styles.center}><Text>Không tìm thấy phim</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: getPhimImageUrl(movie.poster_url) }} style={styles.poster} />
      <Text style={styles.title}>{movie.name}</Text>
      <Text style={styles.meta}>{movie.origin_name} • {movie.year}</Text>
      <Text style={styles.overview}>{(movie.content || '').replace(/<[^>]*>/g, '')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  poster: { width: '100%', height: 300, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  meta: { color: '#666', marginBottom: 8 },
  overview: { fontSize: 14, lineHeight: 20 },
});
