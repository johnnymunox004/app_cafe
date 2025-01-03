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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Barrita from "../components/barrita";

const { width } = Dimensions.get('window');

export default function Explore() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const coffeeMethods = [
    {
      name: "Café Filtrado",
      icon: "☕",
      gradient: ['#FFB75E', '#ED8F03'],
      description:
        "El café filtrado es uno de los métodos más comunes y fáciles de preparar. Se utiliza un filtro de papel para separar los granos molidos del agua caliente.",
      measures: {
        "1 persona": "10g de café, 150ml de agua",
        "2 personas": "20g de café, 300ml de agua",
        "4 personas": "40g de café, 600ml de agua",
      },
      preparation:
        "1. Coloca el filtro en la cafetera.\n2. Agrega el café molido.\n3. Vierte agua caliente sobre el café.\n4. Espera a que el agua se filtre y sirve el café.",
    },
    {
      name: "Café Espresso",
      icon: "⚡",
      gradient: ['#2193b0', '#6dd5ed'],
      description:
        "El espresso es un método de preparación de café concentrado y fuerte, popular en muchas cafeterías. Requiere una máquina de espresso.",
      measures: {
        "1 persona": "18g de café, 30ml de agua",
        "2 personas": "36g de café, 60ml de agua",
      },
      preparation:
        "1. Llena el portafiltro con café molido.\n2. Presiona ligeramente el café.\n3. Coloca el portafiltro en la máquina de espresso.\n4. Extrae el café a alta presión.",
    },
    {
      name: "Prensa Francesa",
      icon: "🌟",
      gradient: ['#FF416C', '#FF4B2B'],
      description:
        "La prensa francesa es ideal para aquellos que buscan un café más espeso y aceitoso. Se utiliza una prensa manual para filtrar los granos.",
      measures: {
        "1 persona": "12g de café, 200ml de agua",
        "2 personas": "24g de café, 400ml de agua",
        "4 personas": "48g de café, 800ml de agua",
      },
      preparation:
        "1. Agrega el café molido en la prensa.\n2. Vierte agua caliente sobre el café.\n3. Coloca la tapa y deja reposar por 4 minutos.\n4. Presiona el émbolo y sirve.",
    },
    {
      name: "AeroPress",
      icon: "🔄",
      gradient: ['#834d9b', '#d04ed6'],
      description:
        "La AeroPress es un dispositivo manual que permite preparar un café similar al espresso pero con una textura más suave.",
      measures: {
        "1 persona": "14g de café, 200ml de agua",
        "2 personas": "28g de café, 400ml de agua",
      },
      preparation:
        "1. Coloca el café molido en la AeroPress.\n2. Agrega agua caliente hasta la marca indicada.\n3. Remueve y coloca el émbolo.\n4. Presiona el café hacia abajo.",
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
});
