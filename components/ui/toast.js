import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Toast({ children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { padding: 10, backgroundColor: '#333', borderRadius: 6 }, text: { color: '#fff' } });
