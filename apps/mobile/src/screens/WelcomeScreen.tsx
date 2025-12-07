import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Temporarily disabled reanimated
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
//   withSequence,
//   Easing,
// } from 'react-native-reanimated';
// import LinearGradient from 'react-native-linear-gradient';
// import { Background3D } from '../components/Background3D';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { RootStackParamList } from '../navigation/RootNavigator';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

const { width } = Dimensions.get('window');

/**
 * WelcomeScreen - Full-screen welcome with 3D background and mode selection
 */
export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // Temporarily disabled animations

  const handleDailyPress = () => {
    navigation.navigate('Chat', { initialMode: 'daily' });
  };

  const handleDivinePress = () => {
    navigation.navigate('Chat', { initialMode: 'divine' });
  };

  return (
    <View style={styles.container}>
      {/* <Background3D mode="daily" /> */}

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Talking Light</Text>
          <Text style={styles.tagline}>
            Calm guidance for your mind and soul.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.dailyPrimary }]}
              onPress={handleDailyPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enter Daily Life Mode</Text>
            </TouchableOpacity>

          <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.divinePrimary }]}
              onPress={handleDivinePress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Enter Divine Mode</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.base,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dailyPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

