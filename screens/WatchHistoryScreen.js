import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable } from 'react-native';
import useWatchHistory from '../hooks/useWatchHistory';
import { getPhimImageUrl } from '../services/phimapi';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function WatchHistoryScreen({ navigation }) {
  const { history, clearHistory } = useWatchHistory();

  if (!history.length) {
    return (
      <View style={styles.empty}>
        <View style={{marginBottom:SPACING.md}}><Icons.Clock size={48} color={COLORS.border} /></View>
        <Text style={styles.emptyTitle}>Chưa có lịch sử xem</Text>
        <Text style={styles.emptySub}>Các phim bạn xem sẽ xuất hiện ở đây</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('Watch', { slug: item.slug })}
          >
            <Image source={{ uri: getPhimImageUrl(item.poster_url) }} style={styles.poster} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.ep}>{item.episode || 'Tập 1'}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((item.progress || 0) * 100, 100)}%` }]} />
              </View>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: { flexDirection: 'row', marginBottom: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden' },
  poster: { width: 100, height: 70, resizeMode: 'cover' },
  info: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  name: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '600' },
  ep: { color: COLORS.textSecondary, fontSize: FONT.xs, marginTop: 2 },
  progressBar: { height: 3, backgroundColor: COLORS.card, borderRadius: 2, marginTop: SPACING.sm },
  progressFill: { height: 3, backgroundColor: COLORS.primary, borderRadius: 2 },
  empty: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.lg },
  emptyTitle: { color: COLORS.textPrimary, fontSize: FONT.xl, fontWeight: '700' },
  emptySub: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.sm },
});
