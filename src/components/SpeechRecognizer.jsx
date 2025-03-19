// frontend/src/components/SpeechRecognizer.jsx
import React, { useState, useEffect, useRef } from 'react';

// Verifica suporte à API de reconhecimento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeechRecognition = !!SpeechRecognition;

const SpeechRecognizer = ({ isRecording, setIsRecording, onTranscriptionComplete, disabled, autoSend = true }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(hasSpeechRecognition);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptionRef = useRef('');

  // Inicializa o reconhecimento de voz
  useEffect(() => {
    if (!hasSpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('O reconhecimento de voz não é suportado neste navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR'; // Português do Brasil
    recognition.maxAlternatives = 1;

    // Evento para capturar resultados
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Mantém a transcrição completa atualizada
      const currentTranscription = finalTranscript + interimTranscript;
      transcriptionRef.current = currentTranscription;
    };

    // Eventos de erro
    recognition.onerror = (event) => {
      console.error('Erro de reconhecimento de voz:', event.error);
      
      if (event.error === 'no-speech') {
        setErrorMessage('Nenhuma fala detectada. Por favor, fale mais alto.');
      } else if (event.error === 'audio-capture') {
        setErrorMessage('Microfone não detectado ou sem permissão.');
      } else if (event.error === 'not-allowed') {
        setErrorMessage('Permissão para usar o microfone foi negada.');
      } else {
        setErrorMessage(`Erro de reconhecimento: ${event.error}`);
      }
      
      stopRecognition();
    };

    // Quando o reconhecimento termina
    recognition.onend = () => {
      if (isRecording) {
        // Se ainda estamos em estado de gravação, reinicie
        try {
          recognition.start();
        } catch (e) {
          console.error('Erro ao reiniciar reconhecimento:', e);
        }
      }
    };

    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignora erros ao parar quando já não está ativo
        }
      }
    };
  }, [isRecording]);

  // Inicia o reconhecimento de voz
  const startRecognition = () => {
    if (!isSupported) {
      alert('Reconhecimento de voz não suportado neste navegador. Por favor, use o Chrome, Edge ou Safari.');
      return;
    }

    setErrorMessage('');
    transcriptionRef.current = '';
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
      
      // Inicia o timer para mostrar o tempo de gravação
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento:', error);
      setErrorMessage('Não foi possível iniciar o reconhecimento de voz.');
      setIsRecording(false);
    }
  };

  // Para o reconhecimento de voz
  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erro ao parar reconhecimento:', error);
      }
      
      // Para o timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Importante: Precisamos finalizar o estado de gravação
      setIsRecording(false);
      
      // Chama o callback com a transcrição atual
      console.log("Enviando transcrição finalizada:", transcriptionRef.current);
      if (transcriptionRef.current && transcriptionRef.current.trim()) {
        // Passa true como segundo parâmetro para indicar que deve enviar automaticamente
        onTranscriptionComplete(transcriptionRef.current, autoSend);
      }
    }
  };

  // Limpa recursos ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

  // Formatar o tempo de gravação em MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {!isRecording ? (
        <button
          onClick={startRecognition}
          disabled={disabled || !isSupported}
          className={`
            p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800
            ${disabled || !isSupported
              ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed text-gray-500 dark:text-slate-400' 
              : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
            }
          `}
          aria-label="Iniciar gravação"
          title={!isSupported ? "Reconhecimento de voz não suportado neste navegador" : "Clique para falar"}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400">
            <span className="inline-block h-2 w-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"></span>
            <span>{formatTime(recordingTime)}</span>
          </div>
          
          <button
            onClick={stopRecognition}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Parar gravação e enviar"
            title="Parar gravação e enviar resposta automaticamente"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="absolute left-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md shadow-md w-64 text-xs text-red-600 dark:text-red-400 z-10">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognizer;