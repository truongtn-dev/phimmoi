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
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const PLAYER_H = (SCREEN_W - SPACING.lg * 2) * 9 / 16;

const getYTId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

function PlayerView({ url, onUpdate, initialTime }) {
  const ytId = getYTId(url);
  const updateRef = useRef(onUpdate);
  updateRef.current = onUpdate;

  const playerRef = useRef(null);

  // --- YOUTUBE PLAYER ---
  if (ytId) {
    return (
      <View style={[styles.videoPlayer, { height: PLAYER_H }]}>
        <YoutubePlayer
          ref={playerRef}
          height={PLAYER_H}
          videoId={ytId}
          play={true}
          initialPlayerParams={{ 
            start: Math.floor(initialTime),
            modestbranding: 1,
            rel: 0
          }}
        />
        <YouTubeTracker playerRef={playerRef} onUpdate={(t, d) => updateRef.current(t, d)} />
      </View>
    );
  }

  // --- STANDARD PLAYER ---
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
        player.currentTime = initialTime;
        const current = player.currentTime || 0;
        if (Math.abs(current - initialTime) < 5) seekDone.current = true;
      } catch (e) {}
    };
    const interval = setInterval(performSeek, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [player, initialTime]);

  useEffect(() => {
    if (!player) return;
    const sub = player.addListener('playingChange', (isPlaying) => {
      try {
        if (player.status === 'readyToPlay') updateRef.current(player.currentTime, player.duration);
      } catch (e) {}
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if (player?.status === 'readyToPlay' && player.playing) {
          updateRef.current(player.currentTime, player.duration);
        }
      } catch (e) {}
    }, 10000); 
    return () => clearInterval(interval);
  }, [player]);

  return <VideoView style={styles.videoPlayer} player={player} allowsFullscreen allowsPictureInPicture />;
}

function YouTubeTracker({ playerRef, onUpdate }) {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (playerRef.current) {
        try {
          const time = await playerRef.current.getCurrentTime();
          const duration = await playerRef.current.getDuration();
          onUpdate(time, duration);
        } catch (e) {}
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return null;
}

export default function WatchScreen({ route, navigation }) {
  const { user } = useAuth();
  const { slug, id, isSupabase } = route.params || {};
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['phim-watch', slug, id, isSupabase], 
    queryFn: async () => {
      if (isSupabase) {
        const { supabase } = await import('../integrations/supabase/client');
        const { data: movie } = await supabase.from('movies').select('*').eq('id', id).single();
        if (movie) {
          const supabaseEps = (movie.episodes && Array.isArray(movie.episodes) && movie.episodes.length > 0)
            ? movie.episodes.map(e => ({ name: e.name, slug: e.name, link_m3u8: e.link }))
            : [{ name: 'Full', slug: 'full', link_m3u8: movie.video_url }];

          return {
            movie: { 
              ...movie, 
              name: movie.title, 
              slug: movie.id, 
              content: movie.description // Map description to content
            },
            episodes: [{ server_data: supabaseEps }]
          };
        }
      }
      return getPhimDetail(slug);
    }, 
    enabled: !!slug || !!id 
  });

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
    if (movie && visibleEps.length > 0 && isLoaded && !currentVideoUrl) {
      const historyEntry = getProgress(movie.slug);
      let targetEp = visibleEps[0];
      let resumeTime = 0;

      if (historyEntry && historyEntry.episode) {
        const getNum = (s) => (s.toString().match(/\d+/) || [null])[0];
        const targetNum = getNum(historyEntry.episode);
        const found = visibleEps.find(e => e.name === historyEntry.episode || (targetNum && getNum(e.name) === targetNum));
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

  const handleUpdate = React.useCallback((time, duration) => {
    if (movie && currentEpName && time > 0) {
      saveProgress(movie, currentEpName, time, duration);
    }
  }, [movie, currentEpName, saveProgress]);

  const handleSelectEp = (item) => {
    setCurrentVideoUrl(item.link_m3u8);
    setCurrentEpName(item.name);
    setInitialSeek(0);
    saveProgress(movie, item.name, 0, 0);
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!movie) return <View style={styles.center}><Text style={styles.emptyText}>Không tìm thấy phim</Text></View>;

  const content = (movie?.content || '').replace(/<[^>]*>/g, '');
  const genres = Array.isArray(movie?.category) 
    ? movie.category.map((c) => c.name).join(', ') 
    : (movie?.category || ''); // Handle string category from Supabase

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{flexDirection:'row', alignItems:'center', marginBottom: SPACING.md}}>
        <Pressable onPress={() => navigation.goBack()} style={{padding: 4, marginRight: 8}}><ChevronLeft size={24} color="#fff"/></Pressable>
        <Text style={[styles.heading, {marginBottom:0, flex: 1}]}>{movie.name}</Text>
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
  videoPlayer: { width: '100%', height: PLAYER_H, backgroundColor: '#000', borderRadius: RADIUS.md, marginBottom: SPACING.lg, overflow: 'hidden' },
  videoPlaceholder: { width: '100%', height: PLAYER_H, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderRadius: RADIUS.md, marginBottom: SPACING.lg },
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

