import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import type { UserRole } from '@/types/user';

interface RoleSelectorProps {
  label: string;
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const OPTIONS: { role: UserRole; label: string }[] = [
  { role: 'client', label: 'Client' },
  { role: 'freelance', label: 'Freelancer' },
];

export function RoleSelector({ label, value, onChange }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {OPTIONS.map((option) => {
          const selected = option.role === value;
          return (
            <Pressable
              key={option.role}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.role)}
              style={[styles.option, selected && styles.optionSelected]}>
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.text,
  },
  optionLabelSelected: {
    color: Brand.white,
  },
});
