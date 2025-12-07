import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';
import { ChatMode } from '../types/chat';

const { width, height } = Dimensions.get('window');

interface FloatingOrbProps {
  mode: ChatMode;
  x?: number;
  y?: number;
}

/**
 * FloatingOrb - Glowing orb with breathing animation
 * Creates depth and warmth behind the chat interface
 */
export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  mode,
  x = width * 0.5,
  y = height * 0.4,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Breathing animation
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Slow drift
    translateX.value = withRepeat(
      withTiming(50, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    translateY.value = withRepeat(
      withTiming(30, {
        duration: 6000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const gradientColors =
    mode === 'divine'
      ? [colors.divineGlow, colors.divinePrimary, colors.divineGlow]
      : [colors.dailyGlow, colors.dailyPrimary, colors.dailyGlow];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - 100,
          top: y - 100,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 0,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    shadowColor: colors.dailyPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
});

