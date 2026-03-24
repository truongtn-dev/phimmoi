import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../integrations/supabase/client';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

// Cloudinary Config
const CLOUD_NAME = "domvpkjum";
const API_KEY = "912613378488499";
// Normally secret should be on server, but user provided for direct client upload
const API_SECRET = "AeYjrEWddeeZfXejpbrvLPNG3_Y"; 

// Simple SHA1 for Cloudinary Signed Upload
function sha1(str) {
  var rotateLeft = function(n, s) { return (n << s) | (n >>> (32 - s)); };
  var cv = function(n) { return ("0000000" + (n >>> 0).toString(16)).substr(-8); };
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  var m = s => s.split('').map(c => c.charCodeAt(0));
  var b = m(str); b.push(0x80); 
  while (((b.length + 8) % 64) !== 0) b.push(0);
  var l = str.length * 8;
  for (var i = 7; i >= 0; i--) b.push((l >>> (i * 8)) & 0xff);
  for (var j = 0; j < b.length; j += 64) {
    var w = new Array(80), a = H[0], b1 = H[1], c = H[2], d = H[3], e = H[4];
    for (var k = 0; k < 80; k++) {
      if (k < 16) w[k] = (b[j+k*4]<<24) | (b[j+k*4+1]<<16) | (b[j+k*4+2]<<8) | (b[j+k*4+3]);
      else w[k] = rotateLeft(w[k-3] ^ w[k-8] ^ w[k-14] ^ w[k-16], 1);
      var f, k1;
      if (k < 20) { f = (b1 & c) | (~b1 & d); k1 = 0; }
      else if (k < 40) { f = b1 ^ c ^ d; k1 = 1; }
      else if (k < 60) { f = (b1 & c) | (b1 & d) | (c & d); k1 = 2; }
      else { f = b1 ^ c ^ d; k1 = 3; }
      var t = (rotateLeft(a, 5) + f + e + K[k1] + w[k]) | 0; e = d; d = c; c = rotateLeft(b1, 30); b1 = a; a = t;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b1) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0;
  }
  return H.map(cv).join('');
}

export default function AdminMoviesScreen() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    poster_url: '', 
    backdrop_url: '',
    trailer_url: '',
    category: '', 
    video_url: '', 
    release_date: ''
  });

  const pickAndUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setIsUploading(true);
      
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = sha1(`timestamp=${timestamp}${API_SECRET}`);
        
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'poster.jpg',
        });
        formData.append('api_key', API_KEY);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (data.secure_url) {
          setForm(prev => ({ ...prev, poster_url: data.secure_url }));
          Alert.alert('Thành công', 'Đã tải ảnh lên Cloudinary');
        } else {
          Alert.alert('Lỗi', data.error?.message || 'Không thể tải ảnh');
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Lỗi kết nối Cloudinary');
      } finally {
        setIsUploading(false);
      }
    }
  };

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
      backdrop_url: form.backdrop_url,
      trailer_url: form.trailer_url,
      category: form.category,
      release_date: form.release_date,
      video_url: form.video_url || ''
    };

    if (editingMovie) {
      delete payload.slug; // Don't change slug on edit
      const { error } = await supabase.from('movies').update(payload).eq('id', editingMovie.id);
      if (error) Alert.alert('Lỗi', error.message);
      else { 
        Alert.alert('Thành công', 'Đã cập nhật phim'); 
        setModalVisible(false); 
        fetchMovies(); 
      }
    } else {
      const { error } = await supabase.from('movies').insert([payload]);
      if (error) Alert.alert('Lỗi', error.message);
      else { 
        Alert.alert('Thành công', 'Đã thêm phim mới. Đang quay về Trang chủ...'); 
        setModalVisible(false); 
        navigation.navigate('Main', { screen: 'HomeTab' }); // Back to Home
      }
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
      setForm({ 
        title: movie.title, 
        description: movie.description || '', 
        poster_url: movie.poster_url || '', 
        backdrop_url: movie.backdrop_url || '',
        trailer_url: movie.trailer_url || '',
        category: movie.category || '', 
        video_url: movie.video_url || '',
        release_date: movie.release_date || ''
      });
    } else {
      setEditingMovie(null);
      setForm({ 
        title: '', description: '', poster_url: '', backdrop_url: '', 
        trailer_url: '', category: '', video_url: '', release_date: '' 
      });
    }
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.poster_url || 'https://via.placeholder.com/150' }} style={styles.itemPoster} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>{item.category || 'No Category'} • ⭐ {item.rating}</Text>
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
        <View style={styles.center}><Text style={styles.empty}>Chưa có phim trong hệ thống</Text></View>
      ) : (
        <FlatList 
          data={movies} 
          keyExtractor={i => i.id.toString()} 
          renderItem={renderItem} 
          contentContainerStyle={{ paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false} 
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMovie ? 'Sửa Phim' : 'Thêm Phim Mới'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Tên phim *</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={t => setForm({...form, title: t})} placeholderTextColor="#666" placeholder="Nhập tên phim" />
              
              <Text style={styles.label}>Ảnh Poster *</Text>
              <View style={styles.uploadContainer}>
                {form.poster_url ? (
                  <Image source={{ uri: form.poster_url }} style={styles.posterPreview} />
                ) : (
                  <View style={styles.posterPlaceholder}>
                    <Icons.ImageIcon size={32} color={COLORS.textMuted} />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Pressable 
                    onPress={pickAndUploadImage} 
                    style={[styles.uploadBtn, isUploading && { opacity: 0.6 }]} 
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Icons.Camera size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.uploadBtnText}>Tải ảnh lên</Text>
                      </>
                    )}
                  </Pressable>
                  <Text style={styles.uploadHint}>Hoặc dán URL bên dưới</Text>
                </View>
              </View>
              <TextInput style={styles.input} value={form.poster_url} onChangeText={t => setForm({...form, poster_url: t})} placeholderTextColor="#666" placeholder="https://..." />
              
              <Text style={styles.label}>Link Ảnh Backdrop (URL)</Text>
              <TextInput style={styles.input} value={form.backdrop_url} onChangeText={t => setForm({...form, backdrop_url: t})} placeholderTextColor="#666" placeholder="https://..." />

              <Text style={styles.label}>Link Video hoặc Iframe (YouTube/HLS)</Text>
              <TextInput style={styles.input} value={form.video_url} onChangeText={t => setForm({...form, video_url: t})} placeholderTextColor="#666" placeholder="Movie stream link" />

              <Text style={styles.label}>Link Trailer (YouTube)</Text>
              <TextInput style={styles.input} value={form.trailer_url} onChangeText={t => setForm({...form, trailer_url: t})} placeholderTextColor="#666" placeholder="Trailer link" />

              <Text style={styles.label}>Thể loại</Text>
              {categories.length === 0 ? (
                <Text style={{color: COLORS.textMuted, fontSize: FONT.sm, fontStyle: 'italic'}}>Chưa có thể loại nào.</Text>
              ) : (
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4}}>
                  {categories.map(c => (
                    <Pressable key={c.id} onPress={() => setForm({...form, category: c.name})} style={[styles.chip, form.category === c.name && styles.chipActive]}>
                      <Text style={[styles.chipText, form.category === c.name && styles.chipTextActive]}>{c.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              
              <Text style={styles.label}>Ngày phát hành</Text>
              <Pressable 
                style={[styles.input, { justifyContent: 'center' }]} 
                onPress={() => setDateModalVisible(true)}
              >
                <Text style={{ color: form.release_date ? COLORS.textPrimary : '#666' }}>
                  {form.release_date || 'Chọn ngày phát hành'}
                </Text>
                <Icons.Calendar size={18} color={COLORS.textMuted} style={{ position: 'absolute', right: 12 }} />
              </Pressable>
              
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
      <Modal visible={dateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: 400 }]}>
            <Text style={styles.modalTitle}>Chọn Năm Phát Hành</Text>
            <ScrollView>
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <Pressable 
                  key={year} 
                  style={styles.dateItem} 
                  onPress={() => {
                    setForm({ ...form, release_date: `${year}-01-01` });
                    setDateModalVisible(false);
                  }}
                >
                  <Text style={styles.dateText}>{year}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setDateModalVisible(false)}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Đóng</Text>
            </Pressable>
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
  itemPoster: { width: 40, height: 60, borderRadius: RADIUS.sm, backgroundColor: COLORS.card },
  uploadContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 12, borderRadius: RADIUS.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  posterPreview: { width: 60, height: 90, borderRadius: RADIUS.sm },
  posterPlaceholder: { width: 60, height: 90, borderRadius: RADIUS.sm, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  uploadBtn: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: RADIUS.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  uploadBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT.sm },
  uploadHint: { color: COLORS.textMuted, fontSize: 10, marginTop: 8, fontStyle: 'italic' },
  dateItem: { padding: SPACING.md, borderBottomColor: 'rgba(255,255,255,0.05)', borderBottomWidth: 1, alignItems: 'center' },
  dateText: { color: COLORS.textPrimary, fontSize: FONT.md },
  closeBtn: { marginTop: SPACING.md, padding: SPACING.md, alignItems: 'center' },
});

