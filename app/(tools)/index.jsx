import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Barrita from "../../components/barrita";

const { width } = Dimensions.get('window');

const features = [
  {
    id: 'calculator',
    name: 'Calculadora',
    icon: 'calculator',
    color: ['#4CAF50', '#2E7D32'],
    description: 'Calcula la proporción perfecta de café y agua'
  },
  {
    id: 'scanner',
    name: 'Escáner',
    icon: 'camera',
    color: ['#9C27B0', '#6A1B9A'],
    description: 'Analiza la calidad de tus granos de café'
  },
  {
    id: 'history',
    name: 'Historial',
    icon: 'chart-bar',
    color: ['#2196F3', '#1976D2'],
    description: 'Revisa tu historial de preparaciones'
  },
  {
    id: 'map',
    name: 'Cafeterías',
    icon: 'map-marker-alt',
    color: ['#795548', '#5D4037'],
    description: 'Encuentra las mejores cafeterías cercanas'
  }
];

export default function Tools() {
  const router = useRouter();

  const handleCardPress = (id) => {
    router.push(id);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Herramientas de Café</Text>
          <Text style={styles.subtitle}>
            Todo lo que necesitas para tu experiencia cafetera
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => handleCardPress(feature.id)}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={feature.color}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 
                    name={feature.icon} 
                    size={30} 
                    color="white" 
                  />
                </View>
                <Text style={styles.cardTitle}>{feature.name}</Text>
                <Text style={styles.cardDescription}>
                  {feature.description}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
      <Barrita />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    minHeight: '100%',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardWrapper: {
    width: width / 2 - 20,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
});