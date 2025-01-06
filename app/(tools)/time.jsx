import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { COLORS, SIZES } from '../../utils/styles';
import Barrita from '../../components/barrita';

// Definir los estilos base aquí en lugar de depender de GlobalStyles
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradientContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  }
});

// Configurar las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Definir los métodos de preparación
const brewingMethods = [
  {
    id: 1,
    name: "Prensa Francesa",
    time: 240, // 4 minutos
    steps: [
      { time: 30, description: "Verter agua y remover" },
      { time: 210, description: "Esperar" },
      { time: 0, description: "Presionar y servir" }
    ],
    icon: "cafe"
  },
  {
    id: 2,
    name: "Chemex",
    time: 180, // 3 minutos
    steps: [
      { time: 30, description: "Bloom" },
      { time: 90, description: "Primera vertida" },
      { time: 60, description: "Segunda vertida" }
    ],
    icon: "beaker"
  },
  {
    id: 3,
    name: "V60",
    time: 150, // 2:30 minutos
    steps: [
      { time: 30, description: "Bloom" },
      { time: 60, description: "Primera vertida circular" },
      { time: 60, description: "Vertidas finales" }
    ],
    icon: "filter"
  },
  {
    id: 4,
    name: "Aeropress",
    time: 90, // 1:30 minutos
    steps: [
      { time: 30, description: "Agregar agua y remover" },
      { time: 60, description: "Presionar" }
    ],
    icon: "flask"
  }
];

export default function TimeScreen() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('¡Permiso requerido!', 'Necesitamos tu permiso para enviar notificaciones.');
      }
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleStepComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStepComplete = async () => {
    if (!selectedMethod) return;

    const currentStepData = selectedMethod.steps[currentStep];
    
    if (currentStep < selectedMethod.steps.length - 1) {
      // Notificar siguiente paso
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `¡Siguiente paso! - ${selectedMethod.name}`,
          body: selectedMethod.steps[currentStep + 1].description,
        },
        trigger: null,
      });

      Alert.alert(
        "¡Paso completado!",
        `Siguiente: ${selectedMethod.steps[currentStep + 1].description}`,
        [{ text: "OK", onPress: () => setCurrentStep(currentStep + 1) }]
      );
    } else {
      // Notificar finalización
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Tu café está listo! ☕",
          body: "Es hora de disfrutar tu delicioso café.",
        },
        trigger: null,
      });

      Alert.alert(
        "¡Preparación completada! ✨",
        "Es momento de disfrutar tu delicioso café.",
        [
          { 
            text: "¡A disfrutar!", 
            onPress: resetTimer,
            style: "default"
          }
        ]
      );
    }
  };

  const selectMethod = (method) => {
    setSelectedMethod(method);
    setTimeLeft(method.time);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (selectedMethod) {
      setTimeLeft(selectedMethod.time);
      setCurrentStep(0);
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={baseStyles.container}>
      <ScrollView>
        <LinearGradient 
          colors={[COLORS.background, '#E5E5E5']} 
          style={baseStyles.gradientContainer}
        >
          <Text style={baseStyles.title}>Temporizador</Text>

          <View style={styles.methodsContainer}>
            {brewingMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod?.id === method.id && styles.selectedMethod
                ]}
                onPress={() => selectMethod(method)}
              >
                <Ionicons name={method.icon} size={24} color={COLORS.primary} />
                <Text style={styles.methodName}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMethod && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={toggleTimer}
                >
                  <Ionicons 
                    name={isRunning ? "pause" : "play"} 
                    size={24} 
                    color={COLORS.white} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={resetTimer}
                >
                  <Ionicons name="refresh" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.stepsContainer}>
                {selectedMethod.steps.map((step, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.stepCard,
                      currentStep === index && styles.currentStep
                    ]}
                  >
                    <Text style={styles.stepText}>{step.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </LinearGradient>
        <Barrita />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.padding
  },
  methodCard: {
    width: '48%',
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedMethod: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  methodName: {
    marginTop: SIZES.base,
    color: COLORS.primary,
    fontSize: SIZES.medium
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: SIZES.extraLarge
  },
  timerText: {
    fontSize: SIZES.extraLarge * 2,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  controls: {
    flexDirection: 'row',
    marginTop: SIZES.large
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base
  },
  stepsContainer: {
    width: '100%',
    marginTop: SIZES.extraLarge
  },
  stepCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderRadius: SIZES.radius
  },
  currentStep: {
    backgroundColor: COLORS.lightGray,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary
  },
  stepText: {
    fontSize: SIZES.medium,
    color: COLORS.primary
  }
});
