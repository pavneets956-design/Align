import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';
// import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { ChatMode } from '../types/chat';

interface InputBarProps {
  onSend: (text: string) => void;
  mode: ChatMode;
  disabled?: boolean;
}

/**
 * InputBar - Glassmorphic input bar with send button
 * Lifts and brightens when focused
 */
export const InputBar: React.FC<InputBarProps> = ({
  onSend,
  mode,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Temporarily disabled animations

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gradient, { backgroundColor: colors.card }]}>
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            placeholderTextColor={colors.textTertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSend}
            multiline
            maxLength={500}
            editable={!disabled}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || disabled) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!text.trim() || disabled}
            activeOpacity={0.7}
          >
            <View style={[styles.sendButtonGradient, { 
              backgroundColor: mode === 'divine' ? colors.divinePrimary : colors.dailyPrimary 
            }]}>
              <View style={styles.sendIcon}>
                <View style={styles.sendIconArrow} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: Platform.OS === 'ios' ? spacing.base : spacing.md,
    paddingTop: spacing.sm,
  },
  gradient: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 100,
    marginRight: spacing.sm,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.dailyPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIconArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.textPrimary,
    transform: [{ rotate: '-90deg' }],
    marginLeft: 2,
    backgroundColor: 'transparent',
  },
});

