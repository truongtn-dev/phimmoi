import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await signUp(email, password, name);
      navigation.navigate('Login');
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TextInput placeholder="name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
      <Button title={loading ? 'Creating...' : 'Create account'} onPress={handleRegister} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: '#fff' }, heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 }, input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12, borderRadius: 6 }, });
