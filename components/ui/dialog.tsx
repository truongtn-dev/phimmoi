import React from 'react';
import Modal from './modal';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = { visible: boolean; onClose?: () => void; title?: string; children?: React.ReactNode };

export default function Dialog({ visible, onClose, title, children }: Props) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <View>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.body}>{children}</View>
        <Pressable onPress={onClose} style={styles.button}><Text>Close</Text></Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ title: { fontSize: 18, fontWeight: '600', marginBottom: 8 }, body: { marginBottom: 12 }, button: { alignSelf: 'flex-end', padding: 8 } });
