import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Brand } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          Boolean(error) && styles.inputError,
          style,
        ]}
        placeholderTextColor={Brand.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Brand.text,
    backgroundColor: Brand.surface,
  },
  inputFocused: {
    borderColor: Brand.primary,
  },
  inputError: {
    borderColor: Brand.error,
  },
  errorText: {
    fontSize: 13,
    color: Brand.error,
  },
});
