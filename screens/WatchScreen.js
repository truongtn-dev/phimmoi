import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getPhimDetail, getPhimMoiCapNhat } from '../services/phimapi';
import useWatchHistory from '../hooks/useWatchHistory';
import CategoryRow from '../components/movies/CategoryRow';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import { Film, Tag, Monitor, ChevronLeft } from '../components/common/icons';
import { useAuth } from '../context/AuthContext';

function PlayerView({ url, onUpdate, initialTime }) {
  const updateRef = useRef(onUpdate);
  updateRef.current = onUpdate;

  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
    p.play();
  });

  const seekDone = useRef(false);

  useEffect(() => {
    if (!player || initialTime <= 0) return;

    const performSeek = () => {
      if (seekDone.current) return;
      try {
        // Android expo-video v3 seek workaround
        player.currentTime = initialTime;
        
        // Some Android devices need multiple attempts as buffer fills
        const current = player.currentTime || 0;
        if (Math.abs(current - initialTime) < 5) {
          seekDone.current = true;
        }
      } catch (e) {}
    };

    // Retry aggressively every 500ms for the first 5 seconds
    const interval = setInterval(performSeek, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [player, initialTime]);

  useEffect(() => {
    if (!player) return;
    const sub = player.addListener('playingChange', (isPlaying) => {
      try {
        if (player.status === 'readyToPlay') {
          updateRef.current(player.currentTime, player.duration);
        }
      } catch (e) {}
    });
    return () => {
      try {
        sub.remove();
      } catch (e) {}
    };
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if (player && player.status === 'readyToPlay' && player.playing) {
          updateRef.current(player.currentTime, player.duration);
        }
      } catch (e) {}
    }, 10000); 
    return () => clearInterval(interval);
  }, [player]);

  return <VideoView style={styles.videoPlayer} player={player} allowsFullscreen allowsPictureInPicture />;
}

export default function WatchScreen({ route, navigation }) {
  const { user } = useAuth();
  const { slug } = route.params || {};
  const { data, isLoading } = useQuery({ queryKey: ['phim-watch', slug], queryFn: () => getPhimDetail(slug), enabled: !!slug });
  const suggested = useQuery({ queryKey: ['suggested'], queryFn: () => getPhimMoiCapNhat(1) });
  const { saveProgress, getProgress, isLoaded } = useWatchHistory();

  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentEpName, setCurrentEpName] = useState('');
  const [initialSeek, setInitialSeek] = useState(0);

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const currentServer = episodes[0];
  const visibleEps = currentServer?.server_data?.slice(0, 50) ?? [];

  useEffect(() => {
    // WAITING FOR: movie data, episode list, AND watch history load
    if (movie && visibleEps.length > 0 && isLoaded && !currentVideoUrl) {
      const historyEntry = getProgress(movie.slug);
      let targetEp = visibleEps[0];
      let resumeTime = 0;

      if (historyEntry && historyEntry.episode) {
        // Fuzzy match: check name or extracted number to handle 'Tap 1' vs 'Tap 01'
        const getNum = (s) => (s.toString().match(/\d+/) || [null])[0];
        const targetNum = getNum(historyEntry.episode);

        const found = visibleEps.find(e => {
          if (e.name === historyEntry.episode) return true;
          if (targetNum && getNum(e.name) === targetNum) return true;
          return false;
        });

        if (found) {
          targetEp = found;
          resumeTime = historyEntry.progress || 0;
        }
      }
      setCurrentVideoUrl(targetEp.link_m3u8);
      setCurrentEpName(targetEp.name);
      setInitialSeek(resumeTime);
    }
  }, [movie, visibleEps, currentVideoUrl, getProgress, isLoaded]);

  // STABLE Update function
  const handleUpdate = React.useCallback((time, duration) => {
    if (movie && currentEpName && time > 0) {
      saveProgress(movie, currentEpName, time, duration);
    }
  }, [movie, currentEpName, saveProgress]);

  const handleSelectEp = (item) => {
    setCurrentVideoUrl(item.link_m3u8);
    setCurrentEpName(item.name);
    setInitialSeek(0); // Mới chọn tập thì xem từ đầu
    saveProgress(movie, item.name, 0, 0);
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!movie) return <View style={styles.center}><Text style={styles.emptyText}>Không tìm thấy phim</Text></View>;

  const content = (movie?.content || '').replace(/<[^>]*>/g, '');
  const genres = movie?.category?.map((c) => c.name).join(', ') || '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{flexDirection:'row', alignItems:'center', marginBottom: SPACING.md}}>
        <Pressable onPress={() => navigation.goBack()} style={{padding: 4, marginRight: 8}}><ChevronLeft size={24} color="#fff"/></Pressable>
        <Text style={[styles.heading, {marginBottom:0}]} numberOfLines={1}>{movie.name}</Text>
      </View>

      {currentVideoUrl ? (
        <PlayerView 
          key={currentVideoUrl} // Reset player component when URL changes
          url={currentVideoUrl} 
          initialTime={initialSeek} 
          onUpdate={handleUpdate} 
        />
      ) : (
        <View style={styles.videoPlaceholder}>
          <Film size={48} color={COLORS.border} />
          <Text style={styles.placeholderText}>Chọn tập phim bên dưới để xem</Text>
        </View>
      )}

      {/* Episode Grid */}
      <Text style={[styles.sectionTitle, {marginTop: SPACING.lg}]}>
        Đang phát: <Text style={{color: COLORS.primary}}>{currentEpName}</Text>
      </Text>
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
          {genres ? <View style={{flexDirection:'row',alignItems:'center'}}><Tag size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genresText}>{genres}</Text></View> : null}
          {content ? <Text style={styles.descText} numberOfLines={5}>{content}</Text> : null}
        </View>
      )}

      {/* Suggested Movies */}
      <CategoryRow
        title="Phim Đề Xuất" icon={<Monitor size={20} color="#1E90FF" />}
        movies={suggested.data?.items?.slice(0, 15)}
        isLoading={suggested.isLoading}
        onMoviePress={(item) => navigation.push('Watch', { slug: item.slug })}
      />
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

