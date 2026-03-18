import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const { data: profile, isLoading } = useQuery(['profile', user?.id], async () => {
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    if (error) throw error;
    return data;
  }, { enabled: !!user });

  const handleLogout = async () => {
    await signOut();
    navigation.navigate('Login');
  };

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {profile?.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={styles.avatar} /> : null}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 }, email: { marginBottom: 12 }, avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 }, center: { flex:1, justifyContent:'center', alignItems:'center' } });
