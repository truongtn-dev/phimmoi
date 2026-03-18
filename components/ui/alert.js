import React from 'react';
import { View, Text } from 'react-native';

export default function Alert({ children }) {
  return (
    <View>
      <Text>{children ?? 'Alert (RN stub)'}</Text>
    </View>
  );
}
