/**
 * ALIGN ChatScreen with Premium 3D UI
 * Maintains all backend API functionality while adding immersive 3D experience
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Message, QuickChip, UserTier, Engine } from '../types/align';
import { handleMessage } from '../lib/alignApi';
import Environment3D from '../components/3d/Environment3D';
import AIEntity3D from '../components/3d/AIEntity3D';
import MessageBubble3D from '../components/3d/MessageBubble3D';
import Chip3D from '../components/3d/Chip3D';
import PaywallPortal3D from '../components/3d/PaywallPortal3D';
import { useEngineTransition } from '../hooks/useEngineTransition';
import { useSound } from '../contexts/SoundContext';

interface ChatScreen3DProps {
  userTier?: UserTier;
}

const ChatScreen3D: React.FC<ChatScreen3DProps> = ({ userTier = 'free' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestedChips, setSuggestedChips] = useState<QuickChip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentEngine, setCurrentEngine] = useState<Engine>('insight');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { playSound } = useSound();
  const prevEngineRef = useRef<Engine>(currentEngine);

  // Engine transition hook
  useEngineTransition({
    engine: currentEngine,
    duration: 3000,
  });

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      from: 'bot',
      text: "I'm here. Tell me one area of your life you want to shift right now—work, body, focus, or relationships?",
      meta: { engine: 'insight' },
    };
    setMessages([welcomeMessage]);
    setSuggestedChips([{ id: 'give_plan', label: 'Give me a practical plan' }]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, suggestedChips]);

  const sendMessage = async (text: string, explicitEngine?: Engine) => {
    if (!text.trim() || isLoading) return;

    setIsListening(false);
    setIsSpeaking(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: text.trim(),
      meta: { timestamp: Date.now() },
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setSuggestedChips([]);

    // AI entity shows listening state
    setIsListening(true);

    try {
      // BACKEND API CALL - UNCHANGED
      const response = await handleMessage(text.trim(), {
        userId: null, // TODO: Get from auth
        userTier: userTier,
        explicitEngine: explicitEngine || undefined,
        previousMessages: messages.slice(-10).map(m => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      setIsListening(false);
      setIsSpeaking(true);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: response.replyText,
        meta: { engine: response.engineUsed, timestamp: Date.now() },
      };

      // Update current engine based on response
      const newEngine = response.engineUsed;
      if (prevEngineRef.current !== newEngine) {
        // Engine changed - play transition sound and haptic feedback
        playSound('engine_transition');
        
        // Haptic feedback for engine transition
        try {
          const Haptics = require('expo-haptics');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {
          // Haptics not available - continue without
        }
        
        prevEngineRef.current = newEngine;
      }
      setCurrentEngine(newEngine);

      setMessages((prev) => [...prev, botMessage]);
      setSuggestedChips(response.suggestedChips || []);
      
      // Stop speaking animation after a delay
      setTimeout(() => setIsSpeaking(false), 2000);

      if (response.showPaywall) {
        setShowPaywall(true);
      }
    } catch (error) {
      setIsListening(false);
      setIsSpeaking(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: 'Something went wrong. Please try again.',
        meta: { timestamp: Date.now() },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipPress = async (chip: QuickChip) => {
    if (chip.id === 'unlock_30_days' || (chip.id === 'save_routine' && userTier === 'free')) {
      setShowPaywall(true);
      return;
    }

    // Determine explicit engine for chip clicks - direct routing (no re-classification)
    let explicitEngine: Engine | undefined;
    if (chip.id === 'give_plan') {
      explicitEngine = 'plan'; // "Give me a practical plan" → Plan Engine
    } else if (chip.id === 'yes_action') {
      explicitEngine = 'action'; // "Yes, give me an action" → Action Engine
    } else if (chip.id === 'inner_block') {
      explicitEngine = 'insight'; // "Help me understand the inner block" → Insight Engine
    }
    // unlock_30_days and save_routine handled above (paywall)

    // Send chip as message with explicit engine routing
    await sendMessage(chip.label, explicitEngine);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    return <MessageBubble3D message={item} index={index} />;
  };

  const handleUpgrade = async () => {
    setShowPaywall(false);
    try {
      // BACKEND API CALL - UNCHANGED
      const { API_ENDPOINTS } = require('../config/api');
      const apiBaseUrl = API_ENDPOINTS.billing || 'http://localhost:3000/api/billing';
      const response = await fetch(`${apiBaseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: null, // TODO: Get from auth
          successUrl: 'align://success',
          cancelUrl: 'align://cancel',
        }),
      });
      const data = await response.json();
      if (data.url) {
        Linking.openURL(data.url);
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#050816" />
      
      {/* 3D Environment with engine-specific theme */}
      <Environment3D engine={currentEngine}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* AI Entity at top */}
          <View style={styles.aiEntityContainer}>
            <AIEntity3D
              engine={currentEngine}
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
          </View>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#38bdf8" />
            </View>
          )}

          {/* Quick Chips - 3D */}
          {suggestedChips.length > 0 && (
            <View style={styles.chipsContainer}>
              {suggestedChips.map((chip) => (
                <Chip3D
                  key={chip.id}
                  chip={chip}
                  engine={currentEngine}
                  onPress={() => handleChipPress(chip)}
                  isLocked={chip.id.includes('save') && userTier === 'free'}
                />
              ))}
            </View>
          )}

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#6b7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              onSubmitEditing={() => sendMessage(inputText, undefined)}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={() => sendMessage(inputText, undefined)}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Environment3D>

      {/* 3D Paywall Portal */}
      <PaywallPortal3D
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aiEntityContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    backgroundColor: 'rgba(5, 8, 22, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#e5e7eb',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  sendButton: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#050816',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen3D;

