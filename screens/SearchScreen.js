import React from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchPhim, getPhimByCategory, PHIM_CATEGORIES } from '../services/phimapi';
import MovieCard from '../components/MovieCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = React.useState('');
  const [selectedCat, setSelectedCat] = React.useState(null);

  const searchResults = useQuery(['phim-search', query], () => searchPhim(query), { enabled: !!query });
  const catResults = useQuery(['phim-cat', selectedCat], () => getPhimByCategory(selectedCat), { enabled: !!selectedCat });

  const movies = query ? (searchResults.data?.data?.items ?? []) : selectedCat ? (catResults.data?.data?.items ?? []) : [];
  const isLoading = query ? searchResults.isLoading : catResults.isLoading;

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search" value={query} onChangeText={setQuery} style={styles.input} />

      <View style={styles.catWrap}>
        {PHIM_CATEGORIES.map((cat) => (
          <Pressable key={cat.slug} onPress={() => setSelectedCat(cat.slug === selectedCat ? null : cat.slug)} style={[styles.cat, selectedCat === cat.slug && styles.catActive]}>
            <Text style={selectedCat === cat.slug ? styles.catTextActive : styles.catText}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? <Text>Loading...</Text> : (
        <FlatList data={movies} keyExtractor={(i) => i._id ?? i.id} renderItem={({ item }) => <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })} />} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12, borderRadius: 6 }, catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }, cat: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: '#eee', marginRight: 8, marginBottom: 8 }, catActive: { backgroundColor: '#007aff' }, catText: { color: '#333' }, catTextActive: { color: '#fff' } });
