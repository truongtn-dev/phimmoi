import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Linking, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Video } from 'expo-av';
import { getPhimDetail } from '../services/phimapi';

export default function WatchScreen({ route, navigation }) {
  const { slug } = route.params || {};
  const { data, isLoading } = useQuery(['phim-watch', slug], () => getPhimDetail(slug), { enabled: !!slug });
  
  const video = useRef(null);
  const [loading, setLoading] = useState(false);

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const currentServer = episodes[0];
  const visibleEps = currentServer?.server_data?.slice(0, 50) ?? [];

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading...</Text></View>;
  if (!movie) return <View style={styles.center}><Text>Không tìm thấy phim</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{movie.name}</Text>
      <View style={styles.videoPlaceholder}>
         <Text style={styles.placeholderText}>Chọn tập phim bên dưới để xem</Text>
      </View>
      <FlatList 
        data={visibleEps} 
        keyExtractor={(e) => e.slug} 
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => { 
                if (item.link_embed) Linking.openURL(item.link_embed); 
            }} 
            style={styles.epBtn}
          >
            <Text style={styles.epText}>{item.name}</Text>
          </Pressable>
        )} 
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, padding: 16, backgroundColor: '#fff' }, 
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 16 }, 
  videoPlaceholder: { width: '100%', height: 200, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 16 },
  placeholderText: { color: '#fff' },
  center: { flex:1, justifyContent:'center', alignItems:'center' }, 
  epBtn: { padding: 12, borderRadius: 8, backgroundColor: '#f0f0f0', marginBottom: 10 }, 
  epText: { color: '#333', fontWeight: '500' } 
});
