// frontend/src/services/api.js
import axios from 'axios';

// Certifique-se de que a URL da API está corretamente configurada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API URL:', API_URL); // Log para debug

// Criando uma instância do axios com URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos timeout
});

// Interceptadores para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Serviço de API para interação com o backend
const apiService = {
  // Verifica o status da API
  checkStatus: async () => {
    try {
      console.log('Checking API status at:', API_URL + '/status');
      const response = await api.get('/status');
      return response.data;
    } catch (error) {
      console.error('Status check failed:', error);
      return { status: 'offline', error: error.message };
    }
  },

  // Inicia uma nova entrevista
  startInterview: async (type, customRequirements, systemPrompt) => {
    try {
      console.log('Starting interview:', type);
      const response = await api.post('/interview/start', {
        type,
        customRequirements,
        systemPrompt
      });
      return response.data;
    } catch (error) {
      console.error('Interview start failed:', error);
      throw new Error('Erro ao iniciar entrevista');
    }
  },

  // Processa uma resposta do usuário
  processResponse: async (userResponse, conversation, systemPrompt) => {
    try {
      const response = await api.post('/interview/respond', {
        userResponse,
        conversation,
        systemPrompt
      });
      return response.data;
    } catch (error) {
      console.error('Process response failed:', error);
      throw new Error('Erro ao processar resposta');
    }
  },

  // Obtém a URL do arquivo de áudio
  getAudioUrl: (audioId) => {
    return `${API_URL}/interview/audio/${audioId}`;
  }
};

export default apiService;