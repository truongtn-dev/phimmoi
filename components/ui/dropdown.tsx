import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

type Props = { label?: string; options: Array<{ label: string; value: any }>; onSelect?: (v: any) => void };

export default function Dropdown({ label, options, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setOpen((s) => !s)} style={styles.button}><Text>{label}</Text></Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map((o, i) => (
            <Pressable key={i} onPress={() => { onSelect?.(o.value); setOpen(false); }} style={styles.item}>
              <Text>{o.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  button: { padding: 8, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  menu: { position: 'absolute', top: 44, backgroundColor: '#fff', borderRadius: 6, padding: 6, width: 160, shadowColor: '#000', shadowOpacity: 0.08, elevation: 4 },
  item: { padding: 8 },
});
