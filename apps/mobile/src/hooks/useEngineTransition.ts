/**
 * Engine Transition Hook
 * Manages smooth transitions between engine themes with animations
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Engine } from '../types/align';

interface UseEngineTransitionOptions {
  engine: Engine;
  duration?: number;
  onTransitionComplete?: () => void;
}

export function useEngineTransition({
  engine,
  duration = 3000,
  onTransitionComplete,
}: UseEngineTransitionOptions) {
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const prevEngine = useRef<Engine>(engine);

  useEffect(() => {
    if (prevEngine.current !== engine) {
      // Start transition
      transitionAnim.setValue(0);
      
      Animated.timing(transitionAnim, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        prevEngine.current = engine;
        onTransitionComplete?.();
      });
    }
  }, [engine, duration]);

  return {
    transitionProgress: transitionAnim,
    isTransitioning: prevEngine.current !== engine,
  };
}

