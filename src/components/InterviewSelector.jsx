// frontend/src/components/InterviewSelector.jsx
import React, { useState } from 'react';
import { mainInterviewTypes, seniorityLevels, interviewPrompts } from '../data/interviewTypes';

const InterviewSelector = ({ onSelectInterview }) => {
  const [selectedMainType, setSelectedMainType] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [technologies, setTechnologies] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Avança para a próxima etapa de seleção
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Volta para a etapa anterior
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    
    // Limpa seleções subsequentes se voltar
    if (currentStep === 3) {
      setTechnologies('');
      setCustomRequirements('');
    } else if (currentStep === 2) {
      setSelectedLevel(null);
    }
  };

  // Manipula a seleção do tipo principal de entrevista
  const handleMainTypeSelect = (typeId) => {
    setSelectedMainType(typeId);
    setSelectedLevel(null); // Reseta nível ao mudar tipo principal
    setTechnologies('');
    setCustomRequirements('');
    goToNextStep();
  };

  // Manipula a seleção do nível de senioridade
  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    goToNextStep();
  };

  // Inicia a entrevista com os parâmetros selecionados
  const handleStartInterview = async () => {
    if (!selectedMainType || !selectedLevel) {
      alert('Por favor, complete todas as seleções.');
      return;
    }

    setLoading(true);
    try {
      // Constrói o tipo de entrevista
      const interviewType = `${selectedMainType}-${selectedLevel}`;
      
      // Constrói os requisitos específicos
      let requirements = customRequirements;
      
      // Adiciona tecnologias para entrevistas técnicas
      if (selectedMainType === 'technical' && technologies.trim()) {
        requirements = `Tecnologias para focar: ${technologies}. ${requirements}`;
      }
      
      // Seleciona o prompt base e específico
      const basePrompt = interviewPrompts[selectedMainType].base;
      const levelPrompt = interviewPrompts[selectedMainType][selectedLevel];
      
      // Combina os prompts
      const fullPrompt = `${basePrompt}\n\n${levelPrompt}`;
      
      await onSelectInterview(interviewType, requirements, fullPrompt);
    } catch (error) {
      console.error('Erro ao iniciar entrevista:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderiza a primeira etapa - seleção de tipo principal
  const renderMainTypeSelection = () => (
    <div>
      <h3 className="text-xl font-medium text-dark-900 dark:text-white mb-6 text-center">
        Selecione o tipo de entrevista
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mainInterviewTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div
              key={type.id}
              onClick={() => handleMainTypeSelect(type.id)}
              className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 bg-white dark:bg-slate-800 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  <IconComponent />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {type.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Renderiza a segunda etapa - seleção de nível
  const renderLevelSelection = () => (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={goToPreviousStep}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-medium text-dark-900 dark:text-white">
          Selecione o nível de senioridade
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {seniorityLevels.map((level) => {
          const IconComponent = level.icon;
          return (
            <div
              key={level.id}
              className={`
                p-4 rounded-xl border transition-all cursor-pointer
                ${
                  selectedLevel === level.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700 shadow-md'
                    : 'border-gray-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-800 bg-white dark:bg-slate-800'
                }
              `}
              onClick={() => handleLevelSelect(level.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`text-primary-600 dark:text-primary-400 ${selectedLevel === level.id ? 'text-primary-700 dark:text-primary-300' : ''}`}>
                  <IconComponent />
                </div>
                <div>
                  <h3 className="font-medium text-dark-900 dark:text-white">
                    {level.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {level.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Renderiza a terceira etapa - personalização
  const renderCustomization = () => (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={goToPreviousStep}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-medium text-dark-900 dark:text-white">
          Personalize sua entrevista
        </h3>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        {/* Tecnologias (apenas para entrevistas técnicas) */}
        {selectedMainType === 'technical' && (
          <div className="mb-5">
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tecnologias a serem abordadas
            </label>
            <input
              id="technologies"
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="Ex: React, Node.js, JavaScript, TypeScript, SQL"
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Informe as tecnologias específicas que você deseja que sejam abordadas na entrevista.
            </p>
          </div>
        )}
        
        {/* Requisitos adicionais */}
        <div className="mb-5">
          <label htmlFor="customRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Requisitos adicionais (opcional)
          </label>
          <textarea
            id="customRequirements"
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder={selectedMainType === 'technical' 
              ? "Ex: Tenho dificuldade com questões de algoritmos. Tenho 1 ano de experiência." 
              : "Ex: Quero treinar para posição de liderança. Tenho dificuldade em falar sobre projetos passados."}
            className="w-full h-24 px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Adicione detalhes específicos para personalizar a entrevista de acordo com suas necessidades.
          </p>
        </div>

        {/* Botão de início */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleStartInterview}
            disabled={loading || (selectedMainType === 'technical' && !technologies.trim())}
            className={`
              px-6 py-3 rounded-lg font-medium text-white
              ${
                loading || (selectedMainType === 'technical' && !technologies.trim())
                  ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800'
              }
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </span>
            ) : (
              'Iniciar Entrevista'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderiza a etapa atual com base no estado
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderMainTypeSelection();
      case 2:
        return renderLevelSelection();
      case 3:
        return renderCustomization();
      default:
        return renderMainTypeSelection();
    }
  };

  // Renderização principal
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white mb-2">
          DevClub TalentLab
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Simule entrevistas com Fernanda, nossa recrutadora virtual especializada 
          em ajudar programadores a se prepararem para processos seletivos.
        </p>
      </div>

      {/* Indicador de progresso */}
      <div className="hidden sm:flex items-center justify-center mb-8">
        <div className="flex items-center w-full max-w-md">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 ${
            currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-slate-700'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 ${
            currentStep >= 3 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-slate-700'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
          }`}>
            3
          </div>
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  );
};

export default InterviewSelector;