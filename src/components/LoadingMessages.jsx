// src/components/LoadingMessages.jsx
import React, { useState, useEffect } from 'react';

// Mensagens iniciais de carregamento
const initialLoadingMessages = [
  "Estamos chamando a Recrutadora no RH, só mais um pouquinho...",
  "Fernanda está arrumando a câmera para a entrevista...",
  "Preparando as perguntas mais interessantes para você...",
  "Verificando se o microfone está funcionando...",
  "Fernanda está terminando um café para começar a entrevista...",
  "Aguarde enquanto preparamos tudo para você brilhar!",
  "Carregando ambiente de entrevista profissional...",
  "Ajustando o ar condicionado da sala virtual...",
  "Checando o dress code... ah, é virtual, use o que quiser! 😉",
  "Deixando tudo pronto para você impressionar a recrutadora..."
];

// Mensagens durante análise de resposta
const analysingResponseMessages = [
  "Analisando sua resposta...",
  "Fernanda está refletindo sobre o que você disse...",
  "Preparando o melhor feedback para você...",
  "Avaliando suas habilidades de comunicação...",
  "Processando sua resposta para um feedback detalhado...",
  "Comparando com as melhores práticas do mercado...",
  "Calculando as palavras-chave que você utilizou...",
  "Trazendo os melhores insights para você...",
  "Analisando detalhadamente seu perfil profissional...",
  "Fernanda está impressionada! Só um momento..."
];

const LoadingMessages = ({ type = 'initial' }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = type === 'initial' ? initialLoadingMessages : analysingResponseMessages;

  useEffect(() => {
    // Escolhe uma mensagem aleatória
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
    
    // Muda a mensagem a cada 4 segundos
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * messages.length);
      setCurrentMessage(messages[newIndex]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-sm max-w-md border border-gray-200 dark:border-slate-700">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{currentMessage}</p>
      </div>
    </div>
  );
};

export default LoadingMessages;