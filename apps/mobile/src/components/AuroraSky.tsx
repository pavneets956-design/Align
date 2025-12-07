import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

const AuroraSky = () => {
  const driftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(driftAnim, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.timing(driftAnim, { toValue: 0, duration: 7000, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [driftAnim]);

  const translateX = driftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6]
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="auroraSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#050519" />
            <Stop offset="100%" stopColor="#0c132c" />
          </LinearGradient>
          <LinearGradient id="auroraRibbon" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#58f6d4" stopOpacity="0.2" />
            <Stop offset="50%" stopColor="#8d80ff" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#f6a7ff" stopOpacity="0.18" />
          </LinearGradient>
        </Defs>

        <Rect width="100" height="100" fill="url(#auroraSky)" />

        <Animated.Path
          d="M-10 40 Q20 25 50 38 Q80 51 110 39 L110 60 Q80 75 50 62 Q20 49 -10 63 Z"
          fill="url(#auroraRibbon)"
          style={{
            transform: [{ translateX }]
          }}
        />
      </Svg>
    </View>
  );
};

export default AuroraSky;

