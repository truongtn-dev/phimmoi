import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input(props) {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({ input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 } });
