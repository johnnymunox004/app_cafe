import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import generatePDF from "../components/PDFGenerator";
import ViewShot from "react-native-view-shot";

// Componente para la barra de progreso
const ProgressBar = ({ currentStep, totalSteps }) => (
  <View style={styles.progressContainer}>
    {[...Array(totalSteps)].map((_, index) => (
      <View
        key={index}
        style={[
          styles.progressStep,
          index <= currentStep && styles.progressStepActive,
        ]}
      />
    ))}
  </View>
);

// Paso 1: Evaluación básica
const BasicEvaluation = ({ ratings, updateRating, onCapture }) => {
  const viewShotRef = useRef(null);

  // Efecto para capturar cuando el componente esté listo
  useEffect(() => {
    const captureChart = async () => {
      try {
        if (viewShotRef.current) {
          const uri = await viewShotRef.current.capture({
            format: "png",
            quality: 1,
            result: "base64",
          });
          onCapture && onCapture(`data:image/png;base64,${uri}`);
        }
      } catch (error) {
        console.error('Error capturando el gráfico:', error);
      }
    };

    captureChart();
  }, [ratings]); // Se ejecutará cuando cambien los ratings

  // Reutilizamos el componente de botones de calificación anterior
  const RatingButtons = ({ name, value, onValueChange }) => (
    <View style={styles.ratingCard}>
      <View style={styles.ratingHeader}>
        <Text style={styles.ratingLabel}>{name}</Text>
        <View style={styles.selectedValue}>
          <Text style={styles.selectedValueText}>{value}</Text>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonScroll}
      >
        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.ratingButton,
              value === num && styles.ratingButtonSelected
            ]}
            onPress={() => onValueChange(num)}
          >
            <Text style={[
              styles.ratingButtonText,
              value === num && styles.ratingButtonTextSelected
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView>
      <ViewShot 
        ref={viewShotRef} 
        options={{ format: "png", quality: 1, result: "base64" }}
      >
        <View style={[styles.chartCard, { backgroundColor: 'white' }]}>
          <View style={{ 
            width: 300, 
            height: 300, 
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd' 
          }}>
            <RadarChart
              data={Object.entries(ratings).map(([label, value]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value: value * 10,
              }))}
              maxValue={100}
              width={300}
              height={300}
              gradientColor={{
                startColor: "#FF9432",
                endColor: "#FFF8F1",
                count: 5,
              }}
              stroke={["#FFE8D3", "#FFE8D3", "#FFE8D3", "#FFE8D3", "#FF9432"]}
              strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
              labelColor="#433D3A"
              dataFillColor="#FF9432"
              dataFillOpacity={0.8}
              isCircle
              showAxisValue={true}
              axisValueStyle={{
                fontSize: 10,
                fill: "#666666"
              }}
              axisValue={[2, 4, 6, 8, 10].map(v => v * 10)}
            />
          </View>
        </View>
      </ViewShot>
      {Object.entries(ratings).map(([key, value]) => (
        <RatingButtons
          key={key}
          name={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onValueChange={(newValue) => updateRating(key, newValue)}
        />
      ))}
    </ScrollView>
  );
};

// Paso 2: Evaluación de sabores y aromas
const FlavorEvaluation = ({ flavors, updateFlavors }) => {
  const flavorOptions = [
    "Chocolate", "Nueces", "Caramelo", "Frutal", "Cítrico", 
    "Floral", "Especiado", "Herbáceo", "Tostado", "Miel"
  ];

  return (
    <ScrollView style={styles.flavorContainer}>
      <Text style={styles.sectionTitle}>Selecciona los sabores identificados</Text>
      <View style={styles.flavorGrid}>
        {flavorOptions.map((flavor) => (
          <TouchableOpacity
            key={flavor}
            style={[
              styles.flavorChip,
              flavors.includes(flavor) && styles.flavorChipSelected
            ]}
            onPress={() => {
              if (flavors.includes(flavor)) {
                updateFlavors(flavors.filter(f => f !== flavor));
              } else {
                updateFlavors([...flavors, flavor]);
              }
            }}
          >
            <Text style={[
              styles.flavorChipText,
              flavors.includes(flavor) && styles.flavorChipTextSelected
            ]}>
              {flavor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Paso 3: Información del café
const CoffeeInfo = ({ info, updateInfo }) => (
  <ScrollView style={styles.infoContainer}>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>Nombre del Café</Text>
      <TextInput
        style={styles.input}
        value={info.name}
        onChangeText={(text) => updateInfo({...info, name: text})}
        placeholder="Ej: Café de Colombia"
      />
      
      <Text style={styles.infoLabel}>Origen</Text>
      <TextInput
        style={styles.input}
        value={info.origin}
        onChangeText={(text) => updateInfo({...info, origin: text})}
        placeholder="Ej: Huila, Colombia"
      />

      <Text style={styles.infoLabel}>Notas</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={info.notes}
        onChangeText={(text) => updateInfo({...info, notes: text})}
        placeholder="Notas adicionales sobre el café..."
        multiline
        numberOfLines={4}
      />
    </View>
  </ScrollView>
);

export default function Create() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState({
    aroma: 5,
    sabor: 5,
    acidez: 5,
    cuerpo: 5,
    dulzura: 5,
  });
  const [flavors, setFlavors] = useState([]);
  const [info, setInfo] = useState({
    name: '',
    origin: '',
    notes: '',
  });
  const [chartUri, setChartUri] = useState(null);
  
  const steps = [
    {
      title: "Evaluación Básica",
      component: <BasicEvaluation 
        ratings={ratings} 
        updateRating={(key, value) => setRatings(prev => ({...prev, [key]: value}))}
        onCapture={setChartUri}
      />
    },
    {
      title: "Sabores y Aromas",
      component: <FlavorEvaluation 
        flavors={flavors}
        updateFlavors={setFlavors}
      />
    },
    {
      title: "Información",
      component: <CoffeeInfo 
        info={info}
        updateInfo={setInfo}
      />
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        if (!chartUri) {
          throw new Error('No se ha capturado el gráfico');
        }

        // Generar PDF usando el URI capturado
        const result = await generatePDF(chartUri, { ratings, flavors, info });
        
        if (!result.success) {
          throw new Error('Error al generar el PDF');
        }
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        Alert.alert(
          'Error',
          'No se pudo generar el PDF. Por favor intente nuevamente.'
        );
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      </View>

      <View style={styles.content}>
        {steps[currentStep].component}
      </View>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: "#FF9432",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  backButton: {
    flex: 1,
    padding: 14,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF9432",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#FF9432",
    padding: 14,
    borderRadius: 12,
    marginLeft: 8,
  },
  backButtonText: {
    color: "#FF9432",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  // Estilos para los componentes de evaluación básica
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    width: '100%',
    minHeight: 350,
  },
  ratingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  // ... (resto de estilos del rating)

  // Estilos para la evaluación de sabores
  flavorContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  flavorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  flavorChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  flavorChipSelected: {
    backgroundColor: "#FF9432",
    borderColor: "#FF9432",
  },
  flavorChipText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  flavorChipTextSelected: {
    color: "#FFFFFF",
  },
  // Estilos para la información del café
  infoContainer: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  selectedValue: {
    backgroundColor: "#FFF8F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF9432",
  },
  selectedValueText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF9432",
  },
  buttonsContainer: {
    marginHorizontal: -4,
  },
  buttonScroll: {
    paddingHorizontal: 4,
  },
  ratingButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  ratingButtonSelected: {
    backgroundColor: "#FF9432",
    borderColor: "#FF9432",
  },
  ratingButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  ratingButtonTextSelected: {
    color: "#FFFFFF",
  },
  // ... (mantener los estilos existentes del rating)
});