import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const STAR_COUNT = 40;

const createStarMap = () =>
  Array.from({ length: STAR_COUNT }).map(() => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 4000
  }));

const Starfield = () => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const stars = useMemo(createStarMap, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 2600, useNativeDriver: true })
      ])
    ).start();
  }, [opacityAnim]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="nightGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#040214" />
            <Stop offset="65%" stopColor="#100634" />
            <Stop offset="100%" stopColor="#1b0a2d" />
          </LinearGradient>
        </Defs>
        <Rect width="100" height="100" fill="url(#nightGradient)" />
        {stars.map((star, index) => (
          <AnimatedCircle
            key={`star-${index}`}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#fff8d6"
            opacity={opacityAnim}
            delay={star.delay}
          />
        ))}
      </Svg>
    </View>
  );
};

const AnimatedCircleComponent = Animated.createAnimatedComponent(Circle);

const AnimatedCircle = ({
  cx,
  cy,
  r,
  fill,
  opacity,
  delay
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: Animated.Value;
  delay: number;
}) => {
  const localOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(localOpacity, {
          toValue: 0.9,
          duration: 1600,
          delay,
          useNativeDriver: true
        }),
        Animated.timing(localOpacity, {
          toValue: 0.2,
          duration: 1800,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [delay, localOpacity]);

  const combinedOpacity = Animated.multiply(localOpacity, opacity);
  return <AnimatedCircleComponent cx={cx} cy={cy} r={r} fill={fill} opacity={combinedOpacity as unknown as number} />;
};

export default Starfield;

