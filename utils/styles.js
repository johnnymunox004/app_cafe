import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4A2C2A',    // Marrón café oscuro
  secondary: '#8B4513',  // Marrón café claro
  accent: '#FF9432',     // Naranja cálido
  background: '#F5F5F5', // Gris muy claro
  white: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999'
  },
  success: '#4CAF50',
  error: '#FF5252'
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 20,
  radius: 12,
  width,
  height
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400'
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500'
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700'
  }
};

export const SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5
  }
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  gradientContainer: {
    flex: 1,
    padding: SIZES.padding
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.light
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.base * 2,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.base
  },
  text: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.base
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginVertical: SIZES.base
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '600'
  },
  imageContainer: {
    width: '100%',
    height: height * 0.3,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
    ...SHADOWS.medium
  },
  image: {
    width: '100%',
    height: '100%'
  },
  progressContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.base,
    ...SHADOWS.light
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base * 2,
    ...SHADOWS.light
  }
}); 