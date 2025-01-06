import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../utils/styles';
import Barrita from '../../components/barrita';

export default function CalculatorScreen() {
  const [selectedType, setSelectedType] = useState(null);
  const [weight, setWeight] = useState('');
  const [yieldFactor, setYieldFactor] = useState('');
  const [result, setResult] = useState(null);

  const coffeeTypes = [
    { id: '1', name: 'Café Arábica' },
    { id: '2', name: 'Café Robusta' },
    { id: '3', name: 'Café Blend' },
  ];

  const calculateYield = () => {
    if (weight && yieldFactor) {
      const calculatedYield = parseFloat(weight) * parseFloat(yieldFactor);
      setResult(calculatedYield.toFixed(2));
    } else {
      setResult(null);
      alert('Por favor, ingrese todos los valores necesarios.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calculadora de Café</Text>

      <FlatList
        data={coffeeTypes}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedType === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedType(item.id)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso del café (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Factor de rendimiento"
        keyboardType="numeric"
        value={yieldFactor}
        onChangeText={setYieldFactor}
      />

      <TouchableOpacity style={styles.button} onPress={calculateYield}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={styles.result}>Rendimiento: {result} kg</Text>
      )}

      <Barrita />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: COLORS.selectedCard,
  },
  cardText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: SIZES.medium,
  },
  result: {
    fontSize: SIZES.large,
    color: COLORS.secondary,
    textAlign: 'center',
    marginVertical: 20,
  },
});
