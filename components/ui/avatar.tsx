import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Props = { uri?: string; size?: number };

export default function Avatar({ uri, size = 40 }: Props) {
  if (!uri) return <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]} />;
  return <Image source={{ uri } as ImageSourcePropType} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />;
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#e5e7eb' },
  fallback: { backgroundColor: '#cbd5e1' },
});
