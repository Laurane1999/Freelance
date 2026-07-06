import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';
import { useConversation } from '@/hooks/use-chat';
import type { Message } from '@/types/chat';

export default function ConversationThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();
  const { messages, otherUserName, loading, error, sending, send } = useConversation(
    conversationId ?? '',
    user?.id,
  );

  const [draft, setDraft] = useState('');

  const onSend = async () => {
    if (!user || !draft.trim()) {
      return;
    }
    const ok = await send(user.id, draft);
    if (ok) {
      setDraft('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen options={{ title: otherUserName }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.header}>{otherUserName}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Brand.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.empty}>Say hello to start the conversation.</Text>
            }
            renderItem={({ item }) => (
              <MessageBubble message={item} isMine={item.senderId === user?.id} />
            )}
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={Brand.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <Pressable
            accessibilityRole="button"
            disabled={sending || !draft.trim()}
            onPress={onSend}
            style={({ pressed }) => [
              styles.sendButton,
              (sending || !draft.trim()) && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
            ]}>
            <Text style={styles.sendLabel}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ message, isMine }: { message: Message; isMine: boolean }) {
  return (
    <View style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: Brand.primary,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  loader: {
    marginTop: 48,
  },
  list: {
    padding: 24,
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: Brand.primary,
  },
  bubbleTheirs: {
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  bubbleText: {
    fontSize: 15,
    color: Brand.text,
  },
  bubbleTextMine: {
    color: Brand.white,
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
    paddingHorizontal: 24,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: Brand.text,
    backgroundColor: Brand.surface,
  },
  sendButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Brand.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendLabel: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
