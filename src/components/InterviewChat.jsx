// frontend/src/components/InterviewChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import MessageBubble from './MessageBubble';
import SpeechRecognizer from './SpeechRecognizer';

const InterviewChat = ({ interviewData, setInterviewData, onEndInterview }) => {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0); // Velocidade da voz (1.0 = normal)
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  
  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [interviewData.messages]);

  // Limpa o áudio atual quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Aplica a velocidade de reprodução quando ela muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // Reproduz áudio automaticamente quando disponível
  useEffect(() => {
    // Limpe qualquer áudio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Se há um novo ID de áudio, reproduza-o
    if (interviewData.audioId) {
      const audioUrl = apiService.getAudioUrl(interviewData.audioId);
      
      const audio = new Audio();
      audioRef.current = audio;
      
      // Configura os event listeners antes de definir a origem
      audio.onloadedmetadata = () => {
        console.log('Áudio carregado, duração:', audio.duration);
      };
      
      audio.onplay = () => {
        console.log('Áudio iniciado');
        setIsPlaying(true);
      };
      
      audio.onended = () => {
        console.log('Reprodução de áudio concluída');
        setIsPlaying(false);
        setCurrentAudio(null);
      };
      
      audio.onerror = (e) => {
        console.error('Erro ao carregar áudio:', e);
        setIsPlaying(false);
      };
      
      // Define a origem após configurar os listeners
      audio.src = audioUrl;
      audio.playbackRate = playbackRate; // Aplica a velocidade atual
      setCurrentAudio(audio);
      
      // Tenta reproduzir com tratamento de erro
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Reprodução de áudio iniciada com sucesso');
            setIsPlaying(true); // Garantir que o estado é atualizado
          })
          .catch(err => {
            // Tratamento específico para diferentes erros
            if (err.name === 'AbortError') {
              console.log('Reprodução cancelada - isso é normal se a navegação ocorreu');
            } else {
              console.error('Erro ao reproduzir áudio:', err);
            }
            setIsPlaying(false);
          });
      }
    }
  }, [interviewData.audioId]);
  
  // Função para interromper a explicação
  const skipExplanation = async () => {
    console.log("Tentando interromper explicação, isPlaying:", isPlaying);
    if (audioRef.current) {
      // Para o áudio atual
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      
      // Tenta reproduzir um breve "Ok"
      try {
        const okAudio = new Audio('/ok.mp3');
        okAudio.onended = () => {
          console.log("Áudio 'Ok' finalizado");
        };
        await okAudio.play();
      } catch (err) {
        console.error('Erro ao reproduzir confirmação:', err);
        // Se não conseguir reproduzir o "Ok", apenas continue
      }
    }
  };
  
  // Processa a resposta do usuário
  const handleSendMessage = async (text = null) => {
    // Use o texto fornecido ou o input do usuário
    const messageText = text || userInput;
    
    if (!messageText.trim()) {
      alert('Por favor, digite ou grave uma resposta.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Adiciona a mensagem do usuário ao chat
      const updatedMessages = [
        ...interviewData.messages,
        { role: 'user', content: messageText }
      ];
      
      setInterviewData({
        ...interviewData,
        messages: updatedMessages
      });
      
      // Envia para o servidor processar
      const response = await apiService.processResponse(
        messageText,
        updatedMessages,
        interviewData.systemPrompt
      );
      
      // Atualiza as mensagens com a resposta da IA
      setInterviewData({
        ...interviewData,
        messages: [
          ...updatedMessages,
          { role: 'assistant', content: response.message }
        ],
        audioId: response.audioId
      });
      
      // Limpa o input
      setUserInput('');
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      alert('Ocorreu um erro ao processar sua resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Processa a transcrição concluída do reconhecimento de voz
  const handleTranscriptionComplete = (transcription, autoSend = true) => {
    console.log("Transcrição recebida:", transcription, "autoSend:", autoSend);
    if (transcription && transcription.trim()) {
      // Atualiza o campo de entrada
      setUserInput(transcription.trim());
      
      // Se autoSend for true, envia automaticamente
      if (autoSend) {
        handleSendMessage(transcription.trim());
      }
    }
  };
  
  console.log("Estado atual - isPlaying:", isPlaying);
  
  return (
    <div className="chat-container w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-slate-700">
      {/* Header do chat */}
      <div className="p-4 bg-primary-600 dark:bg-primary-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-300 dark:bg-primary-500 flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Fernanda - Recrutadora</h3>
            <p className="text-xs text-white/80">DevClub Talent Recruiter</p>
          </div>
        </div>
        
        {/* Controles de velocidade da voz */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs whitespace-nowrap">Velocidade:</span>
            <div className="relative w-24 h-6 flex items-center">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="absolute right-0 -bottom-5 text-xs">{playbackRate}x</span>
            </div>
          </div>
          
          <button
            onClick={onEndInterview}
            className="text-white hover:text-red-200 transition-colors"
            aria-label="Encerrar entrevista"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Corpo do chat */}
      <div className="chat-messages bg-gray-50 dark:bg-slate-900 relative">
        {/* Botão para pular explicação (visível somente durante a reprodução) */}
        {isPlaying && (
          <div className="sticky top-4 left-0 right-0 flex justify-center z-10 mb-4">
            <button
              onClick={skipExplanation}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-lg flex items-center space-x-2 animate-pulse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
              <span>Interromper Explicação</span>
            </button>
          </div>
        )}
        
        {interviewData.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isLastMessage={index === interviewData.messages.length - 1}
            isPlaying={index === interviewData.messages.length - 1 && message.role === 'assistant' && isPlaying}
          />
        ))}
        {loading && (
          <div className="flex justify-center my-4">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input do chat */}
      <div className="chat-input border-t border-gray-200 dark:border-slate-700">
        {/* Informação sobre áudio sendo reproduzido */}
        {isPlaying && (
          <div className="bg-primary-50 dark:bg-primary-900/20 p-2 text-sm text-primary-700 dark:text-primary-300 flex justify-between items-center mb-2 rounded">
            <span>
              <span className="inline-block h-2 w-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse mr-2"></span>
              Fernanda está falando...
            </span>
            <button
              onClick={skipExplanation}
              className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 font-medium text-sm"
            >
              Interromper
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <SpeechRecognizer
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onTranscriptionComplete={handleTranscriptionComplete}
            disabled={loading || isPlaying}
            autoSend={true}
          />
          
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Digite sua resposta ou clique no microfone para falar..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={loading || isRecording || isPlaying}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || isRecording || isPlaying || !userInput.trim()}
            className={`
              p-2 rounded-lg 
              ${
                loading || isRecording || isPlaying || !userInput.trim()
                  ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800'
              }
              text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800
            `}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Controle de velocidade em telas pequenas */}
        <div className="flex items-center mt-3 md:hidden">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Velocidade:</span>
          <div className="relative flex-1 h-6 flex items-center">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="absolute right-0 -bottom-5 text-xs text-gray-500 dark:text-gray-400">{playbackRate}x</span>
          </div>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {isPlaying ? (
            <span className="text-primary-600 dark:text-primary-400">Aguarde a Fernanda terminar ou clique em "Interromper".</span>
          ) : isRecording ? (
            <span className="text-red-500">Falando... Clique no botão de parar quando terminar.</span>
          ) : (
            <>Pressione Enter para enviar ou use o microfone para responder com voz.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default InterviewChat;