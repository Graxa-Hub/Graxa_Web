import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { InputDate } from './InputDate';
import { useBandas } from '../hooks/useBandas';
import { useLocais } from '../hooks/useLocais';
import { useTurnes } from '../hooks/useTurnes';

export function EventoModal({ isOpen, onClose, onFinish }) {
  const [activeTab, setActiveTab] = useState('show');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { bandas, listarBandas } = useBandas();
  const { locais, listarLocais, criarLocal } = useLocais();
  const { turnes, listarTurnes, criarTurne } = useTurnes();
  
  const [showNovoLocal, setShowNovoLocal] = useState(false);
  const [showNovaTurne, setShowNovaTurne] = useState(false);
  
  const [novoLocal, setNovoLocal] = useState({
    nome: '',
    endereco: '',
    complemento: '',
    estado: '',
    cidade: '',
  });

  const [novaTurne, setNovaTurne] = useState({
    nome: '',
    descricao: '',
    bandaId: '',
  });

  // Estados separados para cada tipo de evento
  const [showData, setShowData] = useState({
    titulo: '',
    descricao: '',
    localId: '',
    turneId: '',
    dataHoraInicio: '',
    dataHoraFim: '',
    cachet: '',
  });

  const [dayOffData, setDayOffData] = useState({
    motivo: '',
    observacoes: '',
    dataHoraInicio: '',
    dataHoraFim: '',
    local: '',
  });

  const [viagemData, setViagemData] = useState({
    destino: '',
    origem: '',
    tipoTransporte: 'onibus',
    dataHoraInicio: '',
    dataHoraFim: '',
    numeroVoo: '',
    hotel: '',
    observacoes: '',
  });

  useEffect(() => {
    if (isOpen) {
      listarBandas();
      listarLocais();
      listarTurnes();
    }
  }, [isOpen, listarBandas, listarLocais, listarTurnes]);

  const tabs = [
    { id: 'show', label: 'Show' },
    { id: 'dayoff', label: 'Day Off' },
    { id: 'viagem', label: 'Viagem' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentStep(1);
  };

  const handleFinish = async () => {
    let eventData;
    
    if (activeTab === 'show') {
      let localIdFinal = showData.localId;
      let turneIdFinal = showData.turneId;

      // Se está cadastrando novo local
      if (showNovoLocal) {
        try {
          const localCriado = await criarLocal(novoLocal);
          localIdFinal = localCriado.id;
        } catch (error) {
          console.error('Erro ao criar local:', error);
          alert('Erro ao cadastrar local. Tente novamente.');
          return;
        }
      }

      // Se está cadastrando nova turnê
      if (showNovaTurne) {
        try {
          const turneCriada = await criarTurne(novaTurne);
          turneIdFinal = turneCriada.id;
        } catch (error) {
          console.error('Erro ao criar turnê:', error);
          alert('Erro ao cadastrar turnê. Tente novamente.');
          return;
        }
      }

      eventData = { 
        tipo: 'SHOW', 
        ...showData,
        localId: localIdFinal,
        turneId: turneIdFinal
      };
    } else if (activeTab === 'dayoff') {
      eventData = { tipo: 'DAY_OFF', ...dayOffData };
    } else {
      eventData = { tipo: 'VIAGEM', ...viagemData };
    }
    
    console.log('Dados do evento:', eventData);
    onFinish?.(eventData);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderContent = () => {
    if (activeTab === 'show') {
      return <ShowContent 
        currentStep={currentStep} 
        data={showData} 
        setData={setShowData}
        bandas={bandas}
        locais={locais}
        turnes={turnes}
        showNovoLocal={showNovoLocal}
        setShowNovoLocal={setShowNovoLocal}
        novoLocal={novoLocal}
        setNovoLocal={setNovoLocal}
        showNovaTurne={showNovaTurne}
        setShowNovaTurne={setShowNovaTurne}
        novaTurne={novaTurne}
        setNovaTurne={setNovaTurne}
      />;
    } else if (activeTab === 'dayoff') {
      return <DayOffContent 
        currentStep={currentStep} 
        data={dayOffData} 
        setData={setDayOffData} 
      />;
    } else {
      return <ViagemContent 
        currentStep={currentStep} 
        data={viagemData} 
        setData={setViagemData} 
      />;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header com abas */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10">
          <div className="flex items-center justify-center gap-8 p-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2 px-4 text-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-red-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Indicador de etapas */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step
                    ? 'bg-red-500'
                    : currentStep > step
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Conteúdo da etapa */}
          {renderContent()}
        </div>

        {/* Footer com botões */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {currentStep === 2 ? 'Finalizar' : 'Próxima Etapa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== MODAL DE SHOW ==========
function ShowContent({ 
  currentStep, 
  data, 
  setData, 
  bandas = [],
  locais = [],
  turnes = [],
  showNovoLocal,
  setShowNovoLocal,
  novoLocal,
  setNovoLocal,
  showNovaTurne,
  setShowNovaTurne,
  novaTurne,
  setNovaTurne
}) {
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <Input
          label="Título do Show"
          placeholder="The Town 2025"
          value={data.titulo}
          onChange={(e) => handleChange('titulo', e.target.value)}
          required
        />
        
        <Input
          label="Cachê (R$)"
          type="number"
          placeholder="5000"
          value={data.cachet}
          onChange={(e) => handleChange('cachet', e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={data.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Detalhes sobre o show..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown de Local */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local do Show <span className="text-red-500">*</span>
          </label>

          {!showNovoLocal ? (
            <div className="space-y-2">
              <select
                value={data.localId || ''}
                onChange={(e) => handleChange('localId', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um local</option>
                {Array.isArray(locais) && locais.length > 0 ? (
                  locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nome} - {local.cidade}, {local.estado}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Nenhum local cadastrado</option>
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowNovoLocal(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Cadastrar novo local
              </button>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
              <h4 className="font-medium text-sm">Novo Local</h4>
              
              <Input
                label="Nome do Local"
                placeholder="Teatro Municipal"
                value={novoLocal.nome}
                onChange={(e) => setNovoLocal({ ...novoLocal, nome: e.target.value })}
                required
              />
              
              <Input
                label="Endereço"
                placeholder="Av. Paulista, 1000"
                value={novoLocal.endereco}
                onChange={(e) => setNovoLocal({ ...novoLocal, endereco: e.target.value })}
                required
              />
              
              <Input
                label="Complemento"
                placeholder="Próximo ao metrô"
                value={novoLocal.complemento}
                onChange={(e) => setNovoLocal({ ...novoLocal, complemento: e.target.value })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Estado"
                  placeholder="São Paulo"
                  value={novoLocal.estado}
                  onChange={(e) => setNovoLocal({ ...novoLocal, estado: e.target.value })}
                  required
                />
                <Input
                  label="Cidade"
                  placeholder="São Paulo"
                  value={novoLocal.cidade}
                  onChange={(e) => setNovoLocal({ ...novoLocal, cidade: e.target.value })}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNovoLocal(false)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                ← Voltar para seleção
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputDate
            label="Data/Hora Início"
            value={data.dataHoraInicio}
            onChange={(e) => handleChange('dataHoraInicio', e.target.value)}
            required
          />
          <InputDate
            label="Data/Hora Fim"
            value={data.dataHoraFim}
            onChange={(e) => handleChange('dataHoraFim', e.target.value)}
            required
          />
        </div>

        {/* Dropdown de Turnês */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Turnê <span className="text-red-500">*</span>
          </label>

          {!showNovaTurne ? (
            <div className="space-y-2">
              <select
                value={data.turneId || ''}
                onChange={(e) => handleChange('turneId', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma turnê</option>
                {Array.isArray(turnes) && turnes.length > 0 ? (
                  turnes.map((turne) => (
                    <option key={turne.id} value={turne.id}>
                      {turne.nomeTurne} {turne.banda?.nomeTurne ? `- ${turne.banda.nomeTurne}` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Nenhuma turnê cadastrada</option>
                )}
              </select>
              {/* <button
                type="button"
                onClick={() => setShowNovaTurne(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Cadastrar nova turnê
              </button> */}
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
              <h4 className="font-medium text-sm">Nova Turnê</h4>
              
              <Input
                label="Nome da Turnê"
                placeholder="Tour Brasil 2025"
                value={novaTurne.nome}
                onChange={(e) => setNovaTurne({ ...novaTurne, nome: e.target.value })}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={novaTurne.descricao}
                  onChange={(e) => setNovaTurne({ ...novaTurne, descricao: e.target.value })}
                  placeholder="Descreva a turnê..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banda da Turnê <span className="text-red-500">*</span>
                </label>
                <select
                  value={novaTurne.bandaId || ''}
                  onChange={(e) => setNovaTurne({ ...novaTurne, bandaId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma banda</option>
                  {Array.isArray(bandas) && bandas.map((banda) => (
                    <option key={banda.id} value={banda.id}>
                      {banda.nome}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowNovaTurne(false)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                ← Voltar para seleção
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            📅 Data: {data.dataInicio || 'Não definida'}<br/>
            🕒 Horário: {data.horario || 'Não definido'}<br/>
            📍 Local: {
              showNovoLocal 
                ? `${novoLocal.nome || 'Novo local'} (será cadastrado)` 
                : (Array.isArray(locais) ? locais.find(l => l.id === data.localId)?.nome || 'Não definido' : 'Não definido')
            }<br/>
            🎸 Turnê: {
              showNovaTurne 
                ? `${novaTurne.nome || 'Nova turnê'} (será cadastrada)` 
                : (Array.isArray(turnes) && data.turneId ? turnes.find(t => t.id === data.turneId)?.nome || 'Não selecionada' : 'Não selecionada')
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ========== MODAL DE DAY OFF (mantém igual) ==========
function DayOffContent({ currentStep, data, setData }) {
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <Input
          label="Motivo do Day Off *"
          placeholder="Descanso, Férias, Manutenção..."
          value={data.motivo}
          onChange={(e) => handleChange('motivo', e.target.value)}
        />
        <Input
          label="Local (opcional)"
          placeholder="Onde você estará durante o day off"
          value={data.local}
          onChange={(e) => handleChange('local', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={data.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            placeholder="Informações adicionais..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de Início *"
            type="date"
            value={data.dataInicio}
            onChange={(e) => handleChange('dataInicio', e.target.value)}
          />
          <Input
            label="Data de Fim *"
            type="date"
            value={data.dataFim}
            onChange={(e) => handleChange('dataFim', e.target.value)}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            📅 Período: {data.dataInicio || '?'} até {data.dataFim || '?'}<br/>
            📍 Local: {data.local || 'Não informado'}<br/>
            📝 Motivo: {data.motivo || 'Não informado'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ========== MODAL DE VIAGEM (mantém igual) ==========
function ViagemContent({ currentStep, data, setData }) {
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Origem *"
            placeholder="São Paulo, SP"
            value={data.origem}
            onChange={(e) => handleChange('origem', e.target.value)}
          />
          <Input
            label="Destino *"
            placeholder="Rio de Janeiro, RJ"
            value={data.destino}
            onChange={(e) => handleChange('destino', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transporte *
          </label>
          <select
            value={data.tipoTransporte}
            onChange={(e) => handleChange('tipoTransporte', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="aviao">✈️ Avião</option>
            <option value="onibus">🚌 Ônibus</option>
            <option value="carro">🚗 Carro</option>
            <option value="van">🚐 Van</option>
          </select>
        </div>
        <Input
          label="Hotel/Hospedagem"
          placeholder="Nome do hotel"
          value={data.hotel}
          onChange={(e) => handleChange('hotel', e.target.value)}
        />
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data/Hora Partida *"
            type="datetime-local"
            value={data.dataPartida}
            onChange={(e) => handleChange('dataPartida', e.target.value)}
          />
          <Input
            label="Data/Hora Chegada *"
            type="datetime-local"
            value={data.dataChegada}
            onChange={(e) => handleChange('dataChegada', e.target.value)}
          />
        </div>
        {data.tipoTransporte === 'aviao' && (
          <Input
            label="Número do Voo"
            placeholder="G3 1234"
            value={data.numeroVoo}
            onChange={(e) => handleChange('numeroVoo', e.target.value)}
          />
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            value={data.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            placeholder="Informações adicionais sobre a viagem..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            🛫 {data.origem || '?'} → 🛬 {data.destino || '?'}<br/>
            🚗 Transporte: {data.tipoTransporte}<br/>
            📅 Partida: {data.dataPartida || 'Não definida'}<br/>
            🏨 Hotel: {data.hotel || 'Não informado'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}