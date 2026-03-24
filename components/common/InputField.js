import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, FONT, SPACING } from '../../constants/theme';

export default function InputField({ label, error, icon, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, error && styles.inputError]}>
        {icon ? <Feather name={icon} style={[styles.icon, { color: COLORS.textMuted }]} /> : null}
        <TextInput
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: { color: COLORS.textSecondary, fontSize: FONT.sm, marginBottom: SPACING.sm, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputError: { borderColor: COLORS.danger },
  icon: { fontSize: 18, marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.md, paddingVertical: 14 },
  errorText: { color: COLORS.danger, fontSize: FONT.xs, marginTop: 4 },
});


