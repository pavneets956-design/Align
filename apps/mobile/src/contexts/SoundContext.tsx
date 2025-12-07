/**
 * Sound Context
 * Provides global sound on/off toggle and sound playback utilities
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundName: 'open' | 'engine_transition' | 'message') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const playSound = useCallback((soundName: 'open' | 'engine_transition' | 'message') => {
    if (!soundEnabled) return;

    try {
      const Sound = require('react-native-sound').default;
      if (!Sound) return;

      Sound.setCategory('Playback');

      // Map sound names to files (place in android/app/src/main/res/raw/)
      const soundFiles: Record<string, string> = {
        open: 'open.mp3',
        engine_transition: 'transition.mp3', // Optional - can reuse open.mp3 if not available
        message: 'message.mp3', // Optional - can reuse open.mp3 if not available
      };

      const fileName = soundFiles[soundName] || 'open.mp3';
      const sound = new Sound(fileName, Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
          // Gracefully fail - sound file not found
          return;
        }

        sound.setVolume(0.2); // 20% volume - subtle
        sound.play((success: boolean) => {
          if (success) {
            sound.release();
          }
        });
      });
    } catch (error) {
      // Sound library not available - silently fail
    }
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    // Return no-op functions if context not available
    return {
      soundEnabled: false,
      toggleSound: () => {},
      playSound: () => {},
    };
  }
  return context;
};

