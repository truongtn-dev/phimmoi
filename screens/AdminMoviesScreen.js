import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../integrations/supabase/client';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function AdminMoviesScreen() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [form, setForm] = useState({ title: '', description: '', poster_url: '', category: '', rating: '0' });

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (!error && data) setMovies(data);
    
    // Fetch categories
    const { data: catData } = await supabase.from('categories').select('id, name');
    if (catData) setCategories(catData);

    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên phim');
    
    const payload = {
      title: form.title,
      description: form.description,
      poster_url: form.poster_url,
      category: form.category,
      rating: parseFloat(form.rating) || 0,
    };

    if (editingMovie) {
      const { error } = await supabase.from('movies').update(payload).eq('id', editingMovie.id);
      if (error) Alert.alert('Lỗi', error.message);
      else { Alert.alert('Thành công', 'Đã cập nhật phim'); setModalVisible(false); fetchMovies(); }
    } else {
      const { error } = await supabase.from('movies').insert([payload]);
      if (error) Alert.alert('Lỗi', error.message);
      else { Alert.alert('Thành công', 'Đã thêm phim mới'); setModalVisible(false); fetchMovies(); }
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá phim này?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: async () => {
          await supabase.from('movies').delete().eq('id', id);
          fetchMovies();
      }}
    ]);
  };

  const openModal = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setForm({ title: movie.title, description: movie.description || '', poster_url: movie.poster_url || '', category: movie.category || 'Action', rating: movie.rating?.toString() || '0' });
    } else {
      setEditingMovie(null);
      setForm({ title: '', description: '', poster_url: '', category: 'Action', rating: '0' });
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category} • ⭐ {item.rating}</Text>
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
        <Text style={styles.addBtnText}>Thêm Phim Mới</Text>
      </Pressable>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : movies.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Chưa có phim cơ sở dữ liệu Supabase</Text></View>
      ) : (
        <FlatList data={movies} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMovie ? 'Sửa Phim' : 'Thêm Phim Mới'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Tên phim *</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={t => setForm({...form, title: t})} placeholderTextColor="#666" placeholder="Nhập tên phim" />
              
              <Text style={styles.label}>Thể loại</Text>
              {categories.length === 0 ? (
                <Text style={{color: COLORS.textMuted, fontSize: FONT.sm, fontStyle: 'italic'}}>Chưa có thể loại nào. Hãy tạo trong Quản lý Thể loại.</Text>
              ) : (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4}}>
                  {categories.map(c => (
                    <Pressable 
                      key={c.id} 
                      onPress={() => setForm({...form, category: c.name})}
                      style={[styles.chip, form.category === c.name && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, form.category === c.name && styles.chipTextActive]}>{c.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              
              <Text style={styles.label}>Điểm đánh giá (0-10)</Text>
              <TextInput style={styles.input} value={form.rating} onChangeText={t => setForm({...form, rating: t})} placeholderTextColor="#666" keyboardType="numeric" />
              
              <Text style={styles.label}>Link Ảnh Poster (URL)</Text>
              <TextInput style={styles.input} value={form.poster_url} onChangeText={t => setForm({...form, poster_url: t})} placeholderTextColor="#666" placeholder="https://" />
              
              <Text style={styles.label}>Mô tả</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={form.description} onChangeText={t => setForm({...form, description: t})} multiline placeholderTextColor="#666" />
            </ScrollView>
            
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
  addBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT.md },
  card: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700' },
  meta: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.sm },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.xl, maxHeight: '80%' },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.lg, textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: FONT.sm, marginBottom: 4, marginTop: SPACING.sm },
  input: { backgroundColor: COLORS.surface, color: COLORS.textPrimary, padding: SPACING.md, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  modalFooter: { flexDirection: 'row', marginTop: SPACING.xl, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: RADIUS.md },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  chipTextActive: { color: '#fff', fontWeight: '700' },
});

