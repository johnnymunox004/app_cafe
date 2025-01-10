import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Barrita from '@/components/barrita'; 

const EXCELSO_STANDARD = 70; // Peso estándar de café excelso (70kg)

export default function CoffeeYieldCalculator() {
  const [pergaminoWeight, setPergaminoWeight] = useState('');
  const [yieldFactor, setYieldFactor] = useState(null);
  const [quality, setQuality] = useState('');

  const calculateYieldFactor = () => {
    if (!pergaminoWeight) return;

    const weight = parseFloat(pergaminoWeight);
    const factor = (weight * EXCELSO_STANDARD) / EXCELSO_STANDARD;
    setYieldFactor(factor.toFixed(2));

    // Determinar la calidad basada en el factor
    if (factor < 85) {
      setQuality('Calidad Premium');
    } else if (factor <= 90) {
      setQuality('Calidad Estándar');
    } else {
      setQuality('Calidad por Mejorar');
    }
  };

  const getQualityColor = () => {
    if (!yieldFactor) return '#000';
    const factor = parseFloat(yieldFactor);
    if (factor < 85) return '#4CAF50';
    if (factor <= 90) return '#FFC107';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="coffee" size={40} color="#8B4513" />
        <Text style={styles.title}>Factor de Rendimiento</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoText}>
          El factor de rendimiento indica cuántos kilos de café pergamino seco se 
          necesitan para obtener 70kg de café excelso.
        </Text>
        <Text style={styles.infoText}>
          Un factor menor a 85 indica calidad premium.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Peso de Café Pergamino Seco (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={pergaminoWeight}
          onChangeText={setPergaminoWeight}
          placeholder="Ingrese el peso en kilogramos"
          placeholderTextColor="#9E9E9E"
        />
      </View>

      <TouchableOpacity 
        style={styles.calculateButton}
        onPress={calculateYieldFactor}
      >
        <Icon name="calculator" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Calcular Factor</Text>
      </TouchableOpacity>

      {yieldFactor && (
        <View style={styles.resultContainer}>
          <View style={[styles.resultCard, { borderLeftColor: getQualityColor() }]}>
            <Text style={styles.resultTitle}>Factor de Rendimiento</Text>
            <Text style={styles.resultValue}>{yieldFactor}</Text>
            <Text style={[styles.qualityText, { color: getQualityColor() }]}>
              {quality}
            </Text>
          </View>

          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>¿Qué significa?</Text>
            <Text style={styles.explanationText}>
              Se necesitan {yieldFactor} kg de café pergamino seco para producir 
              70 kg de café excelso.
            </Text>
          </View>

        </View>
      )}
      <Barrita />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  calculateButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 24,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  qualityText: {
    fontSize: 20,
    fontWeight: '500',
  },
  explanationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});