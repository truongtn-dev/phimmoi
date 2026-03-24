import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { supabase } from '../integrations/supabase/client';
import { useReportsContext } from '../context/ReportsContext';
import { useCommentsContext } from '../context/CommentsContext';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function AdminScreen({ navigation }) {
  const { reports } = useReportsContext();
  const { totalComments } = useCommentsContext();
  const [dbStats, setDbStats] = useState({ movies: 0, users: 0, apiMovies: 0, blocked: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: mCount } = await supabase.from('movies').select('*', { count: 'exact', head: true });
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: bCount } = await supabase.from('blocked_movies').select('*', { count: 'exact', head: true });
      const { count: cCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      
      const { getPhimMoiCapNhat } = await import('../services/phimapi');
      const apiRes = await getPhimMoiCapNhat(1);
      
      setDbStats({ 
        movies: mCount || 0, 
        users: uCount || 0, 
        apiMovies: apiRes?.params?.pagination?.totalItems || 1000,
        blocked: bCount || 0,
        categories: cCount || 0
      });
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: <Icons.Film size={26} color="#E50914" />, title: 'Phim cục bộ', count: dbStats.movies, color: '#E50914' },
    { icon: <Icons.Globe size={26} color="#9C27B0" />, title: 'Thư viện API', count: dbStats.apiMovies, color: '#9C27B0' },
    { icon: <Icons.Users size={26} color="#46D369" />, title: 'Người dùng', count: dbStats.users, color: '#46D369' },
    { icon: <Icons.Folder size={26} color="#F5C518" />, title: 'Thể loại', count: dbStats.categories, color: '#F5C518' },
    { icon: <Icons.MessageSquare size={26} color="#1E90FF" />, title: 'Bình luận', count: totalComments, color: '#1E90FF' },
    { icon: <Icons.ShieldOff size={26} color="#FF6B6B" />, title: 'Bị chặn', count: dbStats.blocked, color: '#FF6B6B' },
  ];

  const adminCards = [
    { icon: <Icons.Film size={24} color="#E50914" />, title: 'Quản lý Phim', desc: 'Thêm, sửa, xóa phim', color: '#E50914', action: () => navigation.navigate('AdminMovies') },
    { icon: <Icons.Folder size={24} color="#F5C518" />, title: 'Quản lý Thể loại', desc: 'Danh mục thể loại phim', color: '#F5C518', action: () => navigation.navigate('AdminCategories') },
    { icon: <Icons.Users size={24} color="#46D369" />, title: 'Quản lý Người dùng', desc: 'Danh sách tài khoản', color: '#46D369', action: () => navigation.navigate('AdminUsers') },
    { icon: <Icons.MessageSquare size={24} color="#1E90FF" />, title: 'Quản lý Bình luận', desc: 'Xóa bình luận vi phạm', color: '#1E90FF', action: () => navigation.navigate('AdminComments') },
    { icon: <Icons.Star size={24} color="#FFD700" />, title: 'Quản lý Đánh giá', desc: 'Xem phản hồi từ người dùng', color: '#FFD700', action: () => navigation.navigate('AdminRatings') },
    { icon: <Icons.AlertTriangle size={24} color="#FF6B6B" />, title: 'Quản lý Báo cáo', desc: `Xem & xử lý ${reports.length} báo cáo`, color: '#FF6B6B', action: () => navigation.navigate('Report') },
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

