import React, { useState } from 'react';
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { ChevronDown, Settings, Camera, Volume2, Guitar } from 'lucide-react';

// Componente do seletor de evento
const EventSelector = ({ eventName, eventType }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
            {eventName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{eventName}</div>
            <div className="text-sm text-gray-500">{eventType}</div>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

// Componente do card de etapa
const StageCard = ({ number, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
          {number}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Componente de card de função
const RoleCard = ({ role, isSelected, onClick }) => {
  const Icon = role.icon;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-red-300' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-red-50' : 'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            isSelected ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{role.title}</h3>
          <p className="text-sm text-gray-500">{role.description}</p>
        </div>
      </div>
      <ChevronDown className="w-5 h-5 text-gray-400" />
    </div>
  );
};

// Componente de lista de funções
const RolesList = ({ roles, selectedRole, onSelectRole }) => {
  return (
    <div className="space-y-4 max-w-2xl">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          isSelected={selectedRole === role.id}
          onClick={() => onSelectRole(role.id)}
        />
      ))}
    </div>
  );
};

// Componente de card de associado
const AssociateCard = ({ associate, onAssociate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
      <img
        src={associate.image}
        alt={associate.name}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm">{associate.name}</h3>
        <p className="text-xs text-gray-500">{associate.role}</p>
        <p className="text-xs text-gray-400 mt-1">
          Shows realizados: {associate.shows}
        </p>
      </div>
      <button
        onClick={() => onAssociate(associate)}
        className="px-4 py-2 bg-gray-800 text-white text-xs rounded-full hover:bg-gray-700 transition-colors flex-shrink-0"
      >
        escolher
      </button>
    </div>
  );
};

// Componente do sidebar de associados
const AssociatesSidebar = ({ associates, onAssociate, selectedRole }) => {
  // Nenhuma função selecionada
  if (!selectedRole) {
    return (
      <div className="w-96 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500 p-8">
          <p className="text-sm">Selecione uma função para ver os</p>
          <p className="text-sm">associados disponíveis</p>
        </div>
      </div>
    );
  }

  // Nenhum associado para a função
  if (associates.length === 0) {
    return (
      <div className="w-96 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500 p-8">
          <p className="text-sm">Nenhum associado disponível</p>
          <p className="text-sm">para esta função</p>
        </div>
      </div>
    );
  }

  // Lista de associados
  return (
    <div className="w-96 bg-gray-50 flex flex-col h-screen border-l border-gray-200">
      {/* Header do sidebar */}
      <div className="px-8 pt-10 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Associados disponíveis
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecione alguém para essa função
        </p>
      </div>

      {/* Lista com scroll suave */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {associates.map((associate, index) => (
          <AssociateCard
            key={index}
            associate={associate}
            onAssociate={onAssociate}
          />
        ))}
      </div>
    </div>
  );
};


// Componente do conteúdo principal
const MainContent = ({ roles, selectedRole, onSelectRole }) => {
  return (
    <div className="flex-1 bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <EventSelector
          eventName="Boogarins"
          eventType="Chuva dos Olhos"
        />
      </div>

      {/* Event Stage */}
      <StageCard
        number="1"
        title="1ª Etapa"
        description="Escolha as pessoas que irão contribuir com esse evento"
      />

      {/* Roles List */}
      <RolesList
        roles={roles}
        selectedRole={selectedRole}
        onSelectRole={onSelectRole}
      />
    </div>
  );
};

// Layout específico para a página de adicionar usuários
const EventDashboardLayout = ({ children, sidebar }) => {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {children}
      {sidebar}
    </div>
  );
};

// Componente principal exportável
export const AdicionandoUsuarios = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'produtor',
      title: 'Produtor de estrada',
      icon: Settings,
      description: 'Responsável pela organização da turnê'
    },
    {
      id: 'tecnico-luz',
      title: 'Técnico de Luz',
      icon: Camera,
      description: 'Responsável pela iluminação do show'
    },
    {
      id: 'tecnico-som',
      title: 'Técnico de som',
      icon: Volume2,
      description: 'Responsável pelo áudio e som ao vivo'
    },
    {
      id: 'road',
      title: 'Road',
      icon: Guitar,
      description: 'Auxilia no transporte e montagem dos equipamentos'
    }
  ];

  const associates = [
    {
      name: 'Gabriel da Silva',
      role: 'Produtor de Estrada',
      roleId: 'produtor',
      shows: 34,
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      name: 'Daniel Sena',
      role: 'Técnico de Luz',
      roleId: 'tecnico-luz',
      shows: 23,
      image: 'https://i.pravatar.cc/150?img=13'
    },
    {
      name: 'Leandro Robotino',
      role: 'Técnico de Som',
      roleId: 'tecnico-som',
      shows: 18,
      image: 'https://i.pravatar.cc/150?img=33'
    },
    {
      name: 'Bruno Araujo',
      role: 'Road',
      roleId: 'road',
      shows: 11,
      image: 'https://i.pravatar.cc/150?img=14'
    },
    {
      name: 'Carlos Santos',
      role: 'Produtor de Estrada',
      roleId: 'produtor',
      shows: 28,
      image: 'https://i.pravatar.cc/150?img=15'
    },
    {
      name: 'Maria Oliveira',
      role: 'Técnico de Luz',
      roleId: 'tecnico-luz',
      shows: 31,
      image: 'https://i.pravatar.cc/150?img=16'
    }
  ];

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleAssociate = (associate) => {
    console.log('Associar:', associate);
    // Aqui você pode adicionar a lógica para associar o profissional à função
  };

  // Filtra associados com base na função selecionada
  const filteredAssociates = selectedRole
    ? associates.filter(a => a.roleId === selectedRole)
    : [];

  return (
    <Layout>
          <Sidebar />
          <EventDashboardLayout
          sidebar={
            <AssociatesSidebar
              associates={filteredAssociates}
              onAssociate={handleAssociate}
              selectedRole={selectedRole}
            />
          }
        >
          <MainContent
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
          />
        </EventDashboardLayout>
        </Layout>
  );
};


