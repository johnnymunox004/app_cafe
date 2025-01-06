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
import chemex from "../utils/images/chemex.jpg";
import v6034 from "../utils/images/v6034.jpg";
import prensa12 from "../utils/images/prensa12.jpg";

const { width } = Dimensions.get('window');

const preparationMethods = [
  { 
    id: "1", 
    name: "Chemex", 
    description: "Método por goteo que resalta notas florales y afrutadas", 
    image: chemex 
  },
  {
    id: "2",
    name: "V60",
    description: "Método manual que destaca la claridad y limpieza del café",
    image: v6034
  },
  {
    id: "3",
    name: "Prensa Francesa",
    description: "Método de inmersión que produce un café robusto y con cuerpo",
    image: prensa12
  },
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

  const renderMethodCard = ({ item, index }) => {
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
            source={item.image}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
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
            <Text style={styles.title}>Métodos de Preparación</Text>
          </Animated.View>

          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateX: slideAnim }] 
          }}>
            <Text style={styles.subtitle}>
              Descubre diferentes formas de preparar tu café
            </Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>Métodos Disponibles</Text>
          <FlatList
            data={preparationMethods}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMethodCard}
          />

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#FF9432', '#FF6B00']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Nueva Evaluación</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#4b6cb7', '#182848']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Ver Historial</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    width: 200,
  },
  cardGradient: {
    padding: 15,
    alignItems: "center",
  },
  cardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
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
});
