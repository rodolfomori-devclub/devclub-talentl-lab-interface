// src/components/LandingPage.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import NetworkingAnimation from './NetworkingAnimation';
import Fernanda from '../assets/fernanda.png'

const LandingPage = ({ onGetStarted }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Fundo animado aprimorado */}
     {/* Fundo animado mais visível */}
     <div className="absolute inset-0 z-0 opacity-50">
          <NetworkingAnimation />
        </div>
        
        {/* Efeitos decorativos */}
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Conteúdo textual */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-secondary dark:text-white leading-tight animate-slide-up">
                Prepare-se para <span className="text-primary">entrevistas</span> com nossa recrutadora virtual
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Pratique suas habilidades de entrevista com Fernanda, uma recrutadora virtual especializada em ajudar desenvolvedores a se destacarem em processos seletivos.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                >
                  <span>Começar Agora</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
                
                <a 
                  href="#features" 
                  className="px-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary-dark/20 font-medium rounded-lg transition-colors"
                >
                  Saiba Mais
                </a>
              </div>
              
              {/* Estatísticas */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-4 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-md">
                  <p className="text-3xl font-bold text-primary">5000+</p>
                  <p className="text-gray-600 dark:text-gray-400">Usuários</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-md">
                  <p className="text-3xl font-bold text-primary">20k+</p>
                  <p className="text-gray-600 dark:text-gray-400">Entrevistas</p>
                </div>
                <div className="text-center p-4 col-span-2 md:col-span-1 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-md">
                  <p className="text-3xl font-bold text-primary">97%</p>
                  <p className="text-gray-600 dark:text-gray-400">Satisfação</p>
                </div>
              </div>
            </div>
            
            {/* Imagem da Fernanda com efeitos */}
            <div className="flex-1 mt-10 lg:mt-0 max-w-md mx-auto animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl transform -translate-x-6 translate-y-6"></div>
                
                <div className="relative overflow-hidden rounded-2xl border-4 border-white dark:border-slate-700 shadow-2xl">
                  <img 
                    src={Fernanda}
                    alt="Fernanda - Recrutadora Tech" 
                    className="w-full h-auto rounded-xl transform transition-transform duration-700 hover:scale-105"
                  />
                </div>
                
                {/* Badge flutuante */}
                <div className="absolute -top-6 -right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg animate-float">
                  <p className="text-sm font-bold">Tech Recruiter</p>
                </div>
                
                {/* Feedback cards */}
                <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg max-w-xs animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Ótima experiência!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary dark:text-white mb-4">Por que escolher a EntrevistaLab?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fernanda já ajudou milhares de desenvolvedores a se prepararem para entrevistas técnicas e comportamentais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Especialista em Tech</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fernanda é especializada em recrutamento para áreas de tecnologia, com conhecimento profundo sobre o mercado e requisitos técnicos.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Entrevistas Personalizadas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha entre entrevistas técnicas ou comportamentais, com níveis personalizados de junior a especialista.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Feedback Detalhado</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receba feedback construtivo sobre suas respostas, destacando pontos fortes e oportunidades de melhoria.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Multilíngue</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pratique suas entrevistas em português ou inglês, preparando-se para oportunidades nacionais e internacionais.
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Disponível 24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pratique quando quiser, quantas vezes precisar. Fernanda está sempre disponível para ajudar no seu desenvolvimento.
              </p>
            </div>
            
            {/* Card 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary dark:text-white">Atualizada</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fernanda está sempre atualizada com as últimas tendências do mercado e técnicas de entrevista mais recentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary dark:text-white mb-4">O que nossos usuários dizem</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Desenvolvedores que utilizaram o EntrevistaLab compartilham suas experiências
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Após praticar com a Fernanda, me senti muito mais confiante na minha entrevista real. O feedback dela foi valioso e me ajudou a identificar pontos que eu precisava melhorar."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  RL
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-secondary dark:text-white">Rafael Lima</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desenvolvedor Frontend</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Incrível como a Fernanda simula perfeitamente uma entrevista real! As perguntas são desafiadoras e relevantes para o mercado atual. Recomendo para todos que estão em busca de uma nova oportunidade."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  JS
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-secondary dark:text-white">Carol Santos</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desenvolvedora Backend</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Consegui meu emprego atual após praticar entrevistas comportamentais com a Fernanda. Ela me ajudou a estruturar melhor minhas respostas sobre projetos anteriores e desafios enfrentados."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  MA
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-secondary dark:text-white">Marcos Almeida</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Desenvolvedor Fullstack</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10 dark:bg-primary-dark/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary dark:text-white mb-6">
              Pronto para melhorar suas habilidades em entrevistas?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              Comece agora e pratique com Fernanda, nossa recrutadora virtual especializada em tecnologia.
            </p>
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-medium rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse-slow"
            >
              Começar Agora
            </button>
          </div>
        </div>
        
        {/* Background patterns */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24 text-primary/5 dark:text-primary-dark/5 fill-current">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;