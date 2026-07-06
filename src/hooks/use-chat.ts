import { useCallback, useEffect, useState } from 'react';

import * as chatService from '@/services/chat-service';
import type { ConversationSummary, Message } from '@/types/chat';
import { toErrorMessage } from '@/utils/errors';

interface UseConversationsResult {
  conversations: ConversationSummary[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Logic layer for the conversation list (CHAT phase). The consumer triggers the
 * initial load (the chat list screen does so on focus).
 */
export function useConversations(userId: string | undefined): UseConversationsResult {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setConversations(await chatService.listConversationsForUser(userId));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { conversations, loading, error, reload };
}

interface UseConversationResult {
  messages: Message[];
  otherUserName: string;
  loading: boolean;
  error: string | null;
  sending: boolean;
  send: (senderId: string, text: string) => Promise<boolean>;
}

/**
 * Live message thread for a single conversation (CHAT phase). Subscribes to
 * message updates in real time.
 */
export function useConversation(
  conversationId: string,
  currentUserId: string | undefined,
): UseConversationResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUserName, setOtherUserName] = useState('Chat');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    let active = true;
    chatService
      .getConversationSummary(conversationId, currentUserId)
      .then((summary) => {
        if (active && summary) {
          setOtherUserName(summary.otherUserName);
        }
      })
      .catch(() => undefined);

    const unsubscribe = chatService.subscribeToMessages(
      conversationId,
      (next) => {
        setMessages(next);
        setLoading(false);
      },
      (err) => {
        setError(toErrorMessage(err));
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [conversationId, currentUserId]);

  const send = useCallback(
    async (senderId: string, text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) {
        return false;
      }
      setSending(true);
      setError(null);
      try {
        await chatService.sendMessage(conversationId, senderId, trimmed);
        return true;
      } catch (err) {
        setError(toErrorMessage(err));
        return false;
      } finally {
        setSending(false);
      }
    },
    [conversationId],
  );

  return { messages, otherUserName, loading, error, sending, send };
}

interface UseOpenConversationResult {
  opening: boolean;
  error: string | null;
  openConversation: (
    currentUserId: string,
    otherUserId: string,
  ) => Promise<string | null>;
}

export function useOpenConversation(): UseOpenConversationResult {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openConversation = useCallback(
    async (currentUserId: string, otherUserId: string): Promise<string | null> => {
      setOpening(true);
      setError(null);
      try {
        return await chatService.getOrCreateConversation(currentUserId, otherUserId);
      } catch (err) {
        setError(toErrorMessage(err));
        return null;
      } finally {
        setOpening(false);
      }
    },
    [],
  );

  return { opening, error, openConversation };
}
