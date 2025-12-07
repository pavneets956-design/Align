/**
 * Premium 3D Paywall Portal Modal
 * "Unlock Portal" - A literal 3D gateway that opens
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getEngineTheme } from '../../theme/engineThemes';
import { useSound } from '../../contexts/SoundContext';

interface PaywallPortal3DProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason?: 'bigger_plan' | 'save_routine';
}

const { width, height } = Dimensions.get('window');

const PaywallPortal3D: React.FC<PaywallPortal3DProps> = ({
  visible,
  onClose,
  onUpgrade,
  reason,
}) => {
  const theme = getEngineTheme('plan'); // Portal uses plan theme (teal/silver)
  const { playSound } = useSound();
  
  const portalScale = useRef(new Animated.Value(0)).current;
  const portalRotation = useRef(new Animated.Value(0)).current;
  const lockAnim = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      // Portal opening sequence
      Animated.sequence([
        // Portal materializes
        Animated.parallel([
          Animated.spring(portalScale, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: false, // JS driver for consistency with shadow animations
          }),
          Animated.loop(
            Animated.timing(portalRotation, {
              toValue: 1,
              duration: 8000,
              easing: Easing.linear,
              useNativeDriver: false, // JS driver for consistency
            })
          ),
        ]),
        // Lock disengages
        Animated.timing(lockAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false, // JS driver for consistency
        }),
        ]).start(() => {
        setPortalOpen(true);
        // Content fades in
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false, // JS driver for consistency
        }).start();
        
        // Play portal open sound
        playSound('engine_transition');
        
        // Start glowing pulse animation - JS driver required for shadow properties
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowPulse, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // shadowOpacity doesn't support native driver
            }),
            Animated.timing(glowPulse, {
              toValue: 0,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false, // shadowOpacity doesn't support native driver
            }),
          ])
        ).start();
      });
    } else {
      // Reset on close
      portalScale.setValue(0);
      lockAnim.setValue(1);
      contentOpacity.setValue(0);
      glowPulse.setValue(0);
      setPortalOpen(false);
    }
  }, [visible]);

  const rotation = portalRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const lockRotation = lockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['45deg', '0deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Darkened background */}
        <View style={styles.darkBackground} />
        
        {/* Portal center */}
        <View style={styles.portalContainer}>
          {/* Outer portal ring with pulsing glow */}
          <Animated.View
            style={[
              styles.portalRing,
              {
                transform: [
                  { scale: portalScale },
                  { rotate: rotation },
                ],
                borderColor: theme.primary,
                shadowColor: theme.primary,
                shadowOpacity: glowPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
                shadowRadius: glowPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 40],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[theme.primary, theme.secondary, theme.tertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Inner portal */}
          <Animated.View
            style={[
              styles.portalInner,
              {
                transform: [{ scale: portalScale }],
                opacity: portalOpen ? 1 : 0.3,
              },
            ]}
          >
            {portalOpen && (
              <LinearGradient
                colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
          </Animated.View>

          {/* Lock mechanism */}
          {!portalOpen && (
            <Animated.View
              style={[
                styles.lock,
                {
                  transform: [{ rotate: lockRotation }],
                  opacity: lockAnim,
                },
              ]}
            >
              <Text style={styles.lockIcon}>🔒</Text>
            </Animated.View>
          )}

          {/* Content inside portal */}
          {portalOpen && (
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: contentOpacity,
                },
              ]}
            >
              <Text style={styles.title}>Unlock Your Full 30-Day Plan</Text>
              <Text style={styles.description}>
                You're thinking bigger than a quick fix. ALIGN Pro gives you a full 30-day structure, saved routines, and deeper adjustments as you grow.
              </Text>

              {/* Features list */}
              <View style={styles.features}>
                <FeatureItem icon="✓" text="Full 30-day structured plans" theme={theme} />
                <FeatureItem icon="✓" text="Save unlimited routines" theme={theme} />
                <FeatureItem icon="✓" text="Priority support" theme={theme} />
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={onUpgrade}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.primary, theme.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade to ALIGN Pro – $9/mo
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const FeatureItem: React.FC<{ icon: string; text: string; theme: any }> = ({
  icon,
  text,
  theme,
}) => (
  <View style={styles.featureItem}>
    <Text style={[styles.featureIcon, { color: theme.primary }]}>{icon}</Text>
    <Text style={[styles.featureText, { color: theme.textPrimary }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 22, 0.95)',
  },
  portalContainer: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 6,
    shadowColor: '#40e0d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  portalInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    shadowColor: '#40e0d0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  lock: {
    position: 'absolute',
    zIndex: 10,
  },
  lockIcon: {
    fontSize: 48,
  },
  content: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e0f7fa',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#b2ebf2',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 32,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#40e0d0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002626',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#66d9ef',
  },
});

export default PaywallPortal3D;

