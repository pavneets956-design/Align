import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const TestScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Talking Light App</Text>
      <Text style={styles.subtext}>If you see this, the app is working!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

