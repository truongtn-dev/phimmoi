import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Pressable, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchPhim, getPhimByCategory, PHIM_CATEGORIES } from '../services/phimapi';
import MovieCard from '../components/movies/MovieCard';
import { MovieCardSkeleton } from '../components/common/SkeletonLoader';
import useDebounce from '../hooks/useDebounce';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - SPACING.lg * 2 - SPACING.md) / 2;
const PAGE_SIZE = 20;

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 500);

  // Reset page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory]);

  const moviesQuery = useQuery({
    queryKey: ['phim-search', debouncedQuery, selectedCategory, page],
    queryFn: () => {
      if (debouncedQuery.trim()) {
        return searchPhim(debouncedQuery, page, PAGE_SIZE);
      }
      if (selectedCategory) {
        return getPhimByCategory(selectedCategory, page, PAGE_SIZE);
      }
      return null;
    },
    enabled: !!(debouncedQuery.trim() || selectedCategory),
  });

  const responseData = moviesQuery.data;
  const items = responseData?.data?.items || responseData?.items || [];
  const totalPages = responseData?.data?.params?.pagination?.totalPages || 10; // Fallback to 10 if not in API

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const renderPagination = () => {
    if (items.length === 0 || moviesQuery.isLoading) return null;
    return (
      <View style={styles.pagination}>
        <Pressable 
          onPress={handlePrevPage} 
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && { opacity: 0.3 }]}
        >
          <Icons.ChevronLeft size={20} color="#fff" />
          <Text style={styles.pageBtnText}>Trang trước</Text>
        </Pressable>
        
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>Trang {page}</Text>
        </View>

        <Pressable 
          onPress={handleNextPage} 
          style={styles.pageBtn}
        >
          <Text style={styles.pageBtnText}>Trang sau</Text>
          <Icons.ChevronRight size={20} color="#fff" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Icons.Search size={20} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phim..."
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')}>
              <Icons.X size={18} color={COLORS.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingRight: 40 }}
        >
          <Pressable
            style={[styles.chip, !selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>Tất cả</Text>
          </Pressable>
          {PHIM_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.slug}
              style={[styles.chip, selectedCategory === cat.slug && styles.chipActive]}
              onPress={() => {
                setSelectedCategory(cat.slug);
                setQuery('');
              }}
            >
              <Text style={[styles.chipText, selectedCategory === cat.slug && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {moviesQuery.isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => String(i)}
          renderItem={() => <MovieCardSkeleton />}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ padding: SPACING.lg }}
        />
      ) : items.length === 0 ? (
        <View style={styles.center}>
          {!(debouncedQuery || selectedCategory) ? (
            <>
              <Icons.Search size={64} color={COLORS.card} />
              <Text style={styles.emptyText}>Nhập tên phim hoặc chọn thể loại</Text>
            </>
          ) : (
            <>
              <Icons.Info size={64} color={COLORS.card} />
              <Text style={styles.emptyText}>Không tìm thấy phim nào phù hợp</Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item.slug + '-' + Math.random()}
          renderItem={({ item }) => (
            <MovieCard 
              movie={item} 
              width={CARD_W} 
              onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })} 
            />
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListFooterComponent={renderPagination}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    backgroundColor: COLORS.background, 
    paddingTop: SPACING.sm, 
    paddingHorizontal: SPACING.lg, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.05)' 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.md, height: '100%' },
  categoryScroll: { marginTop: SPACING.md, marginBottom: SPACING.sm },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONT.sm, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  row: { paddingHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: SPACING.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { color: COLORS.textSecondary, fontSize: FONT.md, marginTop: SPACING.md, textAlign: 'center' },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: SPACING.lg, 
    marginBottom: 40, 
    gap: SPACING.sm 
  },
  pageBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pageBtnText: { color: '#fff', fontSize: FONT.sm, fontWeight: '600', marginHorizontal: 4 },
  pageIndicator: { 
    minWidth: 80, 
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  pageIndicatorText: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: 'bold' },
});

