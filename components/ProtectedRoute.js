import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageGet } from '../utils/storage';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigation = useNavigation();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const user = await storageGet('user');
      if (!user) {
        navigation.navigate('Login');
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return <View />;
  return children;
}

