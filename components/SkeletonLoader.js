import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export default function SkeletonLoader({ width = '100%', height = 20, style, borderRadius = RADIUS.sm }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: COLORS.skeleton, opacity },
        style,
      ]}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <View style={skStyles.card}>
      <SkeletonLoader width={140} height={200} borderRadius={RADIUS.lg} />
      <SkeletonLoader width={120} height={14} style={{ marginTop: 8 }} />
    </View>
  );
}

export function BannerSkeleton() {
  return <SkeletonLoader width="100%" height={220} borderRadius={RADIUS.lg} style={{ marginBottom: 16 }} />;
}

const skStyles = StyleSheet.create({
  card: { marginRight: 12, width: 140 },
});
