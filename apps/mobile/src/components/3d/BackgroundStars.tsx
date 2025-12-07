/**
 * Background Star Field
 * Tiny slow-moving dots/stars for depth
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Engine, getEngineTheme } from '../../theme/engineThemes';
import { useMotion } from '../../contexts/MotionContext';

interface BackgroundStarsProps {
  engine: Engine;
}

const BackgroundStars: React.FC<BackgroundStarsProps> = ({ engine }) => {
  const theme = getEngineTheme(engine);
  const { reduceMotion } = useMotion();
  
  const stars = useMemo(() => {
    if (reduceMotion) return [];
    
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      anim: new Animated.Value(Math.random()),
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || stars.length === 0) return;
    
    stars.forEach((star) => {
      Animated.loop(
        Animated.timing(star.anim, {
          toValue: Math.random(),
          duration: 8000 + Math.random() * 4000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    });
    
    return () => {
      stars.forEach((s) => s.anim.stopAnimation());
    };
  }, [stars, reduceMotion]);

  if (reduceMotion || stars.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star) => {
        const opacity = star.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.2, 0.6, 0.2],
        });

        return (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: opacity as any,
                backgroundColor: theme.particleSecondary,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});

export default BackgroundStars;

