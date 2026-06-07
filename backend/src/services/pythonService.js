const axios = require('axios');

// La URL de nuestro motor de Python que acabamos de encender
const PYTHON_URL = 'http://localhost:8000';

/**
 * Envía datos al puente de Python para probar la comunicación
 */
const testPythonBridge = async (prompt, userId) => {
  try {
    // Llamamos exactamente al endpoint POST que creamos en FastAPI
    const response = await axios.post(`${PYTHON_URL}/ai/test-bridge`, {
      prompt: prompt,
      user_id: userId
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error conectando con el motor de Python:', error.message);
    throw new Error('No se pudo establecer comunicación con el módulo de IA');
  }
};

module.exports = {
  testPythonBridge
};
