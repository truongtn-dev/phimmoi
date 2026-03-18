import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

export default function FavoritesScreen({ navigation }) {
  const { user } = useAuth();

  const { data: favorites, isLoading } = useQuery(['favorites', user?.id], async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('favorites').select('*, movies(*)').eq('user_id', user.id);
    if (error) throw error;
    return data;
  }, { enabled: !!user });

  const list = favorites?.map((f) => f.movies).filter(Boolean) ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorites</Text>
      <FlatList data={list} keyExtractor={(i) => i._id ?? i.id} renderItem={({ item }) => <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })} />} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, heading: { fontSize: 20, fontWeight: '700', marginBottom: 8 } });
