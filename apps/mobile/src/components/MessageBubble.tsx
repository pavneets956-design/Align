import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSpring,
// } from 'react-native-reanimated';
// import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { Message, ChatMode } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  mode: ChatMode;
}

/**
 * MessageBubble - Animated message bubble with mode-specific styling
 * Features fade + slide up entrance animation
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  mode,
}) => {
  // Temporarily disabled animations

  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View
        style={[
          styles.container,
          styles.userContainer,
        ]}
      >
        <View style={[styles.bubble, styles.userBubble]}>
          <Text style={[styles.text, styles.userText]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  // AI message with solid color based on mode
  return (
    <View
      style={[styles.container, styles.aiContainer]}
    >
      <View
        style={[
          styles.bubble,
          styles.aiBubble,
          { backgroundColor: mode === 'divine' ? colors.divinePrimary : colors.dailyPrimary }
        ]}
      >
        <Text style={[styles.text, styles.aiText]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  aiBubble: {
    // Gradient applied via LinearGradient
  },
  text: {
    ...typography.body,
    lineHeight: 22,
  },
  userText: {
    color: colors.textPrimary,
  },
  aiText: {
    color: colors.textPrimary,
  },
});

