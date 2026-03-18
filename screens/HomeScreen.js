import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPhimList } from '../services/phimapi';
import MovieCard from '../components/MovieCard';

export default function HomeScreen({ navigation }) {
  const phimBo = useQuery(['phim-bo'], () => getPhimList('phim-bo', 1, 20));

  const movies = phimBo.data?.data?.items ?? [];

  const renderItem = ({ item }) => (
    <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Movies</Text>
      <FlatList data={movies} keyExtractor={(i) => i._id ?? i.id} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#fff' }, heading: { fontSize: 24, fontWeight: '600', marginBottom: 12 }, });
