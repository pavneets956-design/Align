import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

const SummitGlow = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 4000, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  const opacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6]
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0b0c1e" />
            <Stop offset="40%" stopColor="#1d2140" />
            <Stop offset="100%" stopColor="#090a16" />
          </LinearGradient>
          <LinearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#ffb36d" />
            <Stop offset="100%" stopColor="#351b3a" />
          </LinearGradient>
        </Defs>

        <Rect width="100" height="100" fill="url(#skyGradient)" />

        <Animated.Path
          d="M0 60 Q25 40 50 55 Q75 40 100 60 L100 100 L0 100 Z"
          fill="url(#horizonGlow)"
          opacity={opacity as unknown as number}
        />
        <Path d="M0 62 Q25 52 50 66 Q75 52 100 62 L100 100 L0 100 Z" fill="#080910" />
      </Svg>
    </View>
  );
};

export default SummitGlow;

