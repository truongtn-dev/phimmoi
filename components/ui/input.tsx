import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

export default function Input(props: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput {...props} style={[styles.input, props.style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 6 },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
