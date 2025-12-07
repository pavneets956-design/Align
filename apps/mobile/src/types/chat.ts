/**
 * Chat-related types
 */

export type ChatMode = 'daily' | 'divine';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  mode: ChatMode;
  content: string;
  createdAt: number;
}

export interface ChatState {
  messages: Message[];
  currentMode: ChatMode;
  isSending: boolean;
}

