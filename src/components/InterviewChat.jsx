// src/components/InterviewChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import MessageBubble from './MessageBubble';
import SpeechRecognizer from './SpeechRecognizer';
import LoadingMessages from './LoadingMessages';
import VoiceAnimation from './VoiceAnimation';
import NetworkingAnimation from './NetworkingAnimation';
import Fernanda from '../assets/fernanda.png'

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
    <div className="chat-container w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-slate-700 relative">
      {/* Background de networking aprimorado */}
    {/* Background de networking aprimorado com maior visibilidade */}
    <div className="absolute inset-0 opacity-30">
        <NetworkingAnimation />
      </div>
      
      {/* Header do chat melhorado */}
      <div className="p-4 bg-primary dark:bg-primary-dark text-white flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white overflow-hidden border-2 border-white shadow-lg">
            {/* Foto da Fernanda */}
            <img 
              src={Fernanda}
              alt="Fernanda - Recrutadora" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback para avatar caso a imagem não carregue
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2337E359"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                e.target.className = "w-full h-full object-cover bg-primary-light";
              }}
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">Fernanda - Recrutadora</h3>
            <p className="text-xs text-white/90">DevClub Talent Recruiter</p>
          </div>
        </div>
        
        {/* Controles de velocidade da voz */}
        <div className="hidden md:flex items-center space-x-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"></path>
            </svg>
            <div className="range-slider relative w-28">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                title={`Velocidade: ${playbackRate}x`}
              />
              <span className="value">{playbackRate}x</span>
            </div>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path>
            </svg>
          </div>
      </div>
      
      {/* Corpo do chat */}
      <div className="chat-messages bg-gray-50 dark:bg-slate-900 relative z-10">
        {/* Botão para pular explicação (visível somente durante a reprodução) */}
        {isPlaying && (
          <div className="sticky top-4 left-0 right-0 flex justify-center z-10 mb-4">
            <button
              onClick={skipExplanation}
              className="py-2 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg flex items-center space-x-2 animate-pulse transition-colors"
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
          <LoadingMessages type="analysis" />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input do chat */}
      <div className="chat-input border-t border-gray-200 dark:border-slate-700 relative z-10">
        {/* Informação sobre áudio sendo reproduzido */}
        {isPlaying && (
          <div className="bg-primary-50 dark:bg-primary-900/30 p-3 text-sm text-primary-700 dark:text-white flex justify-between items-center mb-2 rounded">
            <div className="flex items-center space-x-2">
              <VoiceAnimation isPlaying={isPlaying} />
              <span className="font-medium dark:text-primary-light">Fernanda está falando...</span>
            </div>
            <button
              onClick={skipExplanation}
              className="text-primary-700 dark:text-white font-medium text-sm hover:underline"
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
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
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
              p-2 rounded-lg transition-all transform hover:scale-105
              ${
                loading || isRecording || isPlaying || !userInput.trim()
                  ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary'
              }
              text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800
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
   {/* Controle de velocidade em telas pequenas */}
   <div className="speed-control mt-5 md:hidden">
          <div className="flex items-center w-full justify-between">
            <svg className="w-4 h-4 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"></path>
            </svg>
            
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mx-2">Velocidade</span>
            
            <div className="range-slider lg flex-1">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                title={`Velocidade: ${playbackRate}x`}
              />
            </div>
            
            <span className="text-sm font-medium text-primary dark:text-primary-light ml-2">{playbackRate}x</span>
            
            <svg className="w-4 h-4 text-primary dark:text-primary-light ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path>
            </svg>
          </div>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {isPlaying ? (
            <span className="text-primary dark:text-primary-light">Aguarde a Fernanda terminar ou clique em "Interromper".</span>
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