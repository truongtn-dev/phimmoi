import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Pressable, Modal, TextInput, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roles, error: rError } = await supabase.from('user_roles').select('*');
    if (!pError && profiles) {
      const merged = profiles.map(p => {
        const roleRecord = roles?.find(r => r.user_id === p.user_id);
        return { ...p, role: roleRecord ? roleRecord.role : 'user' };
      });
      setUsers(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || '', email: '', password: '' }); // We only edit Name and Role for existing
    setModalVisible(true);
  };

  const handleUpdateInfoAndRole = async (newRole) => {
    setIsUpdating(true);
    try {
      // 1. Update Profile Name
      if (form.name.trim() !== editingUser.name) {
        const { error: nameError } = await supabase.from('profiles').update({ name: form.name.trim() }).eq('user_id', editingUser.user_id);
        if (nameError) throw new Error('Lỗi cập nhật tên: Hãy chạy file SQL Migration cấp quyền Update cho Admin!');
      }

      // 2. Update Role
      const { error: roleError } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', editingUser.user_id);
      if (roleError) throw new Error('Không thể cấp quyền: ' + roleError.message);
      
      Alert.alert('Thành công', `Cập nhật thông tin cho ${form.name.trim()} hoàn tất!`);
      setModalVisible(false);
      fetchUsers();
    } catch (e) { Alert.alert('Lỗi', e.message); } finally { setIsUpdating(false); }
  };

  const handleCreateUser = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) return Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');
    if (form.password.length < 6) return Alert.alert('Lỗi', 'Mật khẩu phải từ 6 ký tự');
    setIsUpdating(true);
    try {
      const tempClient = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL || '', process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '', { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await tempClient.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { name: form.name.trim() } }
      });
      if (error) { Alert.alert('Tạo thất bại', error.message); } 
      else { Alert.alert('Thành công', 'Đã tạo tài khoản người dùng mới!'); setAddModalVisible(false); setForm({ name: '', email: '', password: '' }); fetchUsers(); }
    } catch (e) { Alert.alert('Lỗi', e.message); } finally { setIsUpdating(false); }
  };

  const attemptDelete = (user) => {
    if (user.role === 'admin') return Alert.alert('Từ chối', 'Không thể xóa Admin khác khỏi hệ thống Frontend.');
    Alert.alert('Từ chối truy cập', 'Kiến trúc bảo mật của Supabase bảo vệ bảng Auth chặt chẽ. Hãy thực hiện xóa tại Authentication Dashboard của Supabase Backend.', [{text: 'Đã hiểu'}]);
  };

  const renderItem = ({ item }) => {
    const isSelf = currentUser?.id === item.user_id;

    return (
      <View style={styles.card}>
        <View style={[styles.avatar, item.role === 'admin' && styles.avatarAdmin]}>
          <Text style={styles.avatarText}>{(item.name?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={styles.name}>{item.name}</Text>
            {item.role === 'admin' && <View style={styles.badge}><Text style={styles.badgeText}>ADMIN</Text></View>}
            {isSelf && <View style={[styles.badge, {backgroundColor: 'rgba(255,255,255,0.1)'}]}><Text style={[styles.badgeText, {color: COLORS.textMuted}]}>BẠN</Text></View>}
          </View>
          <Text style={styles.meta}>Tham gia: {new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
        </View>
        <Pressable onPress={() => handleEditUser(item)} style={[styles.actionBtn, {backgroundColor: 'rgba(30,144,255,0.1)'}]}>
          <Icons.Edit size={18} color="#1E90FF" />
        </Pressable>
        {!isSelf && item.role !== 'admin' && (
          <Pressable onPress={() => attemptDelete(item)} style={[styles.actionBtn, {backgroundColor: 'rgba(255,107,107,0.1)', marginLeft: 8}]}>
            <Icons.Trash2 size={18} color="#FF6B6B" />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.addBtn} onPress={() => { setForm({name:'', email:'', password:''}); setAddModalVisible(true); }}>
        <Icons.Plus size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.addBtnText}>Thêm Người Dùng</Text>
      </Pressable>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : users.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Chưa có người dùng nào</Text></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Edit User Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa Thành Viên</Text>
            {editingUser?.user_id === currentUser?.id ? (
              <Text style={{color: COLORS.textMuted, marginBottom: SPACING.md}}>Bạn đang tự chỉnh sửa tài khoản của mình.</Text>
            ) : null}

            <Text style={styles.label}>Tên hiển thị</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="Nhập tên" placeholderTextColor="#666" />
            
            {! (editingUser?.user_id === currentUser?.id) && (
              <View style={{flexDirection:'column', gap: SPACING.sm, marginTop: SPACING.lg}}>
                <Text style={styles.label}>Phân quyền (Role hiện tại: {editingUser?.role?.toUpperCase()})</Text>
                <Pressable style={[styles.roleBtn, editingUser?.role === 'admin' && styles.roleBtnActive]} onPress={() => handleUpdateInfoAndRole('admin')} disabled={isUpdating}>
                  <Icons.Shield size={20} color={editingUser?.role === 'admin' ? '#fff' : COLORS.textPrimary} />
                  <Text style={[styles.roleBtnText, editingUser?.role === 'admin' && {color: '#fff'}]}>Lưu Tên & Cấp quyền Admin</Text>
                </Pressable>
                <Pressable style={[styles.roleBtn, editingUser?.role === 'user' && styles.roleBtnActiveUser]} onPress={() => handleUpdateInfoAndRole('user')} disabled={isUpdating}>
                  <Icons.User size={20} color={editingUser?.role === 'user' ? '#fff' : COLORS.textPrimary} />
                  <Text style={[styles.roleBtnText, editingUser?.role === 'user' && {color: '#fff'}]}>Lưu Tên & Hạ quyền User</Text>
                </Pressable>
              </View>
            )}

            {editingUser?.user_id === currentUser?.id && (
              <Pressable style={[styles.roleBtn, {justifyContent:'center', marginTop: SPACING.md, backgroundColor: COLORS.primary, borderColor: COLORS.primary}]} onPress={() => handleUpdateInfoAndRole(editingUser.role)}>
                <Text style={{color: '#fff', fontWeight:'700'}}>Lưu thông tin</Text>
              </Pressable>
            )}

            <Pressable style={{marginTop: SPACING.xl, padding: SPACING.md, alignItems:'center'}} onPress={() => setModalVisible(false)} disabled={isUpdating}>
              <Text style={{color: COLORS.textMuted, fontWeight:'600'}}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add User Modal */}
      <Modal visible={addModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Người Dùng</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Tên hiển thị</Text>
              <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="Nguyễn Văn A" placeholderTextColor="#666" />
              
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({...form, email: t})} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#666" />
              
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput style={styles.input} value={form.password} onChangeText={t => setForm({...form, password: t})} placeholder="Tối thiểu 6 ký tự" secureTextEntry placeholderTextColor="#666" />
            </ScrollView>
            <View style={{flexDirection: 'row', marginTop: SPACING.xl, justifyContent: 'flex-end', gap: SPACING.md}}>
              <Pressable style={{padding: SPACING.md}} onPress={() => setAddModalVisible(false)}>
                <Text style={{color: COLORS.textMuted, fontWeight:'600'}}>Huỷ</Text>
              </Pressable>
              <Pressable style={{backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.md}} onPress={handleCreateUser} disabled={isUpdating}>
                <Text style={{color: '#fff', fontWeight:'700'}}>{isUpdating ? 'Đang tạo...' : 'Xác nhận tạo'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: COLORS.textMuted },
  addBtn: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  addBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: FONT.md },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarAdmin: { backgroundColor: '#E50914' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: FONT.md },
  name: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700' },
  badge: { backgroundColor: 'rgba(229,9,20,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  badgeText: { color: '#E50914', fontSize: 9, fontWeight: '800' },
  meta: { color: COLORS.textSecondary, fontSize: FONT.xs, marginTop: 4 },
  actionBtn: { padding: 10, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: SPACING.xl },
  modalContent: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.xl },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.sm },
  label: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.sm, marginBottom: 4 },
  input: { backgroundColor: COLORS.surface, color: COLORS.textPrimary, padding: SPACING.md, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  roleBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  roleBtnActive: { backgroundColor: '#E50914', borderColor: '#E50914' },
  roleBtnActiveUser: { backgroundColor: '#46D369', borderColor: '#46D369' },
  roleBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: FONT.md },
});

