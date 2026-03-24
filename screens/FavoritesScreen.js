import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavoritesContext } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { Dimensions } from 'react-native';

const CARD_W = (Dimensions.get('window').width - SPACING.lg * 2 - SPACING.md) / 2;

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavoritesContext();

  if (!favorites.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyTitle}>Chưa có phim yêu thích</Text>
        <Text style={styles.emptySub}>Thêm phim vào danh sách để xem lại nhanh hơn</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item.slug}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard movie={item} width={CARD_W} onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: SPACING.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  row: { gap: SPACING.md, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  empty: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.lg },
  emptyTitle: { color: COLORS.textPrimary, fontSize: FONT.xl, fontWeight: '700' },
  emptySub: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.sm, textAlign: 'center' },
});
