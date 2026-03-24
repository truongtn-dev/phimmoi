import React from 'react';
import { View, Text, ImageBackground, Pressable, StyleSheet, Dimensions } from 'react-native';
import { COLORS, RADIUS, FONT, SPACING } from '../constants/theme';
import { getPhimImageUrl } from '../services/phimapi';
import * as Icons from './ui/icons';

const { width: SCREEN_W } = Dimensions.get('window');

export default function HeroBanner({ movie, onPlay, onInfo }) {
  if (!movie) return null;
  const imgUri = getPhimImageUrl(movie?.poster_url || movie?.thumb_url);

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: imgUri }} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.gradient}>
          <Text style={styles.title} numberOfLines={2}>{movie.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>{movie.origin_name} • {movie.year}</Text>
          <View style={styles.buttons}>
            <Pressable style={styles.playBtn} onPress={onPlay}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Icons.Play size={24} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.playText}>Xem Ngay</Text>
              </View>
            </Pressable>
            <Pressable style={styles.infoBtn} onPress={onInfo}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Icons.Info size={20} color="#fff" style={{marginRight: 6}} />
                <Text style={styles.infoText}>Chi Tiết</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  bg: { width: SCREEN_W, height: 260, justifyContent: 'flex-end' },
  bgImage: { resizeMode: 'cover' },
  gradient: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: SPACING.lg,
    paddingTop: 60,
  },
  title: { color: '#fff', fontSize: FONT.xxl, fontWeight: '800' },
  meta: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: 4 },
  buttons: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.md },
  playBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  playText: { color: '#fff', fontWeight: '700', fontSize: FONT.md },
  infoBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  infoText: { color: '#fff', fontWeight: '600', fontSize: FONT.md },
});
