import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import InputField from '../components/common/InputField';
import GradientButton from '../components/common/GradientButton';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const { signIn } = useAuth();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email không hợp lệ';
    if (!password) e.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(e);
    setGlobalError('');
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (loading) return; // prevent double submit
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');
    try {
      await signIn(email.trim(), password);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      }
    } catch (e) {
      setGlobalError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerWrap}>
          <View style={{ alignItems: 'center', marginBottom: SPACING.md }}>
            <Icons.Film size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Đăng Nhập</Text>
        </View>

        {globalError ? (
          <View style={styles.errorBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icons.AlertTriangle size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.errorBannerText}>{globalError}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputField
            icon="mail"
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <View style={{ position: 'relative' }}>
            <InputField
              icon="lock"
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
              secureTextEntry={!showPassword}
              error={errors.password}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <View style={styles.eyeText}>
                {showPassword ? <Icons.EyeOff size={20} color={COLORS.textSecondary} /> : <Icons.Eye size={20} color={COLORS.textSecondary} />}
              </View>
            </Pressable>
          </View>
        </View>

        <GradientButton
          title={loading ? '' : 'Đăng Nhập'}
          onPress={handleLogin}
          disabled={loading}
          style={{ marginTop: SPACING.lg }}
        />
        {loading && <ActivityIndicator size="small" color="#fff" style={styles.btnSpinner} />}

        <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
          <Text style={styles.linkText}>Chưa có tài khoản? <Text style={styles.linkBold}>Đăng ký ngay</Text></Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.xl, justifyContent: 'center' },
  content: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  headerWrap: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logo: { fontSize: 56 },
  title: { fontSize: FONT.hero, color: COLORS.textPrimary, fontWeight: '800', textAlign: 'center', marginBottom: SPACING.sm },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.xs },
  errorBanner: { backgroundColor: 'rgba(229,9,20,0.15)', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary },
  errorBannerText: { color: COLORS.primary, fontSize: FONT.sm, textAlign: 'center' },
  eyeBtn: { position: 'absolute', right: 14, top: 38, zIndex: 1 },
  eyeText: { fontSize: 20 },
  btnSpinner: { position: 'absolute', bottom: 135, alignSelf: 'center' },
  linkWrap: { marginTop: SPACING.xl, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
  roleHint: { marginTop: SPACING.xxxl, alignItems: 'center' },
  roleHintText: { color: COLORS.textMuted, fontSize: FONT.xs, textAlign: 'center' },
});

