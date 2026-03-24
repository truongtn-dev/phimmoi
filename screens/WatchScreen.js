import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getPhimDetail, getPhimMoiCapNhat, getPhimImageUrl } from '../services/phimapi';
import useWatchHistory from '../hooks/useWatchHistory';
import CategoryRow from '../components/CategoryRow';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import * as Icons from '../components/ui/icons';

import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

function PlayerView({ url, onPause }) {
  const player = useVideoPlayer(url);
  React.useEffect(() => { if (player) player.play(); }, [player]);
  
  // Save progress when user pauses
  React.useEffect(() => {
    if (!player) return;
    const subscription = player.addListener('playingChange', (isPlaying) => {
      if (!isPlaying && onPause) {
         onPause(player.currentTime);
      }
    });
    return () => {
      subscription.remove();
    };
  }, [player, onPause]);

  return <VideoView style={styles.videoPlayer} player={player} allowsFullscreen allowsPictureInPicture />;
}

export default function WatchScreen({ route, navigation }) {
  const { user } = useAuth();
  const { slug } = route.params || {};
  const { data, isLoading } = useQuery({ queryKey: ['phim-watch', slug], queryFn: () => getPhimDetail(slug), enabled: !!slug });
  const suggested = useQuery({ queryKey: ['suggested'], queryFn: () => getPhimMoiCapNhat(1) });
  const { saveProgress, getProgress } = useWatchHistory();

  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentEpName, setCurrentEpName] = useState('');

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const currentServer = episodes[0];
  const visibleEps = currentServer?.server_data?.slice(0, 50) ?? [];

  React.useEffect(() => {
    if (movie && visibleEps.length > 0 && !currentVideoUrl) {
      const historyEntry = getProgress(movie.slug);
      let targetEp = visibleEps[0];
      if (historyEntry && historyEntry.episode) {
        const found = visibleEps.find(e => e.name === historyEntry.episode);
        if (found) targetEp = found;
      }
      setCurrentVideoUrl(targetEp.link_m3u8);
      setCurrentEpName(targetEp.name);
    }
  }, [movie, visibleEps, currentVideoUrl, getProgress]);
  const content = (movie?.content || '').replace(/<[^>]*>/g, '');
  const genres = movie?.category?.map((c) => c.name).join(', ') || '';

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!movie) return <View style={styles.center}><Text style={styles.emptyText}>Không tìm thấy phim</Text></View>;

  const handleSelectEp = (item) => {
    setCurrentVideoUrl(item.link_m3u8);
    setCurrentEpName(item.name);
    saveProgress(movie, item.name, 0.1);
  };

  const handlePause = (currentTime) => {
    if (movie && currentEpName) {
      saveProgress(movie, currentEpName, currentTime);
    }
  };

  const handleSelectSuggested = (item) => {
    if (!user) {
      Alert.alert('Yêu cầu báo danh', 'Vui lòng đăng nhập để xem phim.', [{ text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }, { text: 'Hủy' }]);
      return;
    }
    navigation.push('Watch', { slug: item.slug });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading} numberOfLines={1}>{movie.name} {currentEpName ? `- ${currentEpName}` : ''}</Text>

      {currentVideoUrl ? (
        <PlayerView url={currentVideoUrl} onPause={handlePause} />
      ) : (
        <View style={styles.videoPlaceholder}>
          <View style={styles.placeholderIcon}><Icons.Film size={48} color={COLORS.border} /></View>
          <Text style={styles.placeholderText}>Chọn tập phim bên dưới để xem</Text>
        </View>
      )}

      {/* Episode Grid */}
      <Text style={styles.sectionTitle}>Danh sách tập ({visibleEps.length})</Text>
      <View style={styles.epGrid}>
        {visibleEps.map((item) => {
          const active = currentVideoUrl === item.link_m3u8;
          return (
            <Pressable key={item.slug} onPress={() => handleSelectEp(item)} style={[styles.epBtn, active && styles.epBtnActive]}>
              <Text style={[styles.epText, active && styles.epTextActive]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Movie Info */}
      {(genres || content) && (
        <View style={styles.infoSection}>
          {genres ? <View style={{flexDirection:'row',alignItems:'center'}}><Icons.Tag size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genresText}>{genres}</Text></View> : null}
          {content ? <Text style={styles.descText} numberOfLines={5}>{content}</Text> : null}
        </View>
      )}

      {/* Suggested Movies */}
      <CategoryRow
        title="Phim Đề Xuất" icon={<Icons.Monitor size={20} color="#1E90FF" />}
        movies={suggested.data?.items?.slice(0, 15)}
        isLoading={suggested.isLoading}
        onMoviePress={handleSelectSuggested}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyText: { color: COLORS.textSecondary },
  heading: { color: COLORS.textPrimary, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.md },
  videoPlayer: { width: '100%', height: 220, backgroundColor: '#000', borderRadius: RADIUS.md, marginBottom: SPACING.lg },
  videoPlaceholder: { width: '100%', height: 220, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderRadius: RADIUS.md, marginBottom: SPACING.lg },
  placeholderIcon: { fontSize: 40, marginBottom: 8 },
  placeholderText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '700', marginBottom: SPACING.md },
  epGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  epBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: RADIUS.sm, backgroundColor: COLORS.card, minWidth: 70, alignItems: 'center' },
  epBtnActive: { backgroundColor: COLORS.primary },
  epText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: FONT.sm },
  epTextActive: { color: '#fff', fontWeight: '700' },
  infoSection: { marginBottom: SPACING.xl },
  genresText: { color: COLORS.textSecondary, fontSize: FONT.sm, marginBottom: SPACING.sm },
  descText: { color: COLORS.textMuted, fontSize: FONT.sm, lineHeight: 20 },
});
