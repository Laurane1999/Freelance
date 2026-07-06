import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/screen';
import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';
import { useConversations } from '@/hooks/use-chat';
import type { ConversationSummary } from '@/types/chat';

export default function ChatListScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { conversations, loading, error, reload } = useConversations(user?.id);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <Screen scroll={false}>
      <Text style={styles.title}>Messages</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Brand.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No conversations yet. Start one from a mission.
            </Text>
          }
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              onPress={() => router.push(`/(app)/chat/${item.id}`)}
            />
          )}
        />
      )}
    </Screen>
  );
}

function ConversationRow({
  conversation,
  onPress,
}: {
  conversation: ConversationSummary;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={styles.rowName}>{conversation.otherUserName}</Text>
      <Text style={styles.rowPreview} numberOfLines={1}>
        {conversation.lastText ?? 'No messages yet'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  loader: {
    marginTop: 48,
  },
  list: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  row: {
    backgroundColor: Brand.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    gap: 4,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  rowPreview: {
    fontSize: 14,
    color: Brand.textMuted,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
    color: Brand.textMuted,
  },
  error: {
    fontSize: 14,
    color: Brand.error,
  },
});
