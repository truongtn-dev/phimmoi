import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, Alert } from 'react-native';
import useWatchHistory from '../hooks/useWatchHistory';
import { getPhimImageUrl } from '../services/phimapi';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import { Clock, Trash2, ArrowLeft, ChevronRight } from '../components/common/icons';

export default function WatchHistoryScreen({ navigation }) {
  const { history, clearHistory, removeProgress } = useWatchHistory();

  const handleClearAll = () => {
    Alert.alert('Xác nhận', 'Bạn muốn xoá toàn bộ lịch sử xem?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá hết', style: 'destructive', onPress: clearHistory }
    ]);
  };

  const handleRemoveItem = (slug) => {
    // Hack: if we don't have removeItem, let's just use the context logic here for now
    // Better: Add the function to the hook later.
  };

  if (!history.length) {
    return (
      <View style={styles.empty}>
        <Clock size={64} color={COLORS.border} />
        <Text style={styles.emptyTitle}>Lịch sử trống</Text>
        <Text style={styles.emptySub}>Bạn chưa xem bộ phim nào gần đây.</Text>
        <Pressable style={styles.btnHome} onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.btnHomeText}>Khám phá phim ngay</Text>
        </Pressable>
      </View>
    );
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>{history.length} phim đã xem</Text>
        <Pressable onPress={handleClearAll} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Xoá tất cả</Text>
        </Pressable>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => {
          const percent = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
          return (
            <View style={styles.card}>
              <Pressable style={styles.cardContent} onPress={() => navigation.navigate('Watch', { slug: item.slug })}>
                <Image source={{ uri: getPhimImageUrl(item.poster_url) }} style={styles.poster} />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.ep}>{item.episode || 'Tập phim'} • {formatTime(item.progress)} / {formatTime(item.duration)}</Text>
                  
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(percent, 100)}%` }]} />
                  </View>
                </View>
                
                <Pressable onPress={() => removeProgress(item.slug)} style={styles.trashBtn}>
                  <Trash2 size={20} color={COLORS.textMuted} />
                </Pressable>
              </Pressable>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  countText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  clearBtn: { padding: 4 },
  clearBtnText: { color: '#FF6B6B', fontSize: FONT.sm, fontWeight: '600' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, marginBottom: SPACING.md, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm },
  poster: { width: 110, height: 65, borderRadius: RADIUS.sm, resizeMode: 'cover' },
  info: { flex: 1, paddingHorizontal: SPACING.md },
  trashBtn: { padding: SPACING.sm, marginLeft: SPACING.xs },
  name: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700' },
  ep: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2, marginBottom: 6 },
  progressBar: { height: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 },
  progressFill: { height: 2, backgroundColor: COLORS.primary, borderRadius: 1 },
  empty: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { color: COLORS.textPrimary, fontSize: FONT.xl, fontWeight: '800', marginTop: SPACING.lg },
  emptySub: { color: COLORS.textSecondary, fontSize: FONT.md, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xxl },
  btnHome: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.md },
  btnHomeText: { color: '#fff', fontSize: FONT.md, fontWeight: '700' },
});

