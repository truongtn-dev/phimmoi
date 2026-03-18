import React from 'react';
import { Modal as RNModal, View, StyleSheet, Pressable } from 'react-native';

type Props = { visible: boolean; onClose?: () => void; children?: React.ReactNode };

export default function Modal({ visible, onClose, children }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <Pressable style={styles.container} onPress={onClose} />
        <View style={styles.content}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  content: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16, zIndex: 2 },
});
