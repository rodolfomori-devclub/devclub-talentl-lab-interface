// src/components/NetworkingAnimation.jsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const NetworkingAnimation = ({ className = "", height = "100%" }) => {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef(null);

  // Efeito de partículas animadas no background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Configura o canvas para ter o tamanho da viewport
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Configurações das partículas
    const particlesArray = [];
    const numberOfParticles = Math.min(canvas.width / 10, 100);
    
    // Cores baseadas no tema
    // Cores baseadas no tema com opacidade aumentada para melhor visibilidade
    const particleColor = isDarkMode ? '#37E35960' : '#37E35960';
    const connectingLineColor = isDarkMode ? '#37E35940' : '#37E35950';
    
    // Classe de partícula
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      
      // Atualiza posição
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebote nas bordas
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      // Desenha partícula
      draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Inicializa partículas
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Conecta partículas próximas com linhas
    const connect = () => {
      const maxDistance = canvas.width / 10;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.strokeStyle = connectingLineColor;
            ctx.lineWidth = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Loop de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 ${className}`}
      style={{ height }}
    />
  );
};

export default NetworkingAnimation;