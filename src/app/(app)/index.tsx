import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Brand } from '@/constants/theme';
import { useAuth, useSession } from '@/hooks/use-auth';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { logout } = useAuth();

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Screen>
      <Text style={styles.greeting}>Welcome{user?.name ? `, ${user.name}` : ''}</Text>

      <View style={styles.card}>
        <Row label="Email" value={user?.email ?? '—'} />
        <Row label="Role" value={user?.role ?? '—'} />
        <Row label="Skills" value={user?.skills?.length ? user.skills.join(', ') : '—'} />
      </View>

      <View style={styles.nav}>
        <Button label="Marketplace" onPress={() => router.push('/(app)/marketplace')} />
        <Button label="Missions" onPress={() => router.push('/(app)/missions')} />
        <Button
          label="Edit profile"
          variant="ghost"
          onPress={() => router.push('/(app)/profile')}
        />
      </View>

      <View style={styles.spacer} />
      <Button label="Log out" variant="accent" onPress={onLogout} />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    gap: 12,
  },
  nav: {
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowLabel: {
    fontSize: 15,
    color: Brand.textMuted,
  },
  rowValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
    textTransform: 'capitalize',
  },
});
