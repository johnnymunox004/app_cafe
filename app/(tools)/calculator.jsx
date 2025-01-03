import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions,ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Barrita from "../../components/barrita";

const { width } = Dimensions.get('window');

export default function CoffeeCalculator() {
  const [coffeeGrams, setCoffeeGrams] = useState(15);
  const [ratio, setRatio] = useState(16);

  const waterMl = coffeeGrams * ratio;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Calculadora de Café</Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Café (gramos)</Text>
            <Slider
              value={coffeeGrams}
              onValueChange={(value) => setCoffeeGrams(value)}
              minimumValue={10}
              maximumValue={30}
              step={1}
              minimumTrackTintColor="#FF9432"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#FF9432"
            />
            <Text style={styles.value}>{Math.round(coffeeGrams)}g</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Ratio (1:{ratio})</Text>
            <Slider
              value={ratio}
              onValueChange={(value) => setRatio(value)}
              minimumValue={12}
              maximumValue={20}
              step={1}
              minimumTrackTintColor="#FF9432"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#FF9432"
            />
            <Text style={styles.value}>1:{Math.round(ratio)}</Text>
          </View>

          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Agua necesaria:</Text>
            <Text style={styles.resultValue}>{Math.round(waterMl)}ml</Text>
          </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  sliderContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  value: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 5,
  },
  thumb: {
    backgroundColor: '#FF9432',
    width: 20,
    height: 20,
  },
  track: {
    height: 6,
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF9432',
  },
}); 