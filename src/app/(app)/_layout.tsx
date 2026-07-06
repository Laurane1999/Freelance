import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/hooks/use-auth';

export default function AppLayout() {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
