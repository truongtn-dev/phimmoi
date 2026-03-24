import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useCommentsContext } from '../context/CommentsContext';
import useWatchHistory from '../hooks/useWatchHistory';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function AdminScreen({ navigation }) {
  const { favorites } = useFavoritesContext();
  const { totalComments } = useCommentsContext();
  const { history } = useWatchHistory();

  const stats = [
    { icon: <Icons.Film size={28} color="#E50914" />, title: 'Phim yêu thích', count: favorites.length, color: '#E50914' },
    { icon: <Icons.MessageSquare size={28} color="#1E90FF" />, title: 'Tổng bình luận', count: totalComments, color: '#1E90FF' },
    { icon: <Icons.Clock size={28} color="#F5C518" />, title: 'Lịch sử xem', count: history.length, color: '#F5C518' },
    { icon: <Icons.Users size={28} color="#46D369" />, title: 'Người dùng', count: '---', color: '#46D369' },
  ];

  const adminCards = [
    { icon: <Icons.Film size={24} color="#E50914" />, title: 'Quản lý Phim', desc: 'Thêm, sửa, xóa phim', color: '#E50914', action: () => navigation.navigate('AdminMovies') },
    { icon: <Icons.Folder size={24} color="#F5C518" />, title: 'Quản lý Thể loại', desc: 'Danh mục thể loại phim', color: '#F5C518', action: () => navigation.navigate('AdminCategories') },
    { icon: <Icons.Users size={24} color="#46D369" />, title: 'Quản lý Người dùng', desc: 'Danh sách tài khoản', color: '#46D369', action: () => navigation.navigate('AdminUsers') },
    { icon: <Icons.MessageSquare size={24} color="#1E90FF" />, title: 'Quản lý Bình luận', desc: 'Xóa bình luận vi phạm', color: '#1E90FF', action: () => navigation.navigate('AdminComments') },
    { icon: <Icons.AlertTriangle size={24} color="#FF6B6B" />, title: 'Quản lý Báo cáo', desc: 'Xem & xử lý báo cáo', color: '#FF6B6B', action: () => navigation.navigate('Report') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:SPACING.lg}}>
        <Icons.BarChart2 size={24} color={COLORS.textPrimary} style={{marginRight:SPACING.sm}} />
        <Text style={[styles.title, {marginBottom: 0}]}>Bảng điều khiển</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <View style={{marginBottom: SPACING.sm}}>{s.icon}</View>
            <Text style={styles.statCount}>{s.count}</Text>
            <Text style={styles.statLabel}>{s.title}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Quản lý</Text>
      {adminCards.map((card, idx) => (
        <Pressable key={idx} onPress={card.action} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}>
          <View style={[styles.iconWrap, { backgroundColor: card.color + '20' }]}>
            {card.icon}
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDesc}>{card.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}

      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:SPACING.xl}}>
        <Icons.Lightbulb size={16} color={COLORS.textMuted} />
        <Text style={[styles.note,{marginTop:0,marginLeft:4}]}>Tính năng phụ thuộc vào hạ tầng Backend.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  title: { color: COLORS.textPrimary, fontSize: FONT.xl, fontWeight: '800', marginBottom: SPACING.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.xl },
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center' },
  statIcon: { fontSize: 28, marginBottom: SPACING.sm },
  statCount: { color: COLORS.textPrimary, fontSize: FONT.xxl, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: FONT.xs, marginTop: 4 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: RADIUS.lg, marginBottom: SPACING.md },
  iconWrap: { width: 50, height: 50, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  icon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardTitle: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700' },
  cardDesc: { color: COLORS.textSecondary, fontSize: FONT.xs, marginTop: 2 },
  arrow: { color: COLORS.textMuted, fontSize: 28, fontWeight: '300' },
  note: { color: COLORS.textMuted, fontSize: FONT.xs, marginTop: SPACING.xl, textAlign: 'center' },
});
