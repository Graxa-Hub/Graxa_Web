import React, { useState } from "react";
import { Settings, Camera, Volume2, Guitar, ChevronDown } from "lucide-react";

const Etapa1Funcoes = ({ selectedRoles, setSelectedRoles }) => {
  const [activeRole, setActiveRole] = useState(null);

  const roles = [
    {
      id: "produtor",
      title: "Produtor de estrada",
      icon: Settings,
      description: "Responsável pela organização da turnê",
    },
    {
      id: "tecnico-luz",
      title: "Técnico de Luz",
      icon: Camera,
      description: "Responsável pela iluminação do show",
    },
    {
      id: "tecnico-som",
      title: "Técnico de som",
      icon: Volume2,
      description: "Responsável pelo áudio e som ao vivo",
    },
    {
      id: "road",
      title: "Road",
      icon: Guitar,
      description: "Auxilia no transporte e montagem dos equipamentos",
    },
  ];

  const toggleRole = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const RoleCard = ({ role }) => {
    const Icon = role.icon;

    const selected = selectedRoles.includes(role.id);

    return (
      <div
        onClick={() => toggleRole(role.id)}
        className={`bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer border transition-all ${
          selected ? "border-green-600" : "border-transparent"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            selected ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              selected ? "text-green-600" : "text-gray-600"
            }`}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{role.title}</h3>
          <p className="text-sm text-gray-600">{role.description}</p>
        </div>

        <ChevronDown className="text-gray-400" />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">
        Seleção de Funções e Equipe
      </h2>

      <p className="text-gray-600 mb-4">
        Escolha as funções necessárias para este evento.  
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
};

export default Etapa1Funcoes;
