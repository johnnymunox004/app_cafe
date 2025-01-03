import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import Barrita from "../../components/barrita";

const { width } = Dimensions.get('window');

export default function CoffeeHistory() {
  const monthlyData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      data: [85, 88, 92, 87, 90, 93],
      color: (opacity = 1) => `rgba(255, 148, 50, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const coffeeTypes = {
    labels: ["Arábica", "Robusta", "Blend", "Especial"],
    datasets: [{
      data: [20, 15, 8, 12]
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Historial de Catas</Text>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Puntuaciones Mensuales</Text>
          <LineChart
            data={monthlyData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 148, 50, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tipos de Café Catados</Text>
          <BarChart
            data={coffeeTypes}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(75, 108, 183, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  }
}); 