import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Barrita from "../components/barrita";
import chemex from "../utils/images/chemex.jpg";
import chemex43 from "../utils/images/chemex43.jpg";
import prensa12 from "../utils/images/prensa12.jpg";
import seleccio32 from "../utils/images/seleccio32.jpg";
import taza from "../utils/images/taza.jpg";
import v6034 from "../utils/images/v6034.jpg";

const { width } = Dimensions.get('window');

export default function Explore() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const coffeeMethods = [
    {
      name: "Chemex",
      icon: "☕",
      image: chemex,
      secondaryImage: chemex43,
      gradient: ['#FFB75E', '#ED8F03'],
      description:
        "El método Chemex resalta las notas florales y afrutadas del café. Produce una bebida limpia y brillante.",
      measures: {
        "1 persona": "15g de café, 250ml de agua",
        "2 personas": "30g de café, 500ml de agua",
        "4 personas": "60g de café, 1000ml de agua",
      },
      preparation:
        "1. Coloca el filtro en la Chemex y enjuágalo.\n2. Agrega el café molido medio-grueso.\n3. Vierte agua a 93°C en forma circular.\n4. El tiempo total debe ser 4-5 minutos.",
    },
    {
      name: "V60",
      icon: "🌟",
      image: v6034,
      secondaryImage: taza,
      gradient: ['#2193b0', '#6dd5ed'],
      description:
        "El V60 es conocido por su capacidad para resaltar la claridad y los sabores delicados del café.",
      measures: {
        "1 persona": "15g de café, 250ml de agua",
        "2 personas": "30g de café, 500ml de agua",
      },
      preparation:
        "1. Coloca el filtro y enjuágalo.\n2. Agrega café molido medio.\n3. Realiza el bloom con 30-45ml de agua.\n4. Vierte el resto del agua en espirales.",
    },
    {
      name: "Prensa Francesa",
      icon: "⚡",
      image: prensa12,
      secondaryImage: seleccio32,
      gradient: ['#FF416C', '#FF4B2B'],
      description:
        "La prensa francesa produce un café robusto y con cuerpo completo. Ideal para quienes disfrutan un café intenso.",
      measures: {
        "1 persona": "15g de café, 250ml de agua",
        "2 personas": "30g de café, 500ml de agua",
        "4 personas": "60g de café, 1000ml de agua",
      },
      preparation:
        "1. Agrega café molido grueso.\n2. Vierte agua a 95°C.\n3. Espera 4 minutos.\n4. Presiona el émbolo lentamente.",
    },
  ];

  const openModal = (method) => {
    setSelectedMethod(method);
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  React.useEffect(() => {
    Animated.stagger(100, 
      coffeeMethods.map((_, i) => 
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: i * 100,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Métodos de Preparación</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {coffeeMethods && coffeeMethods.map((method, index) => (
            <Animated.View
              key={index}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [width, 0],
                      }),
                    },
                  ],
                  opacity: slideAnim,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => openModal(method)}
              >
                <LinearGradient
                  colors={method.gradient}
                  style={styles.cardGradient}
                >
                  <Image 
                    source={method.image}
                    style={styles.methodImage}
                  />
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <Text style={styles.cardTitle}>{method.name}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {method.description}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {selectedMethod && (
                <LinearGradient
                  colors={selectedMethod.gradient}
                  style={styles.modalGradient}
                >
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.backButtonText}>←</Text>
                  </TouchableOpacity>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                      <Image 
                        source={selectedMethod.image}
                        style={styles.modalMainImage}
                      />
                      <Image 
                        source={selectedMethod.secondaryImage}
                        style={styles.modalSecondaryImage}
                      />
                    </View>

                    <Text style={styles.modalIcon}>{selectedMethod.icon}</Text>
                    <Text style={styles.modalTitle}>{selectedMethod.name}</Text>
                    <Text style={styles.modalDescription}>
                      {selectedMethod.description}
                    </Text>
                    
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Medidas recomendadas:</Text>
                      {Object.entries(selectedMethod.measures).map((
                        [key, value],
                        index
                      ) => (
                        <View key={index} style={styles.measureItem}>
                          <Text style={styles.measureText}>
                            {key}: {value}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Preparación:</Text>
                      <Text style={styles.preparationText}>
                        {selectedMethod.preparation}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </LinearGradient>
              )}
            </Animated.View>
          </View>
        </Modal>
        <Barrita />

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
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
    padding: 20,
    borderRadius: 15,
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 20,
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  measureItem: {
    marginBottom: 5,
  },
  measureText: {
    fontSize: 16,
    color: "#fff",
  },
  preparationText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  methodImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  modalMainImage: {
    width: '60%',
    height: 200,
    borderRadius: 15,
    marginRight: 5,
  },
  modalSecondaryImage: {
    width: '38%',
    height: 200,
    borderRadius: 15,
  },
});
