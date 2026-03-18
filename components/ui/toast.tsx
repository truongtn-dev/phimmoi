import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { message: string };

export default function Toast({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111827', padding: 10, borderRadius: 8 },
  text: { color: '#fff' },
});
