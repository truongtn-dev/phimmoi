import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { children?: React.ReactNode; text?: string };

export default function Tooltip({ children, text }: Props) {
  return (
    <View style={styles.wrapper}>
      {children}
      {text ? <View style={styles.box}><Text style={styles.text}>{text}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  box: { position: 'absolute', bottom: '100%', backgroundColor: '#111', padding: 6, borderRadius: 6 },
  text: { color: '#fff', fontSize: 12 },
});
