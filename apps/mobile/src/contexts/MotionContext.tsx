/**
 * Motion Context
 * Provides reduce motion preference for accessibility
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

interface MotionContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check system reduce motion preference on mount
  const [reduceMotion, setReduceMotion] = useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    } else {
      // Android doesn't have this API, but we can still allow manual toggle
      setReduceMotion(false);
    }
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion(prev => !prev);
  }, []);

  return (
    <MotionContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    return {
      reduceMotion: false,
      toggleReduceMotion: () => {},
    };
  }
  return context;
};

