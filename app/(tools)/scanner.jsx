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
import { GlobalStyles, COLORS, SIZES } from '../../utils/styles';

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
    <ScrollView style={GlobalStyles.container}>
      <LinearGradient
        colors={[COLORS.background, '#E5E5E5']}
        style={GlobalStyles.gradientContainer}
      >
        <Text style={GlobalStyles.title}>Análisis de Tostión</Text>
        
        <View style={GlobalStyles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={GlobalStyles.image} />
          ) : (
            <View style={[GlobalStyles.card, styles.placeholder]}>
              <Text style={GlobalStyles.text}>Sin imagen</Text>
            </View>
          )}
        </View>

        {isAnalyzing && (
          <View style={GlobalStyles.progressContainer}>
            <Progress.Bar 
              progress={progress} 
              width={null} 
              color={COLORS.accent}
              style={styles.progressBar}
            />
            <Text style={GlobalStyles.text}>
              {Math.round(progress * 100)}% - {statusMessage}
            </Text>
            <ActivityIndicator color={COLORS.accent} />
          </View>
        )}

        <TouchableOpacity 
          onPress={takePicture}
          disabled={!isTfReady || isAnalyzing}
        >
          <LinearGradient
            colors={[COLORS.accent, COLORS.secondary]}
            style={[GlobalStyles.button, (!isTfReady || isAnalyzing) && styles.buttonDisabled]}
          >
            <Text style={GlobalStyles.buttonText}>
              {isAnalyzing ? 'Analizando...' : 'Tomar Foto'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {analysis && (
          <View style={GlobalStyles.card}>
            <Text style={GlobalStyles.subtitle}>Resultados del Análisis</Text>
            <Text style={GlobalStyles.text}>Nivel de Tostión: {analysis.roastLevel}</Text>
            <Text style={GlobalStyles.text}>Recomendación: {analysis.recommendation}</Text>
            <View style={[styles.colorBox, { backgroundColor: `rgb(${analysis.colorValues.red}, ${analysis.colorValues.green}, ${analysis.colorValues.blue})` }]} />
          </View>
        )}

        <View style={GlobalStyles.infoContainer}>
          <Text style={GlobalStyles.subtitle}>Instrucciones:</Text>
          <Text style={GlobalStyles.text}>1. Coloca los granos sobre fondo blanco</Text>
          <Text style={GlobalStyles.text}>2. Asegura buena iluminación</Text>
          <Text style={GlobalStyles.text}>3. Mantén la cámara estable</Text>
          <Text style={GlobalStyles.text}>4. Toma la foto a 20cm de distancia</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    marginBottom: SIZES.base,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  colorBox: {
    width: '100%',
    height: 50,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  }
}); 