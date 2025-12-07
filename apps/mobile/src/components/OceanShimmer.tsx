import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

const OceanShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 5000, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const translate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 4]
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="nightWater" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#030716" />
            <Stop offset="50%" stopColor="#061638" />
            <Stop offset="100%" stopColor="#02101f" />
          </LinearGradient>
          <LinearGradient id="moonGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#fce7b5" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#fce7b5" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Rect width="100" height="100" fill="url(#nightWater)" />
        <Animated.Path
          d="M0 58 Q12 56 25 58 T50 58 T75 58 T100 58 L100 80 L0 80 Z"
          fill="url(#moonGlow)"
          style={{ transform: [{ translateX: translate }] }}
        />
        <Path d="M0 58 L100 58 L100 100 L0 100 Z" fill="rgba(0, 8, 20, 0.8)" />
      </Svg>
    </View>
  );
};

export default OceanShimmer;

