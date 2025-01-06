import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../utils/styles';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mapa en construcción</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
}); 