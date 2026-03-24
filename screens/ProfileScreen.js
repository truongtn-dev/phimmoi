import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function ProfileScreen({ navigation }) {
  const { user, isAdmin, signOut } = useAuth();
  const { favorites } = useFavoritesContext();

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: async () => { await signOut(); } },
    ]);
  };

  const menuItems = isAdmin ? [
    { icon: <Icons.Shield size={20} color="#1E90FF" />, label: 'Truy cập Quản Trị Viên', onPress: () => navigation.navigate('Admin') }
  ] : [
    { icon: <Icons.Heart size={20} color="#E50914" />, label: `Phim yêu thích (${favorites.length})`, onPress: () => navigation.navigate('FavoritesTab') },
    { icon: <Icons.Clock size={20} color="#F5C518" />, label: 'Lịch sử xem', onPress: () => navigation.navigate('WatchHistory') },
    { icon: <Icons.AlertTriangle size={20} color="#FF6B6B" />, label: 'Báo cáo lỗi phim', onPress: () => navigation.navigate('Report') },
  ];

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A';

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: SPACING.xl }]}>
        <View style={{alignItems:'center', marginBottom: SPACING.xl}}>
           <Icons.User size={80} color={COLORS.textMuted} />
           <Text style={[styles.email, {marginTop: SPACING.md, fontSize: FONT.lg}]}>Bạn chưa đăng nhập</Text>
           <Text style={[styles.joinDate, {textAlign: 'center', marginTop: 8}]}>Đăng nhập để lưu phim yêu thích{'\n'}và lịch sử xem</Text>
        </View>
        <Pressable style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
           <Text style={styles.logoutText}>Đăng Nhập</Text>
        </Pressable>
        <Pressable style={[styles.logoutBtn, {backgroundColor: COLORS.surface, marginTop: SPACING.md}]} onPress={() => navigation.navigate('Register')}>
           <Text style={[styles.logoutText, {color: COLORS.textPrimary}]}>Đăng Ký</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.email?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{user?.email || 'Khách'}</Text>
        <Text style={styles.joinDate}>Thành viên từ {joinDate}</Text>
        {isAdmin && <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>ADMIN</Text></View>}
      </View>

      <View style={styles.card}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={idx}
            style={({ pressed }) => [styles.menuItem, idx < menuItems.length - 1 && styles.menuBorder, pressed && { opacity: 0.7 }]}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]} onPress={handleLogout}>
        <View style={{flexDirection:'row',alignItems:'center'}}><Icons.LogOut size={20} color="#FF6B6B" style={{marginRight:8}}/><Text style={[styles.logoutText,{marginLeft:0}]}>Đăng xuất</Text></View>
      </Pressable>

      <Text style={styles.version}>PhimMoi v2.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, paddingTop: 40 },
  avatarWrap: { alignItems: 'center', marginBottom: SPACING.xxxl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  avatarText: { color: '#fff', fontSize: FONT.xxl, fontWeight: '800' },
  email: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '600' },
  joinDate: { color: COLORS.textMuted, fontSize: FONT.xs, marginTop: 4 },
  roleBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full, marginTop: SPACING.sm },
  roleBadgeText: { color: '#fff', fontSize: FONT.xs, fontWeight: '800' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, marginBottom: SPACING.xl, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: SPACING.lg },
  menuBorder: { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 20, marginRight: SPACING.md },
  menuLabel: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.md },
  menuArrow: { color: COLORS.textMuted, fontSize: 24, fontWeight: '300' },
  logoutBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: FONT.md, fontWeight: '700' },
  version: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xl, fontSize: FONT.xs },
});
