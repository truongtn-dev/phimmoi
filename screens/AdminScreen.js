import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin</Text>
      <Text>Admin area (requires server-side role checks).</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, heading: { fontSize: 20, fontWeight: '700', marginBottom: 8 } });
