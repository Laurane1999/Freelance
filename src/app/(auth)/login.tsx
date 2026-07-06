import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail, validatePassword } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login, submitting, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const onSubmit = async () => {
    clearError();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setFieldErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }
    setFieldErrors({});

    const ok = await login({ email: email.trim(), password });
    if (ok) {
      router.replace('/(app)');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={fieldErrors.email}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        error={fieldErrors.password}
      />

      <Link href="/(auth)/reset-password" style={styles.forgot}>
        Forgot password?
      </Link>

      {Boolean(error) && <Text style={styles.formError}>{error}</Text>}

      <Button label="Sign in" onPress={onSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/(auth)/register" style={styles.footerLink}>
          Sign up
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Brand.textMuted,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: Brand.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  formError: {
    color: Brand.error,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: Brand.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: Brand.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
