import * as Haptics from "expo-haptics";

export const arrivalPulseStart = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // noop
  }
};

export const arrivalPulseEnd = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // noop
  }
};

export const micPressTick = async () => {
  try {
    await Haptics.selectionAsync();
  } catch {
    // noop
  }
};

export const micReleaseTick = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // noop
  }
};

export const themeCyclePulse = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // noop
  }
};

