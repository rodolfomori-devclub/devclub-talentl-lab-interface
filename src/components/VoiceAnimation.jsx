// src/components/VoiceAnimation.jsx
import React, { useState, useEffect } from 'react';

const VoiceAnimation = ({ isPlaying }) => {
  const [bars, setBars] = useState([]);
  
  useEffect(() => {
    // Gera alturas aleatórias para as barras
    const generateBars = () => {
      return Array.from({ length: 14 }, () => Math.floor(Math.random() * 60) + 20);
    };
    
    let interval;
    if (isPlaying) {
      // Atualiza as barras inicialmente
      setBars(generateBars());
      
      // Atualiza as barras a cada 100ms para simular a modulação da voz
      interval = setInterval(() => {
        setBars(generateBars());
      }, 100);
    } else {
      // Quando não estiver reproduzindo, define as barras para altura mínima
      setBars(Array(14).fill(5));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center h-8 space-x-1">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-100 ${isPlaying ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
          style={{ height: `${height}%` }}
        ></div>
      ))}
    </div>
  );
};

export default VoiceAnimation;