import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar las evaluaciones
const EVALUATIONS_KEY = '@coffee_evaluations';

export const saveEvaluation = async (evaluation) => {
  try {
    // Obtener evaluaciones existentes
    const existingEvaluations = await getEvaluations();
    
    // Agregar nueva evaluación con fecha
    const newEvaluation = {
      ...evaluation,
      id: Date.now(), // ID único
      date: new Date().toISOString(),
    };
    
    // Guardar array actualizado
    const updatedEvaluations = [...existingEvaluations, newEvaluation];
    await AsyncStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updatedEvaluations));
    
    return newEvaluation;
  } catch (error) {
    console.error('Error saving evaluation:', error);
    throw error;
  }
};

export const getEvaluations = async () => {
  try {
    const evaluations = await AsyncStorage.getItem(EVALUATIONS_KEY);
    return evaluations ? JSON.parse(evaluations) : [];
  } catch (error) {
    console.error('Error getting evaluations:', error);
    return [];
  }
};

export const deleteEvaluation = async (id) => {
  try {
    const evaluations = await getEvaluations();
    const updatedEvaluations = evaluations.filter(item => item.id !== id);
    await AsyncStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updatedEvaluations));
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    throw error;
  }
};

export const updateEvaluation = async (id, updatedData) => {
  try {
    const evaluations = await getEvaluations();
    const updatedEvaluations = evaluations.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    );
    await AsyncStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updatedEvaluations));
  } catch (error) {
    console.error('Error updating evaluation:', error);
    throw error;
  }
}; 