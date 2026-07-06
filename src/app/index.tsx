import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';

export default function Index() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  return status === 'authenticated' ? (
    <Redirect href="/(app)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
});
