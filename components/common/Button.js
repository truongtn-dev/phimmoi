import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ children, onPress, style, title }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]}>
      <Text style={styles.text}>{children ?? title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ btn: { padding: 10, backgroundColor: '#007aff', borderRadius: 6, alignItems: 'center' }, text: { color: '#fff', fontWeight: '600' } });


