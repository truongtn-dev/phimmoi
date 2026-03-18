import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type Props = {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ children, onPress, style, textStyle, variant = 'primary' }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.button, variant === 'secondary' && styles.secondary, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
