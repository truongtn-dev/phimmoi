import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../integrations/supabase/client';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function AdminCategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [form, setForm] = useState({ name: '', slug: '' });

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (!error && data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên thể loại');
    
    // Auto generate slug if empty
    const finalSlug = form.slug.trim() ? form.slug.trim() : generateSlug(form.name);

    if (editingCat) {
      const { error } = await supabase.from('categories').update({ name: form.name.trim(), slug: finalSlug }).eq('id', editingCat.id);
      if (error) Alert.alert('Lỗi', error.message);
      else { Alert.alert('Thành công', 'Đã cập nhật thể loại'); setModalVisible(false); fetchCategories(); }
    } else {
      const { error } = await supabase.from('categories').insert([{ name: form.name.trim(), slug: finalSlug }]);
      if (error) Alert.alert('Lỗi', error.message);
      else { Alert.alert('Thành công', 'Đã thêm thể loại mới'); setModalVisible(false); fetchCategories(); }
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá thể loại này?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: async () => {
          await supabase.from('categories').delete().eq('id', id);
          fetchCategories();
      }}
    ]);
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setForm({ name: cat.name, slug: cat.slug });
    } else {
      setEditingCat(null);
      setForm({ name: '', slug: '' });
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.slug}>{item.slug}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => openModal(item)} style={styles.actionBtn}>
          <Icons.Edit size={18} color={COLORS.primary} />
        </Pressable>
        <Pressable onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { marginLeft: 8 }]}>
          <Icons.Trash2 size={18} color="#FF6B6B" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.addBtn} onPress={() => openModal()}>
        <Icons.Plus size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.addBtnText}>Thêm Thể Loại Mới</Text>
      </Pressable>

      <Text style={styles.warning}>Chú ý: Form quản lý Thể loại tự do. Tuy nhiên phần lớn phim đang load từ API ngoại (OPhim). Nếu bạn muốn map đúng, hãy đặt Slug khớp với máy chủ OPhim.</Text>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : categories.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Chưa có danh mục nào (hãy chạy file .sql trước)</Text></View>
      ) : (
        <FlatList data={categories} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCat ? 'Sửa Thể Loại' : 'Thêm Thể Loại'}</Text>
            
            <Text style={styles.label}>Tên chuyên mục *</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="VD: Phim Chiếu Rạp" placeholderTextColor="#666" />
            
            <Text style={styles.label}>Slug liên kết (Bỏ trống để tự tạo)</Text>
            <TextInput style={styles.input} value={form.slug} onChangeText={t => setForm({...form, slug: t})} placeholder="VD: phim-chieu-rap" placeholderTextColor="#666" autoCapitalize="none" />
            
            <View style={styles.modalFooter}>
              <Pressable style={[styles.modalBtn, { backgroundColor: COLORS.surface }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Huỷ</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: COLORS.primary, marginLeft: 10 }]} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Lưu</Text>
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
  warning: { color: COLORS.textSecondary, fontSize: FONT.xs, marginBottom: SPACING.lg, lineHeight: 18, fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.05)', padding: SPACING.md, borderRadius: RADIUS.md },
  addBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT.md },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  name: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700' },
  slug: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.sm },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.xl },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.lg, textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: FONT.sm, marginBottom: 4, marginTop: SPACING.sm },
  input: { backgroundColor: COLORS.surface, color: COLORS.textPrimary, padding: SPACING.md, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  modalFooter: { flexDirection: 'row', marginTop: SPACING.xl, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: RADIUS.md },
});

