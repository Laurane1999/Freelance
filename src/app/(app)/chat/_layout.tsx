import { Stack } from 'expo-router';

/**
 * Keeps the conversation list and a conversation detail under a single
 * "Messages" tab (docs/16_NAVIGATION) so the bottom tab bar stays visible.
 */
export default function ChatLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
