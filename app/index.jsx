import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Barrita from "../components/barrita";
import { SafeAreaView } from "react-native-safe-area-context";
import chemex from "../utils/chemex.jpg";

const { width } = Dimensions.get('window');

const coffeeData = [
  { id: "1", name: "Café Arábica", origin: "Colombia", image: chemex },
  {
    id: "2",
    name: "Café Robusta",
    origin: "Vietnam",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Café Geisha",
    origin: "Panamá",
    image: "https://via.placeholder.com/150",
  },
];

const coffeeFacts = [
  "El café es la segunda bebida más consumida del mundo, solo después del agua.",
  "El café fue descubierto por un pastor en Etiopía que notó el efecto energético en sus cabras.",
  "El café contiene más de 1000 compuestos diferentes.",
  "El café puede mejorar la memoria y la concentración.",
  "El 70% del café consumido es Arábica.",
];

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderCoffeeCard = ({ item, index }) => {
    const inputRange = [0, 1];
    const translateX = fadeAnim.interpolate({
      inputRange,
      outputRange: [50 * (index + 1), 0],
    });

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['#4b6cb7', '#182848']}
          style={styles.cardGradient}
        >
          <Image
            source={typeof item.image === "string" ? { uri: item.image } : item.image}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.origin}</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.title}>Cata de Café</Text>
          </Animated.View>

          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateX: slideAnim }] 
          }}>
            <Image
              source={{ uri: "https://via.placeholder.com/300x150" }}
              style={styles.bannerImage}
            />
            <Text style={styles.subtitle}>
              Descubre y evalúa los mejores cafés del mundo
            </Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>Cafés Disponibles</Text>
          <FlatList
            data={coffeeData}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCoffeeCard}
          />

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#FF9432', '#FF6B00']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Registrar Nueva Cata</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#4b6cb7', '#182848']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Ver Resultados</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Datos Curiosos del Café</Text>
          {coffeeFacts.map((fact, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: fadeAnim,
                transform: [{ 
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 * (index + 1), 0],
                  })
                }],
              }}
            >
              <LinearGradient
                colors={['rgba(75, 108, 183, 0.1)', 'rgba(24, 40, 72, 0.1)']}
                style={styles.factCard}
              >
                <Text style={styles.factText}>{fact}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
        
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 15,
    alignItems: "center",
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  actionContainer: {
    marginVertical: 20,
  },
  button: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  buttonGradient: {
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  factCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  factText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
