import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { modelManager } from './model-manager';

export const initializeTensorFlow = async () => {
  try {
    await tf.ready();
    console.log('✅ TensorFlow inicializado correctamente');
    await modelManager.loadModel();
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar TensorFlow:', error);
    return false;
  }
};

export const preprocessImage = async (imageTensor) => {
  try {
    console.log('🔄 Preprocesando imagen...');
    const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalized = resized.div(255.0);
    return normalized;
  } catch (error) {
    console.error('❌ Error en preprocesamiento:', error);
    throw error;
  }
};

export const analyzeColor = async (tensor) => {
  try {
    console.log('🔄 Analizando color...');
    const meanColor = tf.mean(tensor, [0, 1]);
    const colorValues = await meanColor.array();
    
    const brightness = (colorValues[0] + colorValues[1] + colorValues[2]) / 3;
    console.log('Valores RGB:', colorValues.map(v => Math.round(v * 255)));
    console.log('Brillo detectado:', brightness);
    
    let roastLevel;
    let recommendation;

    if (brightness > 0.45) {
      roastLevel = "Tostado Muy Claro";
      recommendation = "El grano está demasiado claro, necesita más tiempo de tostado";
    } else if (brightness > 0.35) {
      roastLevel = "Tostado Claro";
      recommendation = "El tostado es ligero, ideal para resaltar notas ácidas";
    } else if (brightness > 0.25) {
      roastLevel = "Tostado Medio";
      recommendation = "Tostado óptimo, balance entre acidez y cuerpo";
    } else if (brightness > 0.15) {
      roastLevel = "Tostado Oscuro";
      recommendation = "Tostado intenso, ideal para espresso";
    } else {
      roastLevel = "Tostado Muy Oscuro";
      recommendation = "Tostado muy intenso, sabores ahumados predominantes";
    }

    return {
      roastLevel,
      recommendation,
      colorValues: {
        red: Math.round(colorValues[0] * 255),
        green: Math.round(colorValues[1] * 255),
        blue: Math.round(colorValues[2] * 255)
      }
    };
  } catch (error) {
    console.error('❌ Error en análisis de color:', error);
    throw error;
  }
};

export const cleanupTensors = (tensors) => {
  tensors.forEach(tensor => {
    if (tensor && tensor.dispose) {
      tensor.dispose();
    }
  });
}; 