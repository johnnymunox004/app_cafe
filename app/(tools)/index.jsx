import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/styles';

const tools = [
  {
    id: 1,
    title: "Temporizador",
    description: "Controla el tiempo de preparación",
    icon: "timer",
    route: "/(tools)/time",
    gradient: [COLORS.accent, COLORS.primary]
  },
  {
    id: 2,
    title: "Mapa",
    description: "Encuentra cafeterías cercanas",
    icon: "map",
    route: "/(tools)/map",
    gradient: [COLORS.primary, COLORS.secondary]
  },
  {
    id: 3,
    title: "Calculadora",
    description: "Calcula proporciones de café",
    icon: "calculator",
    route: "/(tools)/calculator",
    gradient: [COLORS.secondary, COLORS.accent]
  },
  {
    id: 4,
    title: "Historial",
    description: "Ver evaluaciones guardadas",
    icon: "book",
    route: "/(tools)/history",
    gradient: [COLORS.accent, COLORS.primary]
  }
];

export default function ToolsIndex() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.card}
            onPress={() => router.push(tool.route)}
          >
            <Ionicons name={tool.icon} size={24} color={COLORS.primary} />
            <Text style={styles.title}>{tool.title}</Text>
            <Text style={styles.description}>{tool.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  grid: {
    padding: SIZES.padding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: SIZES.small,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
});