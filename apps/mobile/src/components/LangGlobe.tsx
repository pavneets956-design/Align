import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ColorValue
} from "react-native";
import { TargetLanguage } from "../lib/tts";

interface LangOption {
  value: TargetLanguage;
  label: string;
  description: string;
}

const OPTIONS: LangOption[] = [
  { value: "auto", label: "Auto", description: "Detect language" },
  { value: "pa", label: "Punjabi", description: "Punjabi sacred voice" },
  { value: "hi", label: "Hindi", description: "Hindi sacred voice" },
  { value: "en", label: "English", description: "English sacred voice" }
];

interface Props {
  value: TargetLanguage;
  onSelect: (lang: TargetLanguage) => void;
  tintColor?: ColorValue;
}

const LangGlobe = ({ value, onSelect, tintColor = "rgba(255,255,255,0.75)" }: Props) => {
  const [visible, setVisible] = useState(false);
  const displayLabel = useMemo(() => OPTIONS.find((opt) => opt.value === value)?.label ?? "Auto", [value]);

  const close = () => setVisible(false);
  const handleSelect = (lang: TargetLanguage) => {
    onSelect(lang);
    setVisible(false);
  };

  return (
    <>
      <Pressable style={styles.globeButton} onPress={() => setVisible(true)}>
        <View style={[styles.globe, { borderColor: tintColor }]}>
          <View style={styles.arcTop} />
          <View style={styles.arcMid} />
          <View style={styles.arcBottom} />
        </View>
        <Text style={styles.globeText}>{displayLabel}</Text>
      </Pressable>
      <Modal animationType="fade" transparent visible={visible} onRequestClose={close}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose Language</Text>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                {
                  backgroundColor: option.value === value ? "rgba(255, 223, 186, 0.2)" : "transparent"
                }
              ]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  globeButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  globe: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  arcTop: {
    position: "absolute",
    top: 9,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  arcMid: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  arcBottom: {
    position: "absolute",
    bottom: 9,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  globeText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    letterSpacing: 0.4
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)"
  },
  modalContent: {
    position: "absolute",
    top: "30%",
    right: 20,
    left: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(14, 10, 22, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 12
  },
  modalTitle: {
    color: "#f9f3dd",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8
  },
  option: {
    paddingVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 14
  },
  optionLabel: {
    color: "#f6e9d4",
    fontSize: 16,
    fontWeight: "600"
  },
  optionDescription: {
    color: "rgba(246, 233, 212, 0.7)",
    fontSize: 12,
    marginTop: 2
  }
});

export default LangGlobe;

