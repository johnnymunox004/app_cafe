import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { 
  initializeTensorFlow, 
  preprocessImage, 
  analyzeColor, 
  cleanupTensors 
} from '../../utils/tensorflow-config';
import Barrita from "../../components/barrita";
import * as Progress from 'react-native-progress';
import { modelManager } from '../../utils/model-manager';

export default function CoffeeBeanScanner() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const isReady = await initializeTensorFlow();
      setIsTfReady(isReady);
      console.log('Estado de TF:', isReady ? '✅ Listo' : '❌ No listo');
    };
    setup();
  }, []);

  useEffect(() => {
    checkModel();
  }, []);

  const checkModel = async () => {
    const downloaded = await modelManager.isModelDownloaded();
    setIsModelDownloaded(downloaded);
    
    if (!downloaded) {
      setIsDownloading(true);
      await modelManager.downloadModel();
      setIsDownloading(false);
      setIsModelDownloaded(true);
    }
  };

  const analyzeBeanColor = async (imageUri) => {
    if (!isTfReady) {
      Alert.alert('Error', 'TensorFlow no está listo aún');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setStatusMessage('Iniciando análisis...');
    const tensors = [];

    try {
      console.log('📸 Procesando imagen...');
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('✅ Imagen convertida a Base64');

      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      const imageTensor = decodeJpeg(raw);
      tensors.push(imageTensor);
      console.log('✅ Tensor creado');

      const processedTensor = await preprocessImage(imageTensor);
      tensors.push(processedTensor);
      console.log('✅ Imagen preprocesada');

      const result = await analyzeColor(processedTensor);
      console.log('📊 Resultado:', result);
      setAnalysis(result);

      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('❌ Error en el análisis:', error);
      Alert.alert('Error', 'No se pudo analizar la imagen');
    } finally {
      cleanupTensors(tensors);
      setIsAnalyzing(false);
      setStatusMessage('');
      setProgress(0);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para escanear los granos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await analyzeBeanColor(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={styles.gradient}
      >
        {isDownloading ? (
          <View style={styles.downloadContainer}>
            <Text style={styles.downloadText}>
              Descargando modelo para uso offline...
            </Text>
            <ActivityIndicator size="large" color="#FF9432" />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Análisis de Tostión</Text>
            
            <Text style={styles.statusText}>
              Estado: {isTfReady ? '✅ Listo' : '⏳ Inicializando...'}
            </Text>
            
            <View style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Sin imagen</Text>
                </View>
              )}
            </View>

            {isAnalyzing && (
              <View style={styles.progressContainer}>
                <Progress.Bar 
                  progress={progress} 
                  width={null} 
                  color="#FF9432"
                  borderWidth={0}
                  unfilledColor="#f0f0f0"
                  height={10}
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>
                  {Math.round(progress * 100)}% - {statusMessage}
                </Text>
                <ActivityIndicator color="#FF9432" />
              </View>
            )}

            <TouchableOpacity 
              onPress={takePicture}
              disabled={!isTfReady || isAnalyzing}
            >
              <LinearGradient
                colors={['#FF9432', '#FF6B00']}
                style={[styles.button, (!isTfReady || isAnalyzing) && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {isAnalyzing ? 'Analizando...' : 'Tomar Foto'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Resultados del Análisis</Text>
                <Text style={styles.analysisText}>Nivel de Tostión: {analysis.roastLevel}</Text>
                <Text style={styles.analysisText}>Recomendación: {analysis.recommendation}</Text>
                <View style={styles.colorBox} backgroundColor={`rgb(${analysis.colorValues.red}, ${analysis.colorValues.green}, ${analysis.colorValues.blue})`} />
              </View>
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Instrucciones:</Text>
              <Text style={styles.infoText}>1. Coloca los granos sobre fondo blanco</Text>
              <Text style={styles.infoText}>2. Asegura buena iluminación</Text>
              <Text style={styles.infoText}>3. Mantén la cámara estable</Text>
              <Text style={styles.infoText}>4. Toma la foto a 20cm de distancia</Text>
            </View>
          </>
        )}
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
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  analysisContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  analysisText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  colorBox: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  progressContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  progressBar: {
    marginBottom: 10,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  downloadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  downloadText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
}); 