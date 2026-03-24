import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdBanner({ text = 'Ad' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#f7f7f7', alignItems: 'center', borderRadius: 6, marginVertical: 8 },
  text: { color: '#666' },
});


