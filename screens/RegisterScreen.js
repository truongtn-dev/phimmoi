import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import InputField from '../components/common/InputField';
import GradientButton from '../components/common/GradientButton';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import * as Icons from '../components/common/icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const { signUp } = useAuth();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Tên không được để trống';
    if (!email.trim()) e.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S/.test(email)) e.email = 'Email không hợp lệ';
    if (!password) e.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    else if (!/(?=.*[A-Z])/.test(password)) e.password = 'Cần ít nhất 1 chữ hoa';
    else if (!/(?=.*[0-9])/.test(password)) e.password = 'Cần ít nhất 1 chữ số';
    if (password !== confirmPassword) e.confirm = 'Mật khẩu không khớp';
    setErrors(e);
    setGlobalError('');
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (loading) return;
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');
    try {
      await signUp(email.trim(), password, name.trim());
      navigation.navigate('Login');
    } catch (e) {
      setGlobalError(e?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{alignItems:'center', marginBottom: SPACING.sm}}>
          <Icons.Film size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>Đăng ký miễn phí để xem phim không giới hạn</Text>

        {globalError ? (
          <View style={styles.errorBanner}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Icons.AlertTriangle size={16} color="#fff" style={{marginRight:8}}/>
              <Text style={styles.errorBannerText}>{globalError}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.form}>
          <InputField icon="user" label="Họ tên" placeholder="Nguyễn Văn A" value={name} onChangeText={(t) => { setName(t); clearError('name'); }} error={errors.name} />
          <InputField icon="mail" label="Email" placeholder="example@email.com" value={email} onChangeText={(t) => { setEmail(t); clearError('email'); }} keyboardType="email-address" autoCapitalize="none" error={errors.email} />

          <View style={{ position: 'relative' }}>
            <InputField icon="lock" label="Mật khẩu" placeholder="Tối thiểu 6 ký tự, 1 hoa, 1 số" value={password} onChangeText={(t) => { setPassword(t); clearError('password'); }} secureTextEntry={!showPassword} error={errors.password} />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <View style={styles.eyeText}>
                {showPassword ? <Icons.EyeOff size={20} color={COLORS.textSecondary}/> : <Icons.Eye size={20} color={COLORS.textSecondary}/>}
              </View>
            </Pressable>
          </View>

          <InputField icon="lock" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChangeText={(t) => { setConfirmPassword(t); clearError('confirm'); }} secureTextEntry={!showPassword} error={errors.confirm} />

          {/* Password Strength Indicator */}
          <View style={styles.strengthRow}>
            <View style={styles.strengthBar}>
              <View style={[styles.strengthIndicator, { width: password.length < 6 ? '33%' : /[A-Z]/.test(password) && /[0-9]/.test(password) ? '100%' : '66%', backgroundColor: password.length < 6 ? '#FF6B6B' : /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#46D369' : '#F5C518' }]} />
            </View>
            <Text style={styles.strengthText}>
              {password.length < 6 ? 'Yếu' : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'Mạnh' : 'Trung bình'}
            </Text>
          </View>
        </View>

        <GradientButton title={loading ? '' : 'Đăng Ký'} onPress={handleRegister} disabled={loading} style={{ marginTop: SPACING.md }} />
        {loading && <ActivityIndicator size="small" color="#fff" style={styles.btnSpinner} />}

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
          <Text style={styles.linkText}>Đã có tài khoản? <Text style={styles.linkBold}>Đăng nhập</Text></Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingVertical: 60, justifyContent: 'center', minHeight: '100%' },
  form: { marginBottom: SPACING.lg },
  title: { fontSize: FONT.hero, color: COLORS.textPrimary, fontWeight: '800', textAlign: 'center', marginBottom: SPACING.md },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.sm, marginTop: SPACING.xs, textAlign: 'center', marginBottom: SPACING.xxl },
  errorBanner: { backgroundColor: 'rgba(229,9,20,0.15)', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary },
  errorBannerText: { color: COLORS.primary, fontSize: FONT.sm, textAlign: 'center' },
  eyeBtn: { position: 'absolute', right: 14, top: 38, zIndex: 1 },
  eyeText: { fontSize: 20 },
  strengthDot: { width: 24, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  strengthGreen: { backgroundColor: COLORS.success },
  strengthText: { color: COLORS.textMuted, fontSize: FONT.xs, marginLeft: SPACING.sm },
  btnSpinner: { position: 'absolute', bottom: 90, alignSelf: 'center' },
  linkWrap: { marginTop: SPACING.xl, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: FONT.sm },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});

