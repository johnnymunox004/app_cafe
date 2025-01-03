import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const modelManager = {
  async isModelDownloaded() {
    return true; // Siempre retorna true porque usaremos análisis directo
  },

  async loadModel() {
    try {
      console.log('🔄 Inicializando análisis de color...');
      // No creamos un modelo complejo, solo retornamos true
      // ya que haremos análisis directo de color
      return true;
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      throw error;
    }
  }
}; 