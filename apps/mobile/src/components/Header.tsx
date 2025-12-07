import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { ModeToggle } from './ModeToggle';
import { ChatMode } from '../types/chat';

interface HeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onSettingsPress: () => void;
}

/**
 * Header - App header with title, mode toggle, and settings
 */
export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onSettingsPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Talking Light</Text>

      <View style={styles.center}>
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingsIcon}>
          <View style={styles.settingsDot} />
          <View style={[styles.settingsDot, styles.settingsDotMiddle]} />
          <View style={styles.settingsDot} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    zIndex: 10,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
  },
  settingsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  settingsDotMiddle: {
    alignSelf: 'center',
  },
});

