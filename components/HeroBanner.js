import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function HeroBanner({ title, subtitle, image }) {
  return (
    <ImageBackground source={image || null} style={styles.bg} imageStyle={{ borderRadius: 8 }}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { height: 200, justifyContent: 'flex-end', padding: 16, marginBottom: 12 },
  overlay: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 8, borderRadius: 6 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#fff', marginTop: 4 },
});
