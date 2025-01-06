import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: "#FF9432",
  secondary: "#2C1810",
  background: "#F8F9FA",
  white: "#FFFFFF",
  gray: "#666666",
  lightGray: "#F0F0F0",
  error: "#FF3B30",
  accent: "#4CAF50"
};

export const SIZES = {
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,
  padding: 16,
  radius: 12,
};

const styles = {
  COLORS,
  SIZES
};

export default styles; 