import { useEffect, useRef } from "react";
import { Animated, GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";

interface Props {
  isRecording: boolean;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
}

const MicButton = ({ isRecording, onPressIn, onPressOut }: Props) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.96, duration: 600, useNativeDriver: true })
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      Animated.spring(pulseAnim, {
        toValue: 1,
        damping: 8,
        mass: 0.8,
        useNativeDriver: true
      }).start();
    }
  }, [isRecording, pulseAnim]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={styles.container}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: pulseAnim }],
            backgroundColor: isRecording ? "rgba(255, 105, 97, 0.85)" : "rgba(255, 214, 153, 0.65)"
          }
        ]}
      >
        <View style={styles.inner} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#fce7b5",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }
  },
  inner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(32, 10, 18, 0.85)"
  }
});

export default MicButton;

