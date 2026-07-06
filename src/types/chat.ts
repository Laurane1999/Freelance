/**
 * Chat models — mirror the `conversations` and `messages` collections
 * (docs/03_DATABASE). Messages are stored as a subcollection of a conversation
 * (`conversations/{id}/messages/{id}`) so message docs keep exactly the schema
 * fields (senderId, text, createdAt); the conversation id is the path. Extra
 * conversation fields (`lastText`, `createdAt`, `updatedAt`) are for
 * ordering/preview — see CHANGELOG.
 */
export interface Conversation {
  id: string;
  participants: string[];
  lastText: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * A conversation enriched with the other participant's display info, for lists.
 */
export interface ConversationSummary extends Conversation {
  otherUserId: string;
  otherUserName: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
}
