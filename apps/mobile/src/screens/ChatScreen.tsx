/**
 * ALIGN ChatScreen
 * Main chat interface with messages, chips, input, and paywall
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
  Modal,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Message, QuickChip, UserTier, Engine } from '../types/align';
import { handleMessage, routeChip } from '../lib/alignApi';

interface ChatScreenProps {
  userTier?: UserTier;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ userTier = 'free' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestedChips, setSuggestedChips] = useState<QuickChip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingEngine, setPendingEngine] = useState<Engine | null>(null);
  const flatListRef = useRef<FlatList>(null);

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

    try {
      const response = await handleMessage(text.trim(), {
        userId: null, // TODO: Get from auth
        userTier: userTier,
        explicitEngine: explicitEngine || pendingEngine || undefined,
        previousMessages: messages.slice(-10).map(m => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: response.replyText,
        meta: { engine: response.engineUsed, timestamp: Date.now() },
      };

      setMessages((prev) => [...prev, botMessage]);
      setSuggestedChips(response.suggestedChips || []);
      setPendingEngine(null);

      if (response.showPaywall) {
        setShowPaywall(true);
      }
    } catch (error) {
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

    // Determine explicit engine for chip clicks
    let explicitEngine: Engine | undefined;
    if (chip.id === 'give_plan' || chip.id === 'yes_action') {
      explicitEngine = 'action';
    } else if (chip.id === 'inner_block') {
      explicitEngine = 'insight';
    }

    // Send chip as message
    await sendMessage(chip.label, explicitEngine);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>
          {item.meta?.engine && (
            <Text style={styles.engineLabel}>{item.meta.engine}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderChips = () => {
    if (suggestedChips.length === 0) return null;

    return (
      <View style={styles.chipsContainer}>
        {suggestedChips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[styles.chip, chip.id.includes('save') && userTier === 'free' && styles.lockedChip]}
            onPress={() => handleChipPress(chip)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>
              {chip.label}
              {chip.id.includes('save') && userTier === 'free' && ' 🔒'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#050816" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#38bdf8" />
          </View>
        )}

        {/* Quick Chips */}
        {renderChips()}

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

      {/* Paywall Modal */}
      <Modal
        visible={showPaywall}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaywall(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unlock Your Full 30-Day Plan</Text>
            <Text style={styles.modalDescription}>
              Get access to complete structured plans, save routines to your library, and unlock all ALIGN Pro features.
            </Text>
            <View style={styles.modalFeatures}>
              <Text style={styles.modalFeature}>✓ Full 30-day structured plans</Text>
              <Text style={styles.modalFeature}>✓ Save unlimited routines</Text>
              <Text style={styles.modalFeature}>✓ Priority support</Text>
            </View>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={async () => {
                setShowPaywall(false);
                try {
                  // Get API base URL from config
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
                  // TODO: Show error to user
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to ALIGN Pro – $9/mo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPaywall(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#38bdf8',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1f2937',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#050816',
    fontWeight: '500',
  },
  botText: {
    color: '#e5e7eb',
  },
  engineLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 6,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  lockedChip: {
    borderColor: '#eab308',
    opacity: 0.9,
  },
  chipText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sendButton: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalFeatures: {
    marginBottom: 24,
    gap: 8,
  },
  modalFeature: {
    fontSize: 15,
    color: '#e5e7eb',
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#050816',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});

export default ChatScreen;
