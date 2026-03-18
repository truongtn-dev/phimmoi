import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({ children }) {
  return (
    <View>
      <Text>{children ?? 'Badge'}</Text>
    </View>
  );
}
