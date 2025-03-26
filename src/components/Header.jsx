// src/components/Header.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import NetworkingAnimation from './NetworkingAnimation';
import Logo from '../assets/logo.svg'

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <header className="relative bg-white dark:bg-slate-800 shadow-sm">
      {/* Fundo de animação */}
      <div className="absolute inset-0 opacity-10">
        <NetworkingAnimation />
      </div>
      
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          {/* Logo com animação sutil */}
          <img src={Logo} className='h-10 rounded-md'/>
          <h1 className="text-xl font-bold text-primary-700 dark:text-primary">
            EntrevistaLab
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <a 
            href="https://devclub.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block text-sm text-primary-600 dark:text-primary hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            Visite o DevClub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;