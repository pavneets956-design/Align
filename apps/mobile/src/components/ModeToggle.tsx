import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   interpolateColor,
// } from 'react-native-reanimated';
// import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { ChatMode } from '../types/chat';

interface ModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

/**
 * ModeToggle - Animated toggle between Daily Life and Divine modes
 * Features sliding pill with color interpolation
 */
export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  // Temporarily disabled animations

  return (
    <View style={[styles.container, { backgroundColor: mode === 'daily' ? colors.dailyBackground : colors.divineBackground }]}>
      <View style={[styles.slider, { 
        transform: [{ translateX: mode === 'daily' ? 2 : 122 }],
        backgroundColor: mode === 'daily' ? colors.dailyPrimary : colors.divinePrimary 
      }]} />

      <TouchableOpacity
        style={styles.option}
        onPress={() => onModeChange('daily')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            mode === 'daily' && styles.optionTextActive,
          ]}
        >
          Daily Life
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => onModeChange('divine')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            mode === 'divine' && styles.optionTextActive,
          ]}
        >
          Divine
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    padding: 2,
    backgroundColor: colors.card,
    position: 'relative',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    width: 116,
    height: 36,
    borderRadius: 18,
    top: 2,
    left: 2,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: spacing.md,
  },
  optionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

