import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail } from '@/utils/validation';

export default function ResetPasswordScreen() {
  const { resetPassword, submitting, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    clearError();
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }
    setEmailError(undefined);

    const ok = await resetPassword(email.trim());
    if (ok) {
      setSent(true);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we&apos;ll send you a reset link.
        </Text>
      </View>

      {sent ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            If an account exists for {email.trim()}, a reset link is on its way.
          </Text>
        </View>
      ) : (
        <>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            error={emailError}
          />

          {Boolean(error) && <Text style={styles.formError}>{error}</Text>}

          <Button label="Send reset link" onPress={onSubmit} loading={submitting} />
        </>
      )}

      <View style={styles.footer}>
        <Link href="/(auth)/login" style={styles.footerLink}>
          Back to sign in
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
  successBox: {
    backgroundColor: Brand.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.accent,
    padding: 16,
  },
  successText: {
    color: Brand.text,
    fontSize: 15,
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
  footerLink: {
    color: Brand.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
