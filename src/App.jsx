// src/App.jsx
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import InterviewSelector from './components/InterviewSelector';
import InterviewChat from './components/InterviewChat';
import LandingPage from './components/LandingPage';
import NetworkingAnimation from './components/NetworkingAnimation';
import LoadingMessages from './components/LoadingMessages';
import apiService from './services/api';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

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
        // Adiciona um pequeno atraso para mostrar as animações de carregamento
        setTimeout(() => {
          setLoading(false);
        }, 1500);
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

  // Função para mudar da landing page para a seleção de entrevista
  const handleGetStarted = () => {
    setShowLanding(false);
  };

  return (
    <ThemeProvider>
      <div className="app-container bg-gray-50 dark:bg-slate-900 transition-colors duration-200 relative">
        {/* Background com animação de networking */}
         {/* Background com animação de networking mais visível */}
         <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <NetworkingAnimation />
        </div>
        
        <Header />
        
        <main className="main-content p-0 sm:px-4 relative z-10">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-8"></div>
              <LoadingMessages type="initial" />
            </div>
          ) : !apiStatus || apiStatus.status === 'offline' ? (
            <div className="p-6 mx-4 my-8 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-300 text-center border border-red-200 dark:border-red-800 animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">API offline</h3>
              <p>Verifique se o servidor está rodando corretamente ou tente novamente mais tarde.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : showLanding ? (
            <LandingPage onGetStarted={handleGetStarted} />
          ) : interviewActive && interviewData ? (
            <div className="flex-1 flex justify-center py-4">
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
        
        <footer className="py-4 text-center text-slate-500 dark:text-slate-400 text-sm relative z-10 border-t border-gray-200 dark:border-slate-800">
          <p>© {new Date().getFullYear()} EntrevistaLab | DevClub TalentLab</p>
          <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Potencialize suas habilidades em entrevistas</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;