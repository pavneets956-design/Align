// Web Audio API wrapper for sound effects

let audioContext: AudioContext | null = null;
let soundBuffers: Map<string, AudioBuffer> = new Map();

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const loadSound = async (url: string): Promise<AudioBuffer> => {
  if (soundBuffers.has(url)) {
    return soundBuffers.get(url)!;
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = getAudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.warn("Failed to load sound:", url, error);
    throw error;
  }
};

export const playSound = async (url: string, volume: number = 1.0) => {
  try {
    const audioContext = getAudioContext();
    
    // Resume context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const buffer = await loadSound(url);
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start(0);
  } catch (error) {
    console.warn("Failed to play sound:", url, error);
  }
};

