import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPhimMoiCapNhat, getPhimList } from '../services/phimapi';
import HeroBanner from '../components/movies/HeroBanner';
import CategoryRow from '../components/movies/CategoryRow';
import { BannerSkeleton } from '../components/common/SkeletonLoader';
import { COLORS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function HomeScreen({ navigation }) {
  const newMovies = useQuery({ queryKey: ['phim-moi'], queryFn: () => getPhimMoiCapNhat(1) });
  const phimBo = useQuery({ queryKey: ['phim-bo'], queryFn: () => getPhimList('phim-bo', 1, 20) });
  const phimLe = useQuery({ queryKey: ['phim-le'], queryFn: () => getPhimList('phim-le', 1, 20) });
  const hoatHinh = useQuery({ queryKey: ['hoat-hinh'], queryFn: () => getPhimList('hoat-hinh', 1, 20) });
  const tvShows = useQuery({ queryKey: ['tv-shows'], queryFn: () => getPhimList('tv-shows', 1, 20) });

  const adminMovies = useQuery({ 
    queryKey: ['phim-admin'], 
    queryFn: async () => {
      const { supabase } = await import('../integrations/supabase/client');
      const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const newItems = newMovies.data?.items ?? [];
  const heroMovie = adminMovies.data?.[0] || newItems[0];

  const navigateDetail = (item) => {
    if (item.id) navigation.navigate('MovieDetail', { id: item.id, isSupabase: true });
    else navigation.navigate('MovieDetail', { slug: item.slug });
  };

  const refetch = () => {
    newMovies.refetch();
    phimBo.refetch();
    phimLe.refetch();
    hoatHinh.refetch();
    tvShows.refetch();
    adminMovies.refetch();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={COLORS.primary} />}
      >
        {newMovies.isLoading ? (
          <BannerSkeleton />
        ) : (
          <HeroBanner
            movie={heroMovie}
            onPlay={() => {
              if (heroMovie.id) navigation.navigate('Watch', { id: heroMovie.id, isSupabase: true });
              else navigation.navigate('Watch', { slug: heroMovie.slug });
            }}
            onInfo={() => navigateDetail(heroMovie)}
          />
        )}

        <CategoryRow
          title="Phim Đặc Sắc"
          icon={<Icons.Star size={20} color="#FFD700" />}
          movies={adminMovies.data}
          isLoading={adminMovies.isLoading}
          onMoviePress={navigateDetail}
        />

        <CategoryRow
          title="Mới Cập Nhật"
          icon={<Icons.Flame size={20} color="#E50914" />}
          movies={newItems.slice(1, 21)}
          isLoading={newMovies.isLoading}
          onMoviePress={navigateDetail}
        />

        <CategoryRow
          title="Phim Bộ"
          icon={<Icons.Monitor size={20} color="#1E90FF" />}
          movies={phimBo.data?.data?.items}
          isLoading={phimBo.isLoading}
          onMoviePress={navigateDetail}
        />

        <CategoryRow
          title="Phim Lẻ"
          icon={<Icons.Film size={20} color="#F5C518" />}
          movies={phimLe.data?.data?.items}
          isLoading={phimLe.isLoading}
          onMoviePress={navigateDetail}
        />

        <CategoryRow
          title="Hoạt Hình"
          icon={<Icons.Sparkles size={20} color="#46D369" />}
          movies={hoatHinh.data?.data?.items}
          isLoading={hoatHinh.isLoading}
          onMoviePress={navigateDetail}
        />

        <CategoryRow
          title="TV Shows"
          icon={<Icons.Radio size={20} color="#9C27B0" />}
          movies={tvShows.data?.data?.items}
          isLoading={tvShows.isLoading}
          onMoviePress={navigateDetail}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});

