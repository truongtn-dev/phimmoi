import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

type Tab = { key: string; title: string; content: React.ReactNode };
type Props = { tabs: Tab[] };

export default function Tabs({ tabs }: Props) {
  const [active, setActive] = useState(0);
  return (
    <View>
      <View style={styles.header}>
        {tabs.map((t, i) => (
          <Pressable key={t.key} onPress={() => setActive(i)} style={[styles.tab, active === i && styles.active]}>
            <Text>{t.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>{tabs[active]?.content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row' },
  tab: { padding: 8, marginRight: 8 },
  active: { borderBottomWidth: 2, borderBottomColor: '#111' },
  content: { marginTop: 12 },
});
