import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© My Expo App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  text: { color: '#666' },
});
