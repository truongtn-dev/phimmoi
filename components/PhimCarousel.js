import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PhimCard from './PhimCard';

export default function PhimCarousel({ items = [], onPress }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wrap}>
      {items.map((it) => (
        <View key={it.id} style={styles.item}>
          <PhimCard phim={it} onPress={() => onPress?.(it)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ wrap: { paddingVertical: 8 }, item: { marginRight: 12 } });
