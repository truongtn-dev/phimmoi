import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function NavLink({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.link}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ link: { padding: 8 }, text: { color: '#007aff' } });
