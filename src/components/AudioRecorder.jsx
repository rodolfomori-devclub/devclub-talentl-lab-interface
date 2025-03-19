// frontend/src/components/AudioRecorder.jsx
import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ isRecording, setIsRecording, onAudioRecorded, disabled }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingPermission, setRecordingPermission] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Solicitar permissão para usar o microfone
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Taxa de amostragem reduzida para arquivos menores
        } 
      });
      setRecordingPermission('granted');
      return stream;
    } catch (error) {
      console.error('Erro ao obter permissão de microfone:', error);
      setRecordingPermission('denied');
      return null;
    }
  };

  // Iniciar gravação
  const startRecording = async () => {
    try {
      // Se já temos permissão, criar o stream
      let stream;
      if (recordingPermission !== 'granted') {
        stream = await requestPermission();
        if (!stream) return;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000,
          } 
        });
      }

      streamRef.current = stream;

      // Configurar o Media Recorder
      const options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 32000 }; // Menor taxa de bits
      
      // Verifica se o navegador suporta as opções
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('Codec de áudio não suportado, usando padrão');
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
      } else {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
      }
      
      audioChunksRef.current = [];

      // Evento para capturar os dados
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Evento para quando a gravação parar
      mediaRecorderRef.current.onstop = () => {
        // Limita a duração máxima para 2 minutos (reduz tamanho)
        const maxDuration = 2 * 60; // 2 minutos em segundos
        
        if (recordingTime > maxDuration) {
          alert(`A gravação foi limitada a ${maxDuration} segundos para manter o tamanho do arquivo gerenciável.`);
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Verifica o tamanho do arquivo
        if (audioBlob.size > 10 * 1024 * 1024) { // 10MB
          alert('O arquivo de áudio é muito grande. Por favor, grave uma mensagem mais curta.');
          
          // Limpa as tracks do stream para liberar o microfone
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          
          return;
        }
        
        onAudioRecorded(audioBlob);
        
        // Limpa as tracks do stream para liberar o microfone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Inicia a gravação com timeslices de 1 segundo para capturar dados continuamente
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      
      // Configura timer para mostrar tempo de gravação
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Auto-parar após 2 minutos para evitar arquivos muito grandes
          if (newTime >= 120) {
            stopRecording();
          }
          
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      alert('Não foi possível iniciar a gravação de áudio.');
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Limpa o timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Limpar recursos ao desmontar o componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
    <div className="flex items-center">
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={disabled}
          className={`
            p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800
            ${disabled 
              ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed text-gray-500 dark:text-slate-400' 
              : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
            }
          `}
          aria-label="Iniciar gravação"
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
            onClick={stopRecording}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Parar gravação"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;