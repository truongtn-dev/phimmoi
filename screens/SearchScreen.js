import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchPhim, getPhimByCategory, PHIM_CATEGORIES } from '../services/phimapi';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/SkeletonLoader';
import useDebounce from '../hooks/useDebounce';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const searchResults = useQuery({ queryKey: ['phim-search', debouncedQuery], queryFn: () => searchPhim(debouncedQuery), enabled: !!debouncedQuery });
  const catResults = useQuery({ queryKey: ['phim-cat', selectedCat], queryFn: () => getPhimByCategory(selectedCat), enabled: !!selectedCat });

  const movies = debouncedQuery ? (searchResults.data?.data?.items ?? []) : selectedCat ? (catResults.data?.data?.items ?? []) : [];
  const isLoading = debouncedQuery ? searchResults.isLoading : catResults.isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}><Icons.Search size={18} color={COLORS.textMuted} /></View>
        <TextInput
          placeholder="Tìm kiếm phim..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {PHIM_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.slug}
            onPress={() => { setSelectedCat(cat.slug === selectedCat ? null : cat.slug); setQuery(''); }}
            style={[styles.chip, selectedCat === cat.slug && styles.chipActive]}
          >
            <Text style={[styles.chipText, selectedCat === cat.slug && styles.chipTextActive]}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => <MovieCardSkeleton key={i} />)}
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={{marginBottom:SPACING.md}}><Icons.Film size={48} color={COLORS.border} /></View>
          <Text style={styles.emptyText}>{debouncedQuery || selectedCat ? 'Không tìm thấy kết quả' : 'Tìm kiếm phim yêu thích'}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          numColumns={2}
          keyExtractor={(i) => i._id || i.slug}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              width={CARD_W}
              onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const CARD_W = (require('react-native').Dimensions.get('window').width - SPACING.lg * 2 - SPACING.md) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: { fontSize: 18, marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.md, paddingVertical: 12 },
  catScroll: { marginTop: SPACING.md, maxHeight: 54 },
  catContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center' },
  chip: { 
    paddingHorizontal: 18, 
    paddingVertical: 9, 
    borderRadius: RADIUS.full, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  chipText: { color: '#9E9E9E', fontSize: FONT.sm, fontWeight: '600', letterSpacing: 0.3 },
  chipTextActive: { color: '#FFFFFF', fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.lg, gap: SPACING.md },
  gridRow: { gap: SPACING.md, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FONT.md },
});
