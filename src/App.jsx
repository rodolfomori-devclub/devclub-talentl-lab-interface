// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import InterviewSelector from './components/InterviewSelector';
import InterviewChat from './components/InterviewChat';
import apiService from './services/api';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewData, setInterviewData] = useState(null);

  // Verifica o status da API ao iniciar
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await apiService.checkStatus();
        setApiStatus(status);
      } catch (error) {
        console.error('Erro ao verificar status da API:', error);
        setApiStatus({ status: 'offline' });
      } finally {
        setLoading(false);
      }
    };

    checkApiStatus();
  }, []);

  // Inicia uma nova entrevista
  const startInterview = async (type, customRequirements, systemPrompt) => {
    setLoading(true);
    try {
      const data = await apiService.startInterview(type, customRequirements, systemPrompt);
      
      setInterviewData({
        type,
        systemPrompt: data.systemPrompt || systemPrompt,
        messages: [
          {
            role: 'assistant',
            content: data.message
          }
        ],
        audioId: data.audioId
      });
      
      setInterviewActive(true);
    } catch (error) {
      console.error('Erro ao iniciar entrevista:', error);
      alert('Não foi possível iniciar a entrevista. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Encerra a entrevista atual
  const endInterview = () => {
    setInterviewActive(false);
    setInterviewData(null);
  };

  return (
    <ThemeProvider>
      <div className="app-container bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <Header />
        
        <main className="main-content p-0 sm:px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : !apiStatus || apiStatus.status === 'offline' ? (
            <div className="p-4 mx-4 my-8 bg-error/10 rounded-lg text-error text-center">
              API offline. Verifique se o servidor está rodando corretamente.
            </div>
          ) : interviewActive && interviewData ? (
            <div className="flex-1 flex justify-center">
              <InterviewChat
                interviewData={interviewData}
                setInterviewData={setInterviewData}
                onEndInterview={endInterview}
              />
            </div>
          ) : (
            <div className="flex-1 py-8 px-4">
              <InterviewSelector onSelectInterview={startInterview} />
            </div>
          )}
        </main>
        
        <footer className="py-3 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© 2025 DevClub TalentLab | Todos os direitos reservados</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;