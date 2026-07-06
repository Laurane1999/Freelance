import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { RoleSelector } from '@/components/role-selector';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/types/user';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validation';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, submitting, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const onSubmit = async () => {
    clearError();
    const errors: FieldErrors = {
      name: validateName(name) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirm) ?? undefined,
    };
    if (errors.name || errors.email || errors.password || errors.confirm) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const ok = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });
    if (ok) {
      router.replace('/(app)');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join to get started</Text>
      </View>

      <TextField
        label="Full name"
        value={name}
        onChangeText={setName}
        placeholder="Jane Doe"
        autoCapitalize="words"
        autoComplete="name"
        error={fieldErrors.name}
      />
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
      <RoleSelector label="I am a" value={role} onChange={setRole} />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secureTextEntry
        error={fieldErrors.password}
      />
      <TextField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Re-enter password"
        secureTextEntry
        error={fieldErrors.confirm}
      />

      {Boolean(error) && <Text style={styles.formError}>{error}</Text>}

      <Button label="Create account" onPress={onSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" style={styles.footerLink}>
          Sign in
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
