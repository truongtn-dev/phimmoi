import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Movies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 56, backgroundColor: '#111', justifyContent: 'center', paddingHorizontal: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
