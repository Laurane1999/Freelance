import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';

type IoniconName = keyof typeof Ionicons.glyphMap;

function tabIcon(active: IoniconName, inactive: IoniconName) {
  return function TabBarIcon({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) {
    return <Ionicons name={focused ? active : inactive} color={color} size={size} />;
  };
}

/**
 * Authenticated area shell. Renders the role-aware bottom tab bar
 * (docs/16_NAVIGATION): shared Home / Missions / Messages / Profile, plus a
 * freelancer-only Services tab and a client-only Notifications tab. Routes that
 * are not tabs (service-new form, chat detail) stay reachable but hidden.
 */
export default function AppLayout() {
  const { status, user } = useSession();

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  const isFreelancer = user?.role === 'freelance';
  const isClient = user?.role === 'client';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: Brand.textMuted,
        tabBarStyle: { borderTopColor: Brand.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Services',
          tabBarIcon: tabIcon('briefcase', 'briefcase-outline'),
          href: isFreelancer ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: tabIcon('clipboard', 'clipboard-outline'),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: tabIcon('chatbubbles', 'chatbubbles-outline'),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: tabIcon('notifications', 'notifications-outline'),
          href: isClient ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
      />
      <Tabs.Screen name="service-new" options={{ href: null }} />
    </Tabs>
  );
}
