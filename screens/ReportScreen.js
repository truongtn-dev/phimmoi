import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useReportsContext } from '../context/ReportsContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function ReportScreen({ navigation }) {
  const { reports, deleteReport } = useReportsContext();
  const { user, isAdmin } = useAuth(); // Assume only admins or managers see this? Wait, Profile Screen also links here
  
  const filteredReports = isAdmin ? reports : reports.filter(r => r.user === user?.email);

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn đã xử lý báo cáo này và muốn xóa?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteReport(id) }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.movieName}>{item.name}</Text>
        <Text style={styles.reason}><Text style={{fontWeight: '700', color: COLORS.textPrimary}}>Lý do:</Text> {item.reason}</Text>
        {!!item.detail && <Text style={styles.detail}>"{item.detail}"</Text>}
        
        <View style={styles.footer}>
          <Text style={styles.meta}>Người báo: {item.user}</Text>
          <Text style={styles.meta}>{new Date(item.createdAt).toLocaleDateString('vi-VN')} {new Date(item.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
        </View>
      </View>
      
      {isAdmin && (
        <Pressable onPress={() => handleDelete(item.id)} style={styles.btnAction}>
          <Icons.CheckCircle size={24} color="#46D369" />
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {filteredReports.length === 0 ? (
        <View style={styles.center}>
          <Icons.CheckCircle size={48} color={COLORS.textMuted} style={{marginBottom: SPACING.md}}/>
          <Text style={styles.empty}>{isAdmin ? "Tuyệt vời! Không có báo cáo lỗi nào." : "Bạn chưa báo cáo bộ phim nào."}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SPACING.lg }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: COLORS.textSecondary, fontSize: FONT.md },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.lg, flexDirection: 'row', alignItems: 'center' },
  movieName: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '800', marginBottom: SPACING.xs },
  reason: { color: '#FF6B6B', fontSize: FONT.sm, marginBottom: 4 },
  detail: { color: COLORS.textSecondary, fontSize: FONT.sm, fontStyle: 'italic', marginBottom: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  meta: { color: COLORS.textMuted, fontSize: FONT.xs },
  btnAction: { marginLeft: SPACING.md, padding: SPACING.sm, backgroundColor: 'rgba(70,211,105,0.1)', borderRadius: RADIUS.sm },
});
