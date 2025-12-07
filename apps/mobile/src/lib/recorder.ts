import { Audio, AVPlaybackStatus } from "expo-av";

export interface RecordingResult {
  uri: string | null;
  durationMillis: number;
}

let activeRecording: Audio.Recording | null = null;

export const startRecording = async () => {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Microphone permission not granted");
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  activeRecording = recording;
};

export const stopRecording = async (): Promise<RecordingResult | null> => {
  if (!activeRecording) {
    return null;
  }

  try {
    await activeRecording.stopAndUnloadAsync();
  } catch {
    activeRecording = null;
    return null;
  }

  let durationMillis = 0;
  try {
    const status = (await activeRecording.getStatusAsync()) as AVPlaybackStatus & {
      durationMillis?: number;
    };
    durationMillis = status.durationMillis ?? 0;
  } catch {
    // ignore
  }

  const uri = activeRecording.getURI();
  const result = { uri, durationMillis };
  activeRecording = null;
  return result;
};

