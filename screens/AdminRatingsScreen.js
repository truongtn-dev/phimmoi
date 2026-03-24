import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { supabase } from '../integrations/supabase/client';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function AdminRatingsScreen() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setRatings(data || []);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userIcon}><Icons.User size={20} color="#fff" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userEmail}>{item.user_email}</Text>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleString('vi-VN')}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Icons.Star size={14} color="#F5C518" />
          <Text style={styles.ratingText}>{item.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.movieTitle}>Phim: <Text style={{color: COLORS.primary}}>{item.movie_title || 'N/A'}</Text></Text>
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary}/></View>;

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Quản lý Đánh giá</Text>
        <Pressable style={styles.refreshBtn} onPress={fetchRatings}>
          <Icons.Clock size={18} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <FlatList 
        data={ratings}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có đánh giá nào.</Text>}
        contentContainerStyle={{ padding: SPACING.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.textPrimary },
  refreshBtn: { padding: 8 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  userIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center' },
  userEmail: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: '600' },
  date: { color: COLORS.textMuted, fontSize: 10 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  ratingText: { color: '#F5C518', fontWeight: '700', fontSize: FONT.xs },
  movieTitle: { color: COLORS.textSecondary, fontSize: FONT.sm },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40 },
});
