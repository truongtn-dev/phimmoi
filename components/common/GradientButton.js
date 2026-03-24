import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT, SPACING } from '../../constants/theme';

export default function GradientButton({ title, onPress, style, disabled, variant = 'primary' }) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        isPrimary ? styles.primary : styles.outline,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[styles.text, !isPrimary && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: COLORS.primary },
  outline: { borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: 'transparent' },
  text: { color: '#FFF', fontSize: FONT.md, fontWeight: '700' },
  outlineText: { color: COLORS.primary },
});


