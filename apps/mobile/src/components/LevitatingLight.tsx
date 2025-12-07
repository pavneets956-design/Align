import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface Props {
  active?: boolean;
}

const LevitatingLight = ({ active = true }: Props) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breath = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 4000, useNativeDriver: true }),
          Animated.timing(translateAnim, { toValue: -6, duration: 4000, useNativeDriver: true })
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 0.92, duration: 4000, useNativeDriver: true }),
          Animated.timing(translateAnim, { toValue: 4, duration: 4000, useNativeDriver: true })
        ])
      ])
    );
    breath.start();
    return () => breath.stop();
  }, [scaleAnim, translateAnim]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: active ? 1.02 : 0.92,
      damping: 12,
      stiffness: 90,
      useNativeDriver: true
    }).start();
  }, [active, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { translateY: translateAnim }]
        }
      ]}
    >
      <Animated.View style={styles.glow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 240, 200, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 240, 200, 0.25)"
  },
  glow: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 228, 160, 0.48)",
    shadowColor: "#f8dfa4",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30
  }
});

export default LevitatingLight;

