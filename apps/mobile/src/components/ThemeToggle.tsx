import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeMeta } from "../lib/theme";

interface Props {
  current: ThemeMeta;
  onNext: () => void;
}

const ThemeToggle = ({ current, onNext }: Props) => {
  return (
    <Pressable style={styles.container} onPress={onNext}>
      <View style={styles.icon}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotTwo]} />
        <View style={[styles.dot, styles.dotThree]} />
      </View>
      <Text style={styles.label}>{current.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
    padding: 6
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 224, 180, 0.55)",
    position: "absolute",
    top: "20%",
    left: "30%"
  },
  dotTwo: {
    top: "50%",
    left: "60%",
    backgroundColor: "rgba(150, 217, 255, 0.45)"
  },
  dotThree: {
    top: "70%",
    left: "35%",
    backgroundColor: "rgba(255, 150, 215, 0.45)"
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    letterSpacing: 0.3
  }
});

export default ThemeToggle;

