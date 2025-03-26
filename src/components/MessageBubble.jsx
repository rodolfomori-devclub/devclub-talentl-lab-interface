// src/components/MessageBubble.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import VoiceAnimation from './VoiceAnimation';
import Fernanda from '../assets/fernanda.png'

const MessageBubble = ({ message, isLastMessage, isPlaying }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div 
      className={`
        flex ${isAssistant ? 'justify-start' : 'justify-end'} 
        mb-6 w-full max-w-full
        ${isLastMessage ? 'animate-slide-up' : ''}
      `}
      style={{ 
        animationDelay: isLastMessage ? '0.1s' : '0s',
        animationDuration: '0.3s'
      }}
    >
      {isAssistant && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white overflow-hidden mr-2 mt-1 border border-gray-200 dark:border-slate-700 shadow-sm">
          {/* Foto da Fernanda para o avatar da assistente */}
          <img 
            src={Fernanda} 
            alt="Fernanda" 
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback para ícone
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2337E359"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
              e.target.className = "h-full w-full object-cover bg-primary-light";
            }}
          />
        </div>
      )}
      
      <div 
        className={`
          relative px-4 py-3 rounded-lg shadow-sm transform transition-all
          ${isAssistant 
            ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 max-w-[80%]' 
            : 'bg-primary dark:bg-primary-dark text-white max-w-[75%]'
          }
          ${isLastMessage ? 'hover:shadow-md' : ''}
        `}
      >
        {isAssistant && isLastMessage && isPlaying && (
          <div className="absolute -top-2 -right-2 flex items-center justify-center">
            <div className="h-6 w-10">
              <VoiceAnimation isPlaying={isPlaying} />
            </div>
          </div>
        )}
        
        <div className={`prose prose-sm dark:prose-invert max-w-none ${isAssistant ? '' : 'text-white'}`}>
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {!isAssistant && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center ml-2 mt-1 shadow-sm">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;