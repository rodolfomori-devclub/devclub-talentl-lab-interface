// frontend/src/components/MessageBubble.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message, isLastMessage, isPlaying }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div 
      className={`
        flex ${isAssistant ? 'justify-start' : 'justify-end'} 
        mb-4 w-full max-w-full
      `}
    >
      {isAssistant && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mr-2 mt-1">
          <svg className="h-5 w-5 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      
      <div 
        className={`
          relative px-4 py-3 rounded-lg shadow-sm
          ${isAssistant 
            ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 max-w-[80%]' 
            : 'bg-primary-600 dark:bg-primary-700 text-white max-w-[75%]'
          }
        `}
      >
        {isAssistant && isLastMessage && isPlaying && (
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-primary-500 rounded-full animate-pulse"></div>
        )}
        
        <div className={`prose prose-sm dark:prose-invert max-w-none ${isAssistant ? '' : 'text-white'}`}>
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {!isAssistant && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center ml-2 mt-1">
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;