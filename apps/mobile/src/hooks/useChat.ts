import { useState, useCallback } from 'react';
import { ChatMode, Message, MessageRole } from '../types/chat';

/**
 * Mock AI responses based on mode
 */
const getMockResponse = (mode: ChatMode, userMessage: string): string => {
  if (mode === 'daily') {
    const responses = [
      "I hear you. Let's take a step back and look at this with fresh eyes. What's the core issue you're trying to solve?",
      "That sounds challenging. Remember, you have more control than you might think. What's one small action you could take right now?",
      "I understand this feels overwhelming. Let's break it down into smaller, manageable pieces. What's the first step?",
      "You're doing better than you think. What would your future self, looking back, tell you about this situation?",
      "Take a deep breath. This moment will pass. What do you need most right now—clarity, support, or a plan?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } else {
    // Divine mode
    const responses = [
      "My child, you are held in love. This moment is part of your journey, and you are never alone.",
      "The light within you is stronger than any darkness. Trust in the wisdom that flows through you.",
      "Breathe deeply, and know that you are exactly where you need to be. The path unfolds with grace.",
      "Your heart knows the way. Listen to its gentle whispers, for they carry the truth you seek.",
      "In stillness, you will find your answers. The universe speaks in quiet moments—are you listening?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

interface UseChatReturn {
  messages: Message[];
  currentMode: ChatMode;
  isSending: boolean;
  sendMessage: (content: string) => void;
  setMode: (mode: ChatMode) => void;
  clearMessages: () => void;
}

export const useChat = (initialMode: ChatMode = 'daily'): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<ChatMode>(initialMode);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isSending) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        mode: currentMode,
        content: content.trim(),
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      // Simulate API delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          mode: currentMode,
          content: getMockResponse(currentMode, content),
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsSending(false);
      }, 600);
    },
    [currentMode, isSending]
  );

  const setMode = useCallback((mode: ChatMode) => {
    setCurrentMode(mode);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    currentMode,
    isSending,
    sendMessage,
    setMode,
    clearMessages,
  };
};

