import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Brand } from '@/constants/theme';

/**
 * Client Notifications tab (docs/16_NAVIGATION). Placeholder only — the
 * NOTIFICATIONS feature and its data model are out of scope for now, so this
 * screen has no backend wiring yet.
 */
export default function NotificationsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No notifications yet.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Brand.textMuted,
  },
});
