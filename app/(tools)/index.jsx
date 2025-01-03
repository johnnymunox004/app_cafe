import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles, COLORS, SIZES, SHADOWS } from '../../utils/styles';

const tools = [
  {
    id: 1,
    title: "Escáner de Granos",
    description: "Analiza el nivel de tostión de tus granos de café",
    icon: "scan",
    route: "/(tools)/scanner",
    gradient: [COLORS.accent, COLORS.secondary]
  },
  {
    id: 2,
    title: "Calculadora de Café",
    description: "Calcula las proporciones perfectas para tu café",
    icon: "calculator",
    route: "/(tools)/calculator",
    gradient: [COLORS.secondary, COLORS.primary]
  },
  {
    id: 3,
    title: "Mapa de Cafeterías",
    description: "Encuentra las mejores cafeterías cerca de ti",
    icon: "map",
    route: "/(tools)/map",
    gradient: [COLORS.primary, '#2C1810']
  }
  ,  {
    id: 4,
    title: "Historial de Catas",
    description: "mira las catciones que has hecho",
    icon: "history",
    route: "/(tools)/history",
    gradient: [COLORS.primary, '#2C1810']
  }
];

export default function ToolsScreen() {
  return (
    <ScrollView style={GlobalStyles.container}>
      <LinearGradient
        colors={[COLORS.background, '#E5E5E5']}
        style={GlobalStyles.gradientContainer}
      >
        <Text style={GlobalStyles.title}>Herramientas</Text>
        
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <Link href={tool.route} key={tool.id} asChild>
              <TouchableOpacity style={styles.toolCard}>
                <LinearGradient
                  colors={tool.gradient}
                  style={styles.toolGradient}
                >
                  <Ionicons name={tool.icon} size={SIZES.extraLarge * 1.5} color={COLORS.white} />
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.padding
  },
  toolCard: {
    width: '48%',
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium
  },
  toolGradient: {
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  toolTitle: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.small
  },
  toolDescription: {
    color: COLORS.white,
    fontSize: SIZES.small,
    textAlign: 'center',
    opacity: 0.8
  }
});