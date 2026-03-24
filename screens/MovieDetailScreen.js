import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, TextInput, FlatList, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPhimDetail, getPhimImageUrl } from '../services/phimapi';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useCommentsContext } from '../context/CommentsContext';
import { useReportsContext } from '../context/ReportsContext';
import useWatchHistory from '../hooks/useWatchHistory';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/common/GradientButton';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

function RatingStars({ rating, onRate, max = 5 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, marginVertical: 8 }}>
      {[...Array(max)].map((_, i) => (
        <Pressable key={i} onPress={() => onRate && onRate(i + 1)}>
          <Icons.Star 
            size={24} 
            color={i < Math.round(rating) ? "#F5C518" : "rgba(255,255,255,0.1)"} 
          />
        </Pressable>
      ))}
    </View>
  );
}

const { width: SW } = Dimensions.get('window');
const REPORT_REASONS = ['Video không phát', 'Link hỏng', 'Sai phụ đề', 'Chất lượng kém', 'Khác'];

export default function MovieDetailScreen({ route, navigation }) {
  const { slug, id, isSupabase } = route.params || {};
  const { data, isLoading } = useQuery({ 
    queryKey: ['phim-detail', slug, id, isSupabase], 
    queryFn: async () => {
      if (isSupabase) {
        const { supabase } = await import('../integrations/supabase/client');
        const { data: movie } = await supabase.from('movies').select('*').eq('id', id).single();
        if (movie) {
          return {
            movie: {
              ...movie,
              name: movie.title,
              slug: movie.id, // Use ID as slug for history/FAV if slug missing
              origin_name: movie.title,
              category: movie.category ? [{ name: movie.category }] : [],
            },
            episodes: [{
              server_data: [{
                name: 'Full',
                slug: movie.id,
                link_m3u8: movie.video_url
              }]
            }]
          };
        }
      }
      return getPhimDetail(slug);
    }, 
    enabled: !!slug || !!id 
  });
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { getComments, addComment, deleteComment } = useCommentsContext();
  const { addReport } = useReportsContext();
  const { user, isAdmin } = useAuth();
  const { history, isLoaded } = useWatchHistory();

  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (movie?.id) {
      fetchRatings();
    }
  }, [movie]);

  const fetchRatings = async () => {
    const { supabase } = await import('../integrations/supabase/client');
    const mid = movie.id || movie.slug;
    const { data: all } = await supabase.from('ratings').select('rating').eq('movie_id', mid);
    if (all && all.length > 0) {
      const sum = all.reduce((acc, r) => acc + r.rating, 0);
      setAvgRating(sum / all.length);
      setRatingCount(all.length);
    } else {
      setAvgRating(0);
      setRatingCount(0);
    }
    if (user) {
      const { data: mine } = await supabase.from('ratings').select('rating').eq('movie_id', mid).eq('user_email', user.email).maybeSingle();
      if (mine) setUserRating(mine.rating);
      else setUserRating(0);
    }
  };

  const handleRate = async (val) => {
    if (!user) {
      Alert.alert('Hãy đăng nhập', 'Bạn cần đăng nhập để đánh giá phim.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
      return;
    }
    const { supabase } = await import('../integrations/supabase/client');
    const finalMovieId = movie.id || movie.slug; // Support both UUID and Slug
    
    const { error } = await supabase.from('ratings').upsert({ 
      movie_id: finalMovieId, 
      user_email: user.email, 
      rating: val,
      movie_title: movie.name
    }, { onConflict: 'movie_id,user_email' });

    if (!error) {
      setUserRating(val);
      fetchRatings();
      Alert.alert('Thành công', 'Đã lưu đánh giá ' + val + ' sao của bạn!');
    } else {
      console.error('Rating Error:', error);
      Alert.alert('Lỗi', 'Không thể lưu: ' + (error.message || 'Lỗi kết nối'));
    }
  };

  const [commentText, setCommentText] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const totalEps = episodes[0]?.server_data?.length ?? 0;
  const fav = movie ? isFavorite(movie.slug) : false;
  const comments = movie ? getComments(movie.slug) : [];
  const hasWatched = history.some(h => h.slug === movie?.slug);

  const handleAddComment = () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để bình luận.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
      return;
    }
    if (!commentText.trim()) return;
    addComment(movie.slug, commentText.trim(), user?.email);
    setCommentText('');
  };

  const handleReportOpen = () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để báo cáo.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
      return;
    }
    setShowReport(true);
  };

  const handleReport = () => {
    if (!reportReason) { Alert.alert('Lỗi', 'Vui lòng chọn lý do báo lỗi'); return; }
    addReport(movie.slug, movie.name, reportReason, reportDetail, user?.email);
    Alert.alert('Cảm ơn!', 'Báo cáo lỗi phim của bạn đã được ghi nhận. Cảm ơn sự đóng góp!', [
      { text: 'OK' }
    ]);
    setShowReport(false);
    setReportReason('');
    setReportDetail('');
  };

  const handleFav = () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để lưu phim.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
      return;
    }
    toggleFavorite(movie);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader width={SW} height={300} />
        <View style={{ padding: SPACING.lg }}>
          <SkeletonLoader width="70%" height={26} style={{ marginTop: 16 }} />
          <SkeletonLoader width="50%" height={16} style={{ marginTop: 12 }} />
          <SkeletonLoader width="100%" height={80} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  if (!movie) return <View style={styles.center}><Text style={styles.emptyText}>Không tìm thấy phim</Text></View>;

  const genres = movie.category?.map((c) => c.name).join(', ') || '';
  const countries = movie.country?.map((c) => c.name).join(', ') || '';
  const content = (movie.content || '').replace(/<[^>]*>/g, '');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: getPhimImageUrl(movie.poster_url) }} style={styles.poster} />

      <View style={styles.infoWrap}>
        <Text style={styles.title}>{movie.name}</Text>
        <Text style={styles.originName}>{movie.origin_name}</Text>

        <View style={{flexDirection:'row', alignItems:'center', marginTop: 8}}>
          <RatingStars 
            rating={avgRating} 
            max={5}
            onRate={handleRate}
          />
          <Text style={{color: COLORS.textSecondary, marginLeft: 10, fontSize: FONT.sm}}>{avgRating.toFixed(1)}/5 ({ratingCount} lượt)</Text>
        </View>

        {userRating > 0 && (
          <Text style={{color: COLORS.primary, fontSize: 11, fontStyle: 'italic', marginTop: 2}}>Bạn đã đánh giá {userRating} sao</Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{movie.year}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{movie.quality || 'HD'}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{movie.lang || 'Vietsub'}</Text></View>
          {totalEps > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{totalEps} tập</Text></View>}
        </View>

        {genres ? <View style={{flexDirection:'row',alignItems:'center',marginRight:16}}><Icons.Tag size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genres}>{genres}</Text></View> : null}
        {countries ? <View style={{flexDirection:'row',alignItems:'center'}}><Icons.Globe size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genres}>{countries}</Text></View> : null}

        <View style={styles.actionRow}>
          <GradientButton title="▶  XEM PHIM" onPress={() => {
            if (!user) {
              Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để xem phim.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
              return;
            }
            navigation.navigate('Watch', { slug: movie.slug });
          }} style={{ flex: 1 }} />
          <Pressable style={[styles.iconBtn, fav && styles.iconBtnActive]} onPress={handleFav}>
            <View style={styles.iconBtnText}>{fav ? <Icons.Heart size={24} color="#E50914" /> : <Icons.EmptyHeart size={24} color="#fff" />}</View>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={handleReportOpen}>
            <View style={styles.iconBtnText}><Icons.AlertTriangle size={24} color="#FF6B6B" /></View>
          </Pressable>
        </View>

        {content ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nội dung</Text>
            <Text style={styles.desc}>{content}</Text>
          </View>
        ) : null}

        {/* COMMENTS */}
        <View style={styles.section}>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:SPACING.md}}><Icons.MessageSquare size={20} color={COLORS.textPrimary} style={{marginRight:8}}/><Text style={[styles.sectionTitle,{marginBottom:0}]}>Bình luận ({comments.length})</Text></View>
          
          {hasWatched ? (
            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Viết bình luận..."
                placeholderTextColor={COLORS.textMuted}
                value={commentText}
                onChangeText={setCommentText}
              />
              <Pressable style={styles.commentSend} onPress={handleAddComment}>
                <Text style={styles.commentSendText}>Gửi</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: RADIUS.md, marginBottom: SPACING.md, alignItems: 'center'}}>
              <Icons.Lock size={28} color={COLORS.textMuted} style={{marginBottom: SPACING.sm}} />
              <Text style={{color: COLORS.textSecondary, fontSize: FONT.sm, textAlign: 'center'}}>Bình luận bị khóa.</Text>
              <Text style={{color: COLORS.textMuted, fontSize: FONT.xs, textAlign: 'center', marginTop: 4}}>Bạn phải nhấn "XEM PHIM" ít nhất một lần để có thể bình luận.</Text>
            </View>
          )}
          {comments.map((c) => (
            <View key={c.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{(c.user?.[0] || 'U').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{c.user}</Text>
                  <Text style={styles.commentTime}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</Text>
                </View>
                {(c.user === user?.email || isAdmin) && (
                  <Pressable onPress={() => deleteComment(movie.slug, c.id)}>
                    <View style={styles.commentDelete}><Icons.Trash2 size={16} color="#FF6B6B" /></View>
                  </Pressable>
                )}
              </View>
              <Text style={styles.commentBody}>{c.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* REPORT MODAL */}
      <Modal visible={showReport} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:SPACING.md,justifyContent:'center'}}><Icons.AlertTriangle size={24} color="#FF6B6B" style={{marginRight:8}}/><Text style={[styles.modalTitle,{marginBottom:0}]}>Báo cáo phim</Text></View>
            {REPORT_REASONS.map((r) => (
              <Pressable key={r} style={[styles.reasonBtn, reportReason === r && styles.reasonBtnActive]} onPress={() => setReportReason(r)}>
                <Text style={[styles.reasonText, reportReason === r && styles.reasonTextActive]}>{r}</Text>
              </Pressable>
            ))}
            <TextInput style={styles.reportInput} placeholder="Chi tiết (tùy chọn)..." placeholderTextColor={COLORS.textMuted} value={reportDetail} onChangeText={setReportDetail} multiline />
            <View style={styles.modalActions}>
              <GradientButton title="Gửi" onPress={handleReport} style={{ flex: 1 }} />
              <GradientButton title="Hủy" variant="outline" onPress={() => setShowReport(false)} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyText: { color: COLORS.textSecondary, fontSize: FONT.md },
  poster: { width: SW, height: SW * 1.2, resizeMode: 'cover' },
  infoWrap: { padding: SPACING.lg, marginTop: -40, backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl },
  title: { color: COLORS.textPrimary, fontSize: FONT.xl, fontWeight: '800' },
  originName: { color: COLORS.textSecondary, fontSize: FONT.md, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  badge: { backgroundColor: COLORS.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm },
  badgeText: { color: COLORS.textSecondary, fontSize: FONT.xs, fontWeight: '600' },
  genres: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.sm },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xl, alignItems: 'center' },
  iconBtn: { width: 52, height: 52, borderRadius: RADIUS.md, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center' },
  iconBtnActive: { backgroundColor: COLORS.primaryDark },
  iconBtnText: { fontSize: 22 },
  section: { marginTop: SPACING.xl },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.md },
  desc: { color: COLORS.textSecondary, fontSize: FONT.sm, lineHeight: 22 },
  // Comments
  commentInput: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  commentTextInput: { flex: 1, backgroundColor: COLORS.inputBg, color: COLORS.textPrimary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: FONT.sm },
  commentSend: { backgroundColor: COLORS.primary, paddingHorizontal: 16, borderRadius: RADIUS.md, justifyContent: 'center' },
  commentSendText: { color: '#fff', fontWeight: '700', fontSize: FONT.sm },
  commentCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  commentAvatarText: { color: '#fff', fontWeight: '700', fontSize: FONT.xs },
  commentUser: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: '600' },
  commentTime: { color: COLORS.textMuted, fontSize: FONT.xs },
  commentDelete: { fontSize: 16 },
  commentBody: { color: COLORS.textSecondary, fontSize: FONT.sm, lineHeight: 20 },
  // Report Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.lg, textAlign: 'center' },
  reasonBtn: { padding: 12, borderRadius: RADIUS.sm, backgroundColor: COLORS.card, marginBottom: SPACING.sm },
  reasonBtnActive: { backgroundColor: COLORS.primary },
  reasonText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  reasonTextActive: { color: '#fff', fontWeight: '700' },
  reportInput: { backgroundColor: COLORS.inputBg, color: COLORS.textPrimary, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, minHeight: 60, fontSize: FONT.sm, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
});

