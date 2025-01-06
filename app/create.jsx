import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
  Share,
  Platform,
} from "react-native";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import generatePDF from "../components/PDFGenerator";
import ViewShot from "react-native-view-shot";
import { saveEvaluation, getEvaluations } from "../utils/storage";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../utils/styles";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useFocusEffect } from "expo-router";

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

const BasicEvaluation = ({ ratings, updateRating, onCapture }) => {
  const viewShotRef = useRef(null);

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
        console.error("Error capturando el gráfico:", error);
      }
    };
    captureChart();
  }, [ratings]);

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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.ratingButton,
              value === num && styles.ratingButtonSelected,
            ]}
            onPress={() => onValueChange(num)}
          >
            <Text
              style={[
                styles.ratingButtonText,
                value === num && styles.ratingButtonTextSelected,
              ]}
            >
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
        <View style={[styles.chartCard, { backgroundColor: "white" }]}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
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
                fill: "#666666",
              }}
              axisValue={[2, 4, 6, 8, 10].map((v) => v * 10)}
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

const FlavorEvaluation = ({ flavors, updateFlavors }) => {
  const flavorOptions = [
    "Chocolate",
    "Nueces",
    "Caramelo",
    "Frutal",
    "Cítrico",
    "Floral",
    "Especiado",
    "Herbáceo",
    "Tostado",
    "Miel",
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Selecciona los sabores identificados
      </Text>
      <View style={styles.flavorGrid}>
        <ScrollView style={styles.flavorContainer}>
          {flavorOptions.map((flavor) => (
            <TouchableOpacity
              key={flavor}
              style={[
                styles.flavorChip,
                flavors.includes(flavor) && styles.flavorChipSelected,
              ]}
              onPress={() => {
                if (flavors.includes(flavor)) {
                  updateFlavors(flavors.filter((f) => f !== flavor));
                } else {
                  updateFlavors([...flavors, flavor]);
                }
              }}
            >
              <Text
                style={[
                  styles.flavorChipText,
                  flavors.includes(flavor) && styles.flavorChipTextSelected,
                ]}
              >
                {flavor}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const CoffeeInfo = ({
  info,
  updateInfo,
  groups,
  selectedGroup,
  onGroupChange,
  onCreateGroup,
}) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName("");
      setShowNewGroupInput(false);
    }
  };

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Nombre del Café *</Text>
        <TextInput
          style={[styles.input, !info.name && styles.inputError]}
          value={info.name}
          onChangeText={(text) => updateInfo("name", text)}
          placeholder="Nombre del café"
        />

        <Text style={styles.infoLabel}>Origen *</Text>
        <TextInput
          style={[styles.input, !info.origin && styles.inputError]}
          value={info.origin}
          onChangeText={(text) => updateInfo("origin", text)}
          placeholder="País o región de origen"
        />

        <Text style={styles.infoLabel}>Grupo</Text>
        <View style={styles.groupContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupScroll}
          >
            {groups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.groupTag,
                  selectedGroup === group && styles.groupTagSelected,
                ]}
                onPress={() => onGroupChange(group)}
              >
                <Text
                  style={[
                    styles.groupTagText,
                    selectedGroup === group && styles.groupTagTextSelected,
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addGroupButton}
              onPress={() => setShowNewGroupInput(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.addGroupText}>Nuevo Grupo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {showNewGroupInput && (
          <View style={styles.newGroupContainer}>
            <TextInput
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Nombre del nuevo grupo"
              autoFocus
            />
            <View style={styles.newGroupButtons}>
              <TouchableOpacity
                style={styles.newGroupButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.newGroupButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.newGroupButton, styles.cancelButton]}
                onPress={() => setShowNewGroupInput(false)}
              >
                <Text
                  style={[styles.newGroupButtonText, styles.cancelButtonText]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.infoLabel}>Notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={info.notes}
          onChangeText={(text) => updateInfo("notes", text)}
          placeholder="Notas adicionales"
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRatings = (ratings) => {
  return Object.entries(ratings)
    .map(([key, value]) => {
      const label = {
        aroma: "👃 Aroma",
        sabor: "👅 Sabor",
        acidez: "🍋 Acidez",
        cuerpo: "💪 Cuerpo",
        dulzura: "🍯 Dulzura",
      }[key];
      return `${label}: ${value}/10`;
    })
    .join("\n");
};

export default function Create() {
  const router = useRouter();
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
    name: "",
    origin: "",
    notes: "",
  });
  const [chartUri, setChartUri] = useState(null);
  const [groups, setGroups] = useState(["Favoritos"]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const resetForm = () => {
    setRatings({
      aroma: 5,
      sabor: 5,
      acidez: 5,
      cuerpo: 5,
      dulzura: 5,
    });
    setFlavors([]);
    setInfo({
      name: "",
      origin: "",
      notes: "",
    });
    setChartUri(null);
    setCurrentStep(0);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetForm();
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      loadExistingGroups();
    }, [])
  );

  const loadExistingGroups = async () => {
    try {
      const evaluations = await getEvaluations();
      const existingGroups = [
        ...new Set(evaluations.map((item) => item.group).filter(Boolean)),
      ];

      // Combinar grupos existentes con los predeterminados
      const allGroups = [...new Set(["Favoritos", ...existingGroups])];
      setGroups(allGroups);

      console.log("Grupos cargados:", allGroups); // Debug
    } catch (error) {
      console.error("Error al cargar grupos:", error);
    }
  };

  const handleCreateGroup = (newGroup) => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups((prev) => [...prev, newGroup]);
      setSelectedGroup(newGroup);
    }
  };

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
  };

  const steps = [
    {
      title: "Evaluación Básica",
      component: (
        <BasicEvaluation
          ratings={ratings}
          updateRating={(key, value) =>
            setRatings((prev) => ({ ...prev, [key]: value }))
          }
          onCapture={setChartUri}
        />
      ),
    },
    {
      title: "Sabores y Aromas",
      component: (
        <FlavorEvaluation flavors={flavors} updateFlavors={setFlavors} />
      ),
    },
    {
      title: "Información",
      component: (
        <CoffeeInfo
          info={info}
          updateInfo={(key, value) =>
            setInfo((prev) => ({ ...prev, [key]: value }))
          }
          groups={groups}
          selectedGroup={selectedGroup}
          onGroupChange={handleGroupChange}
          onCreateGroup={handleCreateGroup}
        />
      ),
    },
  ];

  const isFormValid = (step) => {
    switch (step) {
      case 2:
        return info.name.trim() !== "" && info.origin.trim() !== "";
      default:
        return true;
    }
  };

  const handleFinish = async () => {
    // Validar campos requeridos
    const missingFields = [];
    if (!info.name.trim()) missingFields.push('Nombre del Café');
    if (!info.origin.trim()) missingFields.push('Origen');

    if (missingFields.length > 0) {
      Alert.alert(
        '⚠️ Campos Incompletos',
        `Por favor complete los siguientes campos obligatorios:\n\n${missingFields.join('\n')}`,
        [
          {
            text: 'Entendido',
            style: 'default',
          }
        ]
      );
      return;
    }

    try {
      const evaluationData = {
        name: info.name,
        origin: info.origin,
        notes: info.notes,
        date: new Date().toISOString(),
        ratings: ratings,
        flavors: flavors,
        chartUri: chartUri,
        group: selectedGroup,
      };

      await saveEvaluation(evaluationData);

      Alert.alert(
        '✨ ¡Evaluación Guardada!',
        'Tu evaluación ha sido guardada exitosamente',
        [
          {
            text: 'Compartir PDF',
            onPress: generatePDF,
            style: 'default'
          },
          {
            text: 'Ver Historial',
            onPress: () => {
              resetForm();
              router.push('/(tools)/history');
            },
            style: 'default'
          },
          {
            text: 'Nueva Evaluación',
            onPress: () => {
              resetForm();
              router.replace('/create');
            },
            style: 'default'
          }
        ]
      );

    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
      Alert.alert(
        '❌ Error',
        'No se pudo guardar la evaluación. Por favor intente nuevamente.',
        [
          {
            text: 'Cerrar',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePDF = async () => {
    if (!isFormValid(currentStep)) {
      Alert.alert("Error", "Por favor complete todos los campos requeridos");
      return;
    }

    try {
      const evaluationData = {
        name: info.name,
        origin: info.origin,
        notes: info.notes,
        date: new Date().toISOString(),
        ratings: ratings,
        flavors: flavors,
        chartUri: chartUri,
        group: selectedGroup,
      };

      await saveEvaluation(evaluationData);
      console.log("Evaluación guardada exitosamente");

      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Helvetica';
                padding: 20px;
              }
              .header {
                text-align: center;
                color: #FF9432;
                margin-bottom: 30px;
              }
              .section {
                margin-bottom: 20px;
              }
              .rating-item {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
              }
              .flavor-tag {
                display: inline-block;
                background-color: #FFF8F1;
                padding: 5px 10px;
                margin: 3px;
                border-radius: 15px;
                color: #FF9432;
              }
              .chart-container {
                text-align: center;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>☕️ Evaluación de Café</h1>
            </div>

            <div class="section">
              <h2>📝 Información General</h2>
              <p><strong>Nombre:</strong> ${info.name}</p>
              <p><strong>Origen:</strong> ${info.origin}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                "es-ES"
              )}</p>
            </div>

            ${
              chartUri
                ? `
              <div class="chart-container">
                <img src="${chartUri}" width="300" height="300" />
              </div>
            `
                : ""
            }

            <div class="section">
              <h2>⭐️ Calificaciones</h2>
              ${Object.entries(ratings)
                .map(
                  ([key, value]) => `
                  <div class="rating-item">
                    <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span>${value}/10</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="section">
              <h2>🎯 Sabores Identificados</h2>
              ${flavors
                .map(
                  (flavor) => `
                <span class="flavor-tag">${flavor}</span>
              `
                )
                .join("")}
            </div>

            ${
              info.notes
                ? `
              <div class="section">
                <h2>📝 Notas</h2>
                <p>${info.notes}</p>
              </div>
            `
                : ""
            }
          </body>
        </html>
      `;

      console.log("Generando PDF...");
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      console.log("PDF generado:", uri);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "La función de compartir no está disponible");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir Evaluación de Café",
        UTI: "com.adobe.pdf",
      });

      Alert.alert(
        "✨ ¡Evaluación Guardada!",
        "La evaluación se ha guardado y compartido exitosamente",
        [
          {
            text: "Nueva Evaluación",
            onPress: () => {
              resetForm();
              router.replace("/create");
            },
            style: "default",
          },
          {
            text: "Ver Historial",
            onPress: () => {
              resetForm();
              router.push("/(tools)/history");
            },
            style: "default",
          },
          {
            text: "Cerrar",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo guardar o compartir la evaluación");
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        </View>

        <View style={styles.content}>{steps[currentStep].component}</View>

        <View style={styles.footer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back-outline" size={22} color={COLORS.primary} />
              <Text style={styles.backButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}
          
          {currentStep === steps.length - 1 ? (
            <TouchableOpacity
              style={[
                styles.saveButton,
                !isFormValid(currentStep) && styles.buttonDisabled
              ]}
              onPress={handleFinish}
              disabled={!isFormValid(currentStep)}
              activeOpacity={0.7}
            >
              <Ionicons name="save-outline" size={22} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Guardar Evaluación</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.nextButton,
                !isFormValid(currentStep) && styles.buttonDisabled
              ]}
              onPress={handleNext}
              disabled={!isFormValid(currentStep)}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>Siguiente</Text>
              <Ionicons name="arrow-forward-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  progressStep: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 3,
    borderRadius: 3,
  },
  progressStepActive: {
    backgroundColor: "#FF9432",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    minHeight: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  ratingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  selectedValue: {
    backgroundColor: "#FFF8F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF9432",
  },
  selectedValueText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF9432",
  },
  buttonScroll: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  ratingButtonSelected: {
    backgroundColor: "#FF9432",
    borderColor: "#FF9432",
    shadowColor: "#FF9432",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ratingButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  ratingButtonTextSelected: {
    color: "#FFFFFF",
  },
  flavorContainer: {
    flex: 1,
    padding: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  flavorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  flavorChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 6,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  flavorChipSelected: {
    backgroundColor: "#FF9432",
    borderColor: "#FF9432",
    shadowColor: "#FF9432",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  flavorChipText: {
    color: "#666666",
    fontSize: 15,
    fontWeight: "600",
  },
  flavorChipTextSelected: {
    color: "#FFFFFF",
  },
  infoContainer: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    fontSize: 16,
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#FF4444",
    borderWidth: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  groupContainer: {
    marginVertical: 12,
  },
  groupScroll: {
    flexGrow: 0,
  },
  groupTag: {
    backgroundColor: "rgba(255,148,50,0.1)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,148,50,0.2)",
  },
  groupTagSelected: {
    backgroundColor: "#FF9432",
    borderColor: "#FF9432",
    shadowColor: "#FF9432",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  groupTagText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  groupTagTextSelected: {
    color: "#FFFFFF",
  },
  addGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addGroupText: {
    color: COLORS.primary,
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
  },
  newGroupContainer: {
    marginTop: 12,
  },
  newGroupButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  newGroupButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#FF9432",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newGroupButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "rgba(255,148,50,0.1)",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.primary,
  },
  nextButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  }
});
