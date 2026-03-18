import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function PhimHeroBanner({ title, subtitle, image }) {
  return (
    <ImageBackground source={image || null} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({ bg: { height: 220, justifyContent: 'flex-end' }, overlay: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 12 }, title: { color: '#fff', fontSize: 22, fontWeight: '700' }, subtitle: { color: '#fff' } });
