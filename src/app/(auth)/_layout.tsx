import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/hooks/use-auth';

export default function AuthLayout() {
  const { status } = useSession();

  if (status === 'authenticated') {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
