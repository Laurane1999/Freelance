import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/services/firebase';
import { getUserById } from '@/services/user-service';
import type { Conversation, ConversationSummary, Message } from '@/types/chat';

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';

function toConversation(id: string, data: Record<string, unknown>): Conversation {
  return {
    id,
    participants: Array.isArray(data.participants)
      ? (data.participants as string[])
      : [],
    lastText: typeof data.lastText === 'string' ? data.lastText : null,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  };
}

function toMessage(id: string, data: Record<string, unknown>): Message {
  return {
    id,
    senderId: typeof data.senderId === 'string' ? data.senderId : '',
    text: typeof data.text === 'string' ? data.text : '',
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
  };
}

async function toSummary(
  conversation: Conversation,
  currentUserId: string,
): Promise<ConversationSummary> {
  const otherUserId =
    conversation.participants.find((p) => p !== currentUserId) ?? currentUserId;
  const other = await getUserById(otherUserId);
  return {
    ...conversation,
    otherUserId,
    otherUserName: other?.name ?? 'Unknown user',
  };
}

/**
 * Returns the id of the conversation between two users, creating it if needed.
 */
export async function getOrCreateConversation(
  currentUserId: string,
  otherUserId: string,
): Promise<string> {
  const existing = await getDocs(
    query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', currentUserId),
    ),
  );
  const match = existing.docs.find((entry) => {
    const participants = entry.data().participants;
    return Array.isArray(participants) && participants.includes(otherUserId);
  });
  if (match) {
    return match.id;
  }

  const now = Date.now();
  const ref = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
    participants: [currentUserId, otherUserId],
    lastText: null,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

/**
 * Lists a user's conversations (newest activity first), enriched with the other
 * participant's name. Sorted client-side to avoid a composite index.
 */
export async function listConversationsForUser(
  currentUserId: string,
): Promise<ConversationSummary[]> {
  const snapshot = await getDocs(
    query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', currentUserId),
    ),
  );
  const conversations = snapshot.docs
    .map((entry) => toConversation(entry.id, entry.data()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return Promise.all(conversations.map((c) => toSummary(c, currentUserId)));
}

export async function getConversationSummary(
  conversationId: string,
  currentUserId: string,
): Promise<ConversationSummary | null> {
  const snapshot = await getDoc(
    doc(db, CONVERSATIONS_COLLECTION, conversationId),
  );
  if (!snapshot.exists()) {
    return null;
  }
  return toSummary(toConversation(snapshot.id, snapshot.data()), currentUserId);
}

/**
 * Subscribes to the messages of a conversation in real time (oldest first).
 * Returns an unsubscribe function.
 */
export function subscribeToMessages(
  conversationId: string,
  onChange: (messages: Message[]) => void,
  onError: (error: unknown) => void,
): () => void {
  const messagesQuery = query(
    collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((entry) => toMessage(entry.id, entry.data())));
    },
    onError,
  );
}

/**
 * Sends a message in a conversation and updates the conversation preview.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
): Promise<void> {
  const now = Date.now();
  await addDoc(
    collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION),
    { senderId, text, createdAt: now },
  );
  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
    lastText: text,
    updatedAt: now,
  });
}
