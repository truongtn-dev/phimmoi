import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>404</Text>
      <Text>Page not found.</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }, heading: { fontSize: 36, fontWeight: '700', marginBottom: 8 } });
